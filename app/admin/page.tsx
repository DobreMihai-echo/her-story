"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function login() {
    setErr(null);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const d = await r.json();
    if (!d.ok) return setErr(d.error || "Login failed");
    window.location.href = "/admin/studio";
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="badge">ADMIN</div>
      <h1 className="mt-4 text-4xl" style={{ fontFamily: "var(--font-heading)" }}>Editor login</h1>

      <div className="mt-6 card p-7 space-y-4">
        <input
          type="password"
          className="w-full rounded-xl border px-3 py-2 bg-white"
          style={{ borderColor: "var(--line)" }}
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
        />
        <button className="btn-pink w-full" onClick={login}>Sign in</button>
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </div>
    </main>
  );
}
