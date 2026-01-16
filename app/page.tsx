import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [latestColumn, featured, latestPhotos] = await Promise.all([
    prisma.columnEntry.findFirst({ where: { isPublished: true }, orderBy: { createdAt: "desc" } }),
    prisma.memory.findMany({ where: { isVisible: true, isFeatured: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.memory.findMany({
      where: { isVisible: true, media: { some: {} } },
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="badge">HER CITY · THE COLUMN</div>
          <h1 className="mt-4 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            And so it begins.
          </h1>
          <p className="mt-3 text-[color:var(--muted)] text-lg">
            A glossy little world of notes, photos, and places—written by the people who were there.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link className="btn-pink" href="/submit">Write a memory</Link>
          <Link className="btn-ghost" href="/city">The City</Link>
          <Link className="btn-ghost" href="/rewind">Rewind</Link>
          <Link className="btn-ghost" href="/letters">Letters</Link>
        </div>
      </header>

      <div className="mt-8 pink-rule" />

      <section className="mt-10 card overflow-hidden">
        <div
          className="min-h-[360px] p-10 flex flex-col justify-end"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,.10) 0%, rgba(20,10,18,.55) 70%), url(/satc/hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-2xl text-white">
            <div className="badge" style={{ background: "rgba(255,45,141,.20)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}>
              ISSUE 01
            </div>
            <h2 className="mt-4 text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              The people who knew her best.
            </h2>
            <p className="mt-3 text-white/80">
              Pull quotes, snapshots, and places that hold her story.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 card p-8">
          <div className="badge">THE LATEST COLUMN</div>
          {latestColumn ? (
            <>
              <h3 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                {latestColumn.title}
              </h3>
              <p className="mt-4 whitespace-pre-line text-[color:var(--muted)] leading-relaxed">
                {latestColumn.body}
              </p>
              <Link className="mt-5 inline-block" style={{ color: "var(--pink)" }} href="/column">
                Continue reading →
              </Link>
            </>
          ) : (
            <p className="mt-4 text-[color:var(--muted)]">No column yet.</p>
          )}
        </div>

        <aside className="lg:col-span-5 card p-8">
          <div className="badge">PULL QUOTES</div>
          <div className="mt-5 space-y-5">
            {featured.length ? featured.map((m) => (
              <div key={m.id} className="border-l-4 pl-4" style={{ borderColor: "var(--pink)" }}>
                <div className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>“{m.message}”</div>
                <div className="mt-2 text-sm text-[color:var(--muted)]">
                  — {m.isAnonymous ? "Anonymous" : m.authorName ?? "Someone"}
                </div>
              </div>
            )) : (
              <p className="text-[color:var(--muted)]">Feature some memories in Admin.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="mt-10 card p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="badge">LATEST MOMENTS</div>
          <Link style={{ color: "var(--pink)" }} href="/moments">See all →</Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {latestPhotos.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--line)" }}>
              <img src={m.media[0]?.mediaUrl} className="h-36 w-full object-cover" alt="" />
              <div className="p-3 text-xs text-[color:var(--muted)] line-clamp-2">“{m.message}”</div>
            </div>
          ))}
          {latestPhotos.length === 0 && (
            <div className="text-[color:var(--muted)]">No photos yet. Add one from “Write a note”.</div>
          )}
        </div>
      </section>

      <footer className="mt-10 text-sm text-[color:var(--muted)]">
        <Link href="/admin" style={{ color: "var(--pink)" }}>Admin</Link>
      </footer>
    </main>
  );
}
