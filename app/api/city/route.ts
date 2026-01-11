import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const memories = await prisma.memory.findMany({
    where: { isVisible: true, placeLat: { not: null }, placeLng: { not: null } },
    include: { media: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  return NextResponse.json({
    ok: true,
    memories: memories.map((m) => ({
      id: m.id,
      message: m.message,
      author: m.isAnonymous ? "Anonymous" : (m.authorName ?? "Someone"),
      placeName: m.placeName,
      lat: m.placeLat,
      lng: m.placeLng,
      photo: m.media?.[0]?.mediaUrl ?? null,
    })),
  });
}
