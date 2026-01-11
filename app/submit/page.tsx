"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cloudinaryUploadUrl } from "@/lib/cloudinary";

type Prompt = { id: string; title: string; helperText?: string | null };
type ApiResp = { ok: true; id: string } | { ok: false; error: string };
type PlacePick = { name: string; lat: number; lng: number };

const SubmitMapPanelClient = dynamic(() => import("./SubmitMapClient"), { ssr: false });

export default function SubmitPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptId, setPromptId] = useState<string>("");

  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");

  const [placeName, setPlaceName] = useState("");
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);

  const [placeQuery, setPlaceQuery] = useState("");
  const [placeOptions, setPlaceOptions] = useState<PlacePick[]>([]);

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResp | null>(null);

  const selectedPrompt = useMemo(
    () => prompts.find((p) => p.id === promptId),
    [prompts, promptId]
  );

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/prompts");
      const d = await r.json();
      if (d.ok) {
        setPrompts(d.prompts);
        if (d.prompts?.[0]?.id) setPromptId(d.prompts[0].id);
      }
    })();
  }, []);

  async function uploadFiles(files: FileList | null) {
    if (!files || !files.length) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!preset || !cloud) {
      alert("Cloudinary env vars missing (cloud name / preset).");
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files).slice(0, 5)) {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", preset);
        form.append("folder", "her-city/memories");

        const resp = await fetch(cloudinaryUploadUrl(), { method: "POST", body: form });

        // safer parsing
        const raw = await resp.text();
        let data: any = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch {}

        if (!resp.ok || !data.secure_url) continue;
        uploaded.push(data.secure_url);
      }

      setMediaUrls((prev) => [...prev, ...uploaded].slice(0, 8));
    } finally {
      setUploading(false);
    }
  }

  // Search via your /api/geocode proxy
  const timerRef = (globalThis as any).__placeTimerRef || { t: null };
  (globalThis as any).__placeTimerRef = timerRef;

  async function searchPlaces(q: string) {
    const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
    const d = await r.json();
    if (d.ok) setPlaceOptions(d.results);
  }

  function onPlaceSearchChange(v: string) {
    setPlaceQuery(v);
    setPlaceOptions([]);
    if (timerRef.t) clearTimeout(timerRef.t);
    if (v.trim().length < 3) return;
    timerRef.t = setTimeout(() => searchPlaces(v.trim()), 300);
  }

  function choosePlace(p: PlacePick) {
    setPlaceOptions([]);
    setPlaceQuery(p.name);
    setPlaceName(p.name);
    setPlaceLat(p.lat);
    setPlaceLng(p.lng);
  }

  async function pickPin(lat: number, lng: number) {
    setPlaceLat(lat);
    setPlaceLng(lng);

    const r = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
    const d = await r.json();
    if (d.ok) setPlaceName(d.placeName);
  }

  async function submit() {
    if (uploading) return;

    setLoading(true);
    setResult(null);

    const resp = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptId,
        authorName: authorName.trim() || null,
        isAnonymous,
        relationship: relationship.trim() || null,
        message: message.trim(),
        placeName: placeName.trim() || null,
        placeLat,
        placeLng,
        mediaUrls,
      }),
    });

    const data = (await resp.json()) as ApiResp;
    setResult(data);
    setLoading(false);

    if (data.ok) {
      setAuthorName("");
      setIsAnonymous(false);
      setRelationship("");
      setMessage("");
      setPlaceName("");
      setPlaceLat(null);
      setPlaceLng(null);
      setPlaceQuery("");
      setPlaceOptions([]);
      setMediaUrls([]);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="badge">WRITE A NOTE</div>
          <h1 className="mt-4 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Drop a pin. Leave a note.
          </h1>
          <p className="mt-3 text-[color:var(--muted)] text-lg">
            Click the map to add a location, then write your message.
          </p>
        </div>
        <BackButton />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* LEFT FORM */}
        <div className="lg:col-span-7 card p-8 space-y-5">
          <div>
            <label className="text-sm text-[color:var(--muted)]">Prompt</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
              style={{ borderColor: "var(--line)" }}
              value={promptId}
              onChange={(e) => setPromptId(e.target.value)}
            >
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            {selectedPrompt?.helperText && (
              <div className="mt-2 text-sm text-[color:var(--muted)]">{selectedPrompt.helperText}</div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-[color:var(--muted)]">Your name</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                style={{ borderColor: "var(--line)" }}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isAnonymous}
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--muted)]">Relationship</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                style={{ borderColor: "var(--line)" }}
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
            Post as anonymous
          </label>

          <div>
            <label className="text-sm text-[color:var(--muted)]">Message</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
              style={{ borderColor: "var(--line)" }}
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-[color:var(--muted)]">Photos</label>
            <input type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files)} disabled={uploading} />
            {uploading && <div className="mt-2 text-sm text-[color:var(--muted)]">Uploading…</div>}
            {mediaUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {mediaUrls.map((u) => (
                  <img key={u} src={u} alt="" className="h-28 w-full rounded-2xl object-cover border" style={{ borderColor: "var(--line)" }} />
                ))}
              </div>
            )}
          </div>

          <button onClick={submit} disabled={loading || uploading || message.trim().length < 5} className="btn-pink w-full">
            {uploading ? "Uploading…" : loading ? "Submitting…" : "Publish"}
          </button>

          {result && (
            <div className="text-sm">
              {result.ok ? <div className="text-[color:var(--muted)]">It’s live. Thank you.</div> : <div className="text-red-600">Error: {result.error}</div>}
            </div>
          )}
        </div>

        {/* RIGHT MAP PANEL (client-only) */}
        <div className="lg:col-span-5">
          <SubmitMapPanelClient
            placeLat={placeLat}
            placeLng={placeLng}
            placeName={placeName}
            onPickPin={pickPin}
            onSetPlaceName={setPlaceName}
            placeQuery={placeQuery}
            onPlaceSearchChange={onPlaceSearchChange}
            placeOptions={placeOptions}
            onChoosePlace={choosePlace}
          />
        </div>
      </div>
    </main>
  );
}

function BackButton() {
  return (
    <button
      className="btn-ghost"
      onClick={() => (history.length > 1 ? history.back() : (window.location.href = "/"))}
    >
      Back
    </button>
  );
}
