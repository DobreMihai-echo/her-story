import { NextResponse } from "next/server";

type Cached = { ts: number; data: any };
const cache = new Map<string, Cached>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ ok: false, error: "Invalid coordinates" }, { status: 400 });
  }

  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL_MS) {
    return NextResponse.json({ ok: true, placeName: hit.data });
  }

  const url =
    `https://nominatim.openstreetmap.org/reverse?` +
    `lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}&format=json`;

  const resp = await fetch(url, {
    headers: {
      "User-Agent": "HerCity/1.0 (personal gift site)",
      "Accept": "application/json",
    },
  });

  const data = await resp.json();
  const placeName =
    data?.display_name ||
    (data?.name ? String(data.name) : `Lat ${lat.toFixed(3)}, Lng ${lng.toFixed(3)}`);

  cache.set(key, { ts: Date.now(), data: placeName });
  return NextResponse.json({ ok: true, placeName });
}
