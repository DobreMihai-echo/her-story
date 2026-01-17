import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  const memories = await prisma.memory.findMany({
    where: { isVisible: true },
    include: { media: true },
    orderBy: { createdAt: "desc" },
    take: 600,
  });

  const byPrompt = prompts.map((p) => {
    const answers = memories
      .filter((m) => m.promptId === p.id)
      .slice(0, 10)
      .map((m) => {
        const photos = (m.media || []).map((x) => x.mediaUrl).filter(Boolean);
        return {
          id: m.id,
          message: m.message,
          author: m.isAnonymous ? "Anonymous" : (m.authorName ?? "Someone"),
          placeName: m.placeName,
          lat: m.placeLat,
          lng: m.placeLng,
          photo: photos[0] ?? null,
          photos, // <-- NEW: all photos
        };
      });

    return {
      promptId: p.id,
      promptTitle: p.title,
      helperText: p.helperText,
      answers,
    };
  });

  // include memories without promptId (so Memories page never looks empty)
  const otherAnswers = memories
    .filter((m) => !m.promptId)
    .slice(0, 20)
    .map((m) => {
      const photos = (m.media || []).map((x) => x.mediaUrl).filter(Boolean);
      return {
        id: m.id,
        message: m.message,
        author: m.isAnonymous ? "Anonymous" : (m.authorName ?? "Someone"),
        placeName: m.placeName,
        lat: m.placeLat,
        lng: m.placeLng,
        photo: photos[0] ?? null,
        photos,
      };
    });

  const groups = [
    ...byPrompt,
    ...(otherAnswers.length
      ? [
          {
            promptId: "none",
            promptTitle: "Other memories",
            helperText: "Notes added without a question—still part of the story.",
            answers: otherAnswers,
          },
        ]
      : []),
  ];

  const res = NextResponse.json({ ok: true, byPrompt: groups });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
