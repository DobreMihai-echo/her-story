import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  const memories = await prisma.memory.findMany({
    where: { isVisible: true },
    include: { media: true, prompt: true },
    orderBy: { createdAt: "desc" },
    take: 400,
  });

  const byPrompt = prompts.map((p) => {
    const answers = memories
      .filter((m) => m.promptId === p.id)
      .slice(0, 8)
      .map((m) => ({
        id: m.id,
        message: m.message,
        author: m.isAnonymous ? "Anonymous" : (m.authorName ?? "Someone"),
        placeName: m.placeName,
        lat: m.placeLat,
        lng: m.placeLng,
        photo: m.media?.[0]?.mediaUrl ?? null,
      }));

    return {
      promptId: p.id,
      promptTitle: p.title,
      helperText: p.helperText,
      answers,
    };
  });

  const places = memories
    .filter((m) => m.placeLat !== null && m.placeLng !== null)
    .slice(0, 20)
    .map((m) => ({
      id: m.id,
      placeName: m.placeName,
      lat: m.placeLat,
      lng: m.placeLng,
      message: m.message,
      author: m.isAnonymous ? "Anonymous" : (m.authorName ?? "Someone"),
      photo: m.media?.[0]?.mediaUrl ?? null,
    }));

  const photos = memories
    .filter((m) => m.media.length > 0)
    .slice(0, 30)
    .map((m) => ({
      id: m.id,
      message: m.message,
      author: m.isAnonymous ? "Anonymous" : (m.authorName ?? "Someone"),
      photo: m.media[0].mediaUrl,
    }));

  return NextResponse.json({
    ok: true,
    byPrompt,
    places,
    photos,
  });
}
