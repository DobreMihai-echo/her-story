"use client";

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  return (
    <button
      className="btn-ghost"
      onClick={() => (history.length > 1 ? history.back() : (window.location.href = fallback))}
    >
      Back
    </button>
  );
}
