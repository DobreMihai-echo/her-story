import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PlacesPage() {
  const withPlaces = await prisma.memory.findMany({
    where: {
      status: "approved",
      placeName: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl">Places</h1>
        <p className="mt-4 text-neutral-300">
          Some places never forget the people who mattered there.
        </p>

        <div className="mt-10 space-y-6">
          {withPlaces.map((m) => (
            <article
              key={m.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6"
            >
              <div className="text-sm text-neutral-300">{m.placeName}</div>
              <p className="mt-3 font-serif text-lg leading-relaxed">“{m.message}”</p>
              <div className="mt-3 text-sm text-neutral-400">
                — {m.isAnonymous ? "Anonymous" : m.authorName ?? "Someone"}
              </div>
            </article>
          ))}
          {withPlaces.length === 0 && (
            <div className="text-neutral-400">No places added yet.</div>
          )}
        </div>

        <div className="mt-10 text-sm text-neutral-400">
          <Link className="underline" href="/">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
