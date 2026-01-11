import { prisma } from "@/lib/prisma";

export default async function ColumnPage() {
  const entries = await prisma.columnEntry.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const featuredQuotes = await prisma.memory.findMany({
    where: { isVisible: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl">The Column</h1>
        <p className="mt-4 text-neutral-300">
          Observations, chapters, and the people who prove them true.
        </p>

        <div className="mt-10 space-y-12">
          {entries.map((e) => (
            <article key={e.id} className="rounded-lg border border-neutral-800 bg-neutral-900/20 p-6">
              <div className="text-xs tracking-widest text-neutral-400">
                {e.createdAt.toISOString().slice(0, 10)}
              </div>
              <h2 className="mt-3 font-serif text-3xl">{e.title}</h2>
              <p className="mt-5 text-neutral-200 whitespace-pre-line leading-relaxed">
                {e.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-neutral-800 bg-neutral-900/20 p-6">
          <div className="text-xs tracking-widest text-neutral-400">PULL QUOTES</div>
          <div className="mt-5 space-y-5">
            {featuredQuotes.map((m) => (
              <div key={m.id} className="border-l border-neutral-700 pl-4">
                <p className="font-serif text-lg">“{m.message}”</p>
                <div className="mt-1 text-sm text-neutral-300">
                  — {m.isAnonymous ? "Anonymous" : m.authorName ?? "Someone"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
