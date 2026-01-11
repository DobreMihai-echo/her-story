"use client";

import { useState } from "react";
import Link from "next/link";

type ApiResp =
  | { ok: true; id: string }
  | { ok: false; error: string };

export default function AddMemoryPage() {
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResp | null>(null);

  async function submit() {
    setLoading(true);
    setResult(null);

    const resp = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: authorName.trim() || null,
        isAnonymous,
        relationship: relationship.trim() || null,
        message: message.trim(),
        placeName: placeName.trim() || null,
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
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-4xl">Write a memory</h1>
        <p className="mt-4 text-neutral-300">
          Every great story is told by more than one voice.
        </p>

        <div className="mt-10 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-neutral-300">Your name</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? "Anonymous" : "e.g., Alex"}
              />
            </div>
            <div>
              <label className="text-sm text-neutral-300">Relationship (optional)</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g., Friend, colleague"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Post as anonymous
          </label>

          <div>
            <label className="text-sm text-neutral-300">Message</label>
            <textarea
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Write something heartfelt..."
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Place (optional)</label>
            <input
              className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="e.g., Vienna, Cismigiu Park"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading || message.trim().length < 5}
            className="rounded-md bg-neutral-50 px-5 py-3 text-neutral-950 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit memory"}
          </button>

          {result && (
            <div
              className={`rounded-md border p-4 ${
                result.ok
                  ? "border-green-700 bg-green-950/30 text-green-200"
                  : "border-red-700 bg-red-950/30 text-red-200"
              }`}
            >
              {result.ok ? (
                <div>
                  Thank you for being part of her story.{" "}
                  <Link className="underline" href="/letters">
                    View letters
                  </Link>
                  .
                </div>
              ) : (
                <div>Error: {result.error}</div>
              )}
            </div>
          )}

          <div className="text-sm text-neutral-400">
            <Link className="underline" href="/">
              Back home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
