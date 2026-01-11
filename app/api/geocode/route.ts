import { NextResponse } from "next/server";

type Cached = { ts: number; data: any };
const cache = new Map<string, Cached>();
const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 3) return NextResponse.json({ ok: true, results: [] });

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL_MS) {
    return NextResponse.json({ ok: true, results: hit.data });
  }

  const url =
    `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(q)}&format=json&addressdetails=0&limit=6`;

  const resp = await fetch(url, {
    headers: {
      // Best-effort identification; Node fetch allows this.
      "User-Agent": "HerCity/1.0 (personal gift site)",
      "Accept": "application/json",
    },
  });

  const data = await resp.json();
  const results = (data || []).map((x: any) => ({
    name: x.display_name,
    lat: Number(x.lat),
    lng: Number(x.lon),
  })).filter((x: any) => Number.isFinite(x.lat) && Number.isFinite(x.lng));

  cache.set(key, { ts: Date.now(), data: results });
  return NextResponse.json({ ok: true, results });
}
