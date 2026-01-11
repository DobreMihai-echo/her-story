import dynamic from "next/dynamic";

const CityMapClient = dynamic(() => import("./CityMapClient"), { ssr: false });

export default function CityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="badge">THE CITY</div>
      <h1 className="mt-4 text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
        The world, marked by her.
      </h1>
      <p className="mt-3 text-[color:var(--muted)] text-lg">
        Every pin is a place someone remembers her.
      </p>

      <CityMapClient />
    </main>
  );
}
