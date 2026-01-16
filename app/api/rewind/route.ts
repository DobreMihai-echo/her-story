import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  // Pull a reasonable amount of recent visible memories
  const memories = await prisma.memory.findMany({
    where: { isVisible: true },
    include: { media: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const byPrompt = prompts.map((p) => {
    const answers = memories
      .filter((m) => m.promptId === p.id)
      .slice(0, 10)
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

  return NextResponse.json({ ok: true, byPrompt });
}
