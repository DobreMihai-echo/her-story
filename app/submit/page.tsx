"use client";

import { useEffect, useMemo, useState, DragEvent } from "react";
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
  const [showSuccess, setShowSuccess] = useState(false);

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

  async function uploadFiles(files: FileList | File[]) {
    if (!files || !files.length) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!preset || !cloud) {
      alert("Image upload is not configured.");
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
        const raw = await resp.text();
        let data: any = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch {}

        if (resp.ok && data.secure_url) uploaded.push(data.secure_url);
      }

      setMediaUrls((prev) => [...prev, ...uploaded].slice(0, 8));
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  // Search (via your /api/geocode)
  const timerKey = "__place_timer__";
  async function searchPlaces(q: string) {
    const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
    const d = await r.json();
    if (d.ok) setPlaceOptions(d.results);
  }
  function onPlaceSearchChange(v: string) {
    setPlaceQuery(v);
    setPlaceOptions([]);

    const anyWin = window as any;
    if (anyWin[timerKey]) clearTimeout(anyWin[timerKey]);
    if (v.trim().length < 3) return;

    anyWin[timerKey] = setTimeout(() => searchPlaces(v.trim()), 300);
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
        authorName: isAnonymous ? null : authorName.trim() || null,
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
      setShowSuccess(true);

      // reset
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
    <>
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="card max-w-md w-full p-8 text-center">
            <div className="badge">SENT</div>
            <h2 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
              Your memory was added.
            </h2>
            <p className="mt-3 text-[color:var(--muted)]">
              And just like that, another chapter was written.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button className="btn-ghost" onClick={() => (window.location.href = "/")}>
                Back home
              </button>
              <button className="btn-pink" onClick={() => setShowSuccess(false)}>
                Add another
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="badge">WRITE A MEMORY</div>
            <h1 className="mt-4 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Drop a pin. Leave a memory.
            </h1>
            <p className="mt-3 text-[color:var(--muted)] text-lg">
              Click the map or search a place, then write your message.
            </p>
          </div>
          <button className="btn-ghost" onClick={() => (history.length > 1 ? history.back() : (window.location.href = "/"))}>
            Back
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* LEFT FORM */}
          <div className="lg:col-span-7 card p-8 space-y-5">
            <div>
              <label className="text-sm text-[color:var(--muted)]">Question</label>
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

            {/* Upload UX */}
            <div>
              <div className="text-sm text-[color:var(--muted)] mb-2">Photos (optional)</div>

              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="rounded-2xl border border-dashed p-6 text-center cursor-pointer hover:bg-pink-50 transition"
                style={{ borderColor: "var(--line)" }}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <div className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Add photos</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  Click to choose · or drag & drop images here
                </div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">Up to 5 images</div>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => uploadFiles(e.target.files!)}
                />
              </div>

              {uploading && <div className="mt-3 text-sm text-[color:var(--muted)]">Uploading…</div>}

              {mediaUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {mediaUrls.map((u) => (
                    <img
                      key={u}
                      src={u}
                      alt=""
                      className="h-28 w-full rounded-xl object-cover border"
                      style={{ borderColor: "var(--line)" }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={submit}
              disabled={loading || uploading || message.trim().length < 5}
              className="btn-pink w-full"
            >
              {uploading ? "Uploading…" : loading ? "Publishing…" : "Publish"}
            </button>

            {result && (
              <div className="text-sm">
                {"ok" in result && result.ok
                  ? <div className="text-[color:var(--muted)]">It’s live. Thank you.</div>
                  : <div className="text-red-600">Error: {(result as any).error}</div>}
              </div>
            )}
          </div>

          {/* RIGHT MAP PANEL */}
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
    </>
  );
}
