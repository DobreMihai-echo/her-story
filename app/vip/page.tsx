"use client";

import { useState } from "react";

export default function VipPage() {
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function enter() {
    setErr(null);
    setLoading(true);

    const r = await fetch("/api/vip-enter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    const d = await r.json().catch(() => ({}));
    setLoading(false);

    if (!d.ok) {
      setErr(d.error || "Wrong password.");
      return;
    }

    window.location.href = "/birthday";
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* FULL PAGE BACKGROUND */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,246,251,.92) 0%, rgba(255,246,251,.80) 45%, rgba(255,246,251,.95) 100%), url(/her/portrait1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="card p-8 max-w-md mx-auto mt-10 text-center">
        <div className="badge">VIP</div>
        <h1 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
          Enter password
        </h1>

        <input
          type="password"
          className="mt-6 w-full rounded-xl border px-3 py-3 bg-white"
          style={{ borderColor: "var(--line)" }}
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Password"
        />

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

        <button className="btn-pink w-full mt-5" onClick={enter} disabled={loading || !passcode}>
          {loading ? "Checking…" : "Enter"}
        </button>

        <div className="mt-4 text-xs text-[color:var(--muted)]">
          Only the birthday intro is protected. The public site remains public.
        </div>
      </div>
    </main>
  );
}
