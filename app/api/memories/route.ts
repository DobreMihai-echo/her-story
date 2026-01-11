import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length < 5) return NextResponse.json({ ok: false, error: "Message too short" }, { status: 400 });

    const isAnonymous = Boolean(body.isAnonymous);
    const authorName = isAnonymous ? null : (typeof body.authorName === "string" ? body.authorName.trim() : null);
    const relationship = typeof body.relationship === "string" ? body.relationship.trim() || null : null;

    const promptId = typeof body.promptId === "string" ? body.promptId : null;

    const placeName = typeof body.placeName === "string" ? body.placeName.trim() || null : null;
    const placeLat = typeof body.placeLat === "number" ? body.placeLat : null;
    const placeLng = typeof body.placeLng === "number" ? body.placeLng : null;

    const mediaUrls: string[] = Array.isArray(body.mediaUrls) ? body.mediaUrls : [];
    const cleanMedia = mediaUrls.filter((u) => typeof u === "string" && u.startsWith("http")).slice(0, 8);

    const created = await prisma.memory.create({
      data: {
        authorName: authorName || null,
        isAnonymous,
        relationship,
        message,
        promptId,
        placeName,
        placeLat,
        placeLng,
        isVisible: true,
        isFeatured: false,
        media: cleanMedia.length ? { create: cleanMedia.map((url) => ({ mediaUrl: url })) } : undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not submit memory" }, { status: 500 });
  }
}
