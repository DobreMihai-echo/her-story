import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const admin = cookieStore.get("admin")?.value;
  if (admin !== "1") return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length < 5) return NextResponse.json({ ok: false, error: "Message too short" }, { status: 400 });

    const isAnonymous = Boolean(body.isAnonymous);
    const authorName = isAnonymous ? null : (typeof body.authorName === "string" ? body.authorName.trim() : null);

    await prisma.memory.update({
      where: { id },
      data: {
        authorName: authorName || null,
        isAnonymous,
        relationship: typeof body.relationship === "string" ? body.relationship.trim() || null : null,
        message,
        promptId: typeof body.promptId === "string" ? body.promptId : null,
        placeName: typeof body.placeName === "string" ? body.placeName.trim() || null : null,
        placeLat: typeof body.placeLat === "number" ? body.placeLat : null,
        placeLng: typeof body.placeLng === "number" ? body.placeLng : null,
        isVisible: Boolean(body.isVisible),
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not update memory" }, { status: 500 });
  }
}
