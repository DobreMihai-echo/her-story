"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const SubmitMapClient = dynamic(() => import("./SubmitMapClient"), { ssr: false });

export default function SubmitPage() {
  const router = useRouter();

  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");

  const [placeName, setPlaceName] = useState("");
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);

  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickPin(lat: number, lng: number) {
    setPlaceLat(lat);
    setPlaceLng(lng);
  }

  async function submit() {
    setError(null);

    if (message.trim().length < 5) {
      setError("Please write a real message.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: isAnonymous ? null : authorName || null,
        isAnonymous,
        relationship: relationship || null,
        message,
        placeName: placeName || null,
        placeLat,
        placeLng,
        mediaUrls: photoUrl ? [photoUrl] : [],
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/thank-you");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="badge">ADD A MEMORY</div>

      <h1
        className="mt-4 text-5xl leading-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        And so it begins.
      </h1>

      <p className="mt-3 text-[color:var(--muted)] text-lg">
        Write something she should remember.
      </p>

      <div className="mt-8 space-y-6 card p-8">
        {/* NAME */}
        <div>
          <label className="block text-sm mb-1">Your name</label>
          <input
            className="input"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={isAnonymous}
            placeholder="Carrie Bradshaw"
          />
        </div>

        {/* ANONYMOUS */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Post anonymously
        </label>

        {/* RELATIONSHIP */}
        <div>
          <label className="block text-sm mb-1">How do you know her?</label>
          <input
            className="input"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Friend, lover, sister, soulmate…"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-sm mb-1">Your message *</label>
          <textarea
            className="input min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="She changed the room when she entered it…"
          />
        </div>

        {/* PHOTO URL */}
        <div>
          <label className="block text-sm mb-1">Photo URL (optional)</label>
          <input
            className="input"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Any public image URL works.
          </p>
        </div>

        {/* PLACE NAME */}
        <div>
          <label className="block text-sm mb-1">Place name (optional)</label>
          <input
            className="input"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="New York City"
          />
        </div>

        {/* MAP */}
        <SubmitMapClient
          selected={
            placeLat !== null && placeLng !== null
              ? { lat: placeLat, lng: placeLng }
              : null
          }
          onPick={pickPin}
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          className="btn-pink mt-4"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting…" : "Submit memory"}
        </button>
      </div>
    </main>
  );
}
