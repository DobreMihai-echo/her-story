import { NextResponse } from "next/server";

type Cached = { ts: number; data: any };
const cache = new Map<string, Cached>();
const TTL_MS = 1000 * 60 * 60 * 6;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 3) return NextResponse.json({ ok: true, results: [] });

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL_MS) return NextResponse.json({ ok: true, results: hit.data });

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=0&limit=6`;
  const resp = await fetch(url, {
    headers: { "User-Agent": "HerStory/1.0", "Accept": "application/json" },
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
