import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ ok: false, error: "Invalid coordinates" }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}&format=json`;
  const resp = await fetch(url, {
    headers: { "User-Agent": "HerStory/1.0", "Accept": "application/json" },
  });
  const data = await resp.json();
  return NextResponse.json({ ok: true, placeName: data?.display_name ?? "Pinned place" });
}
