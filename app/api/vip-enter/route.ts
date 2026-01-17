import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const passcode = typeof body.passcode === "string" ? body.passcode : "";

  const expected = process.env.VIP_PASSCODE;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "VIP_PASSCODE is not set." }, { status: 500 });
  }

  if (passcode !== expected) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("vip", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
