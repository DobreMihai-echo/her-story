"use client";

import { useState } from "react";

export default function EditMemoryClient({ memory, prompts }: any) {
  const [authorName, setAuthorName] = useState(memory.authorName ?? "");
  const [isAnonymous, setIsAnonymous] = useState(Boolean(memory.isAnonymous));
  const [relationship, setRelationship] = useState(memory.relationship ?? "");
  const [message, setMessage] = useState(memory.message ?? "");
  const [promptId, setPromptId] = useState(memory.promptId ?? "");
  const [placeName, setPlaceName] = useState(memory.placeName ?? "");
  const [placeLat, setPlaceLat] = useState<number | "">(memory.placeLat ?? "");
  const [placeLng, setPlaceLng] = useState<number | "">(memory.placeLng ?? "");
  const [isVisible, setIsVisible] = useState(Boolean(memory.isVisible));
  const [isFeatured, setIsFeatured] = useState(Boolean(memory.isFeatured));
  const [info, setInfo] = useState<string | null>(null);

  async function save() {
    setInfo(null);
    const r = await fetch(`/api/memories/${memory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: isAnonymous ? null : authorName,
        isAnonymous,
        relationship,
        message,
        promptId: promptId || null,
        placeName: placeName || null,
        placeLat: placeLat === "" ? null : Number(placeLat),
        placeLng: placeLng === "" ? null : Number(placeLng),
        isVisible,
        isFeatured,
      }),
    });
    const d = await r.json();
    setInfo(d.ok ? "Saved." : `Error: ${d.error}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="badge">EDIT MEMORY</div>
      <h1 className="mt-4 text-4xl" style={{ fontFamily: "var(--font-heading)" }}>Polish it.</h1>

      <div className="mt-6 card p-7 space-y-4">
        <div>
          <label className="text-sm text-[color:var(--muted)]">Prompt</label>
          <select className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
            value={promptId} onChange={(e) => setPromptId(e.target.value)}
          >
            <option value="">(none)</option>
            {prompts.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[color:var(--muted)]">Author</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
              value={authorName} onChange={(e) => setAuthorName(e.target.value)} disabled={isAnonymous}
            />
          </div>
          <div>
            <label className="text-sm text-[color:var(--muted)]">Relationship</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
              value={relationship} onChange={(e) => setRelationship(e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          Anonymous
        </label>

        <div>
          <label className="text-sm text-[color:var(--muted)]">Message</label>
          <textarea className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
            rows={7} value={message} onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <label className="text-sm text-[color:var(--muted)]">Place name</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
              value={placeName} onChange={(e) => setPlaceName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-[color:var(--muted)]">Lat</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
              value={placeLat} onChange={(e) => setPlaceLat(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm text-[color:var(--muted)]">Lng</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" style={{ borderColor: "var(--line)" }}
              value={placeLng} onChange={(e) => setPlaceLng(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
          Visible
        </label>

        <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured
        </label>

        <button className="btn-pink" onClick={save}>Save</button>
        {info && <div className="text-sm text-[color:var(--muted)]">{info}</div>}
      </div>
    </main>
  );
}
