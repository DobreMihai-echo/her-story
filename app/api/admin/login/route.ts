import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { passcode } = await req.json();

  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSCODE not set" }, { status: 500 });
  }

  if (typeof passcode !== "string" || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ ok: false, error: "Invalid passcode" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
