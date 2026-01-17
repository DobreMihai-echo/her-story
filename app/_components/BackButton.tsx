"use client";

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  return (
    <button
      className="btn-ghost whitespace-nowrap"
      onClick={() => {
        if (history.length > 1) history.back();
        else window.location.href = fallback;
      }}
    >
      Back
    </button>
  );
}
