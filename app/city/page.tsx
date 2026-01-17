"use client";

import dynamic from "next/dynamic";

const CityMapClient = dynamic(() => import("./CityMapClient"), { ssr: false });

export default function CityPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* FULL PAGE BACKGROUND */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,246,251,.90) 0%, rgba(255,246,251,.78) 40%, rgba(255,246,251,.92) 100%), url(/her/cocktails.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="badge">THE CITY</div>
      <h1 className="mt-3 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
        The world, marked by her.
      </h1>
      <p className="mt-3 text-[color:var(--muted)] text-base sm:text-lg">
        Every pin is a place someone remembers her.
      </p>

      <CityMapClient />
    </main>
  );
}
