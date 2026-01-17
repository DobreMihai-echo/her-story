import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const cookieStore = await cookies();
  const isVip = cookieStore.get("vip")?.value === "1";

  const [featured, latestMoments] = await Promise.all([
    prisma.memory.findMany({
      where: { isVisible: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.memoryMedia.findMany({
      where: { memory: { isVisible: true } },
      include: { memory: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="badge">HER CITY</div>
          <h1
            className="mt-3 text-4xl sm:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            And so it begins.
          </h1>
          <p className="mt-3 text-[color:var(--muted)] text-base sm:text-lg max-w-2xl">
            Notes, photos, and places—written by the people who were there.
          </p>
        </div>

        {/* NAV BUTTONS — aligned */}
        <div className="w-full lg:w-auto">
          <div className="flex flex-wrap lg:flex-nowrap gap-2 lg:gap-3 lg:justify-end">
            {!isVip && (
              <Link className="btn-pink whitespace-nowrap" href="/submit">
                Write a note
              </Link>
            )}
            <Link className="btn-ghost whitespace-nowrap" href="/rewind">
              Memories
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/letters">
              Letters
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/moments">
              Moments
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/city">
              The City
            </Link>
          </div>
        </div>
      </header>

      <div className="mt-6 sm:mt-8 pink-rule" />

      {/* HERO ROW */}
      <section className="mt-8 grid gap-6 lg:grid-cols-12 items-stretch">
        {/* SATC HERO — FIXED: card stretches, hero fills */}
        <div className="lg:col-span-8 card overflow-hidden flex">
          <div
            className="w-full flex-1 p-6 sm:p-10 flex flex-col justify-end"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,10,18,.35) 0%, rgba(20,10,18,.78) 80%), url(/satc/hero2.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 10%",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="max-w-2xl text-white">
              <div
                className="badge"
                style={{
                  background: "rgba(255,45,141,.20)",
                  borderColor: "rgba(255,255,255,.35)",
                  color: "#fff",
                }}
              >
                ISSUE 01
              </div>
              <h2
                className="mt-4 text-3xl sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The people who knew her best.
              </h2>
              <p className="mt-3 text-white/85 text-sm sm:text-base">
                Pull quotes, snapshots, and places that hold her story.
              </p>
            </div>
          </div>
        </div>

        {/* HER COVER CARD */}
        <aside className="lg:col-span-4 card overflow-hidden flex flex-col">
          <div className="p-6 sm:p-8">
            <div className="badge">ABOUT HER</div>
            <h3
              className="mt-4 text-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The main character.
            </h3>
            <p className="mt-2 text-[color:var(--muted)] text-sm sm:text-base">
              This is her story—told by the people who love her.
            </p>
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8 mt-auto">
            <div
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: "var(--line)" }}
            >
              <img
                src="/her/portrait1.png"
                alt="Her portrait"
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          </div>
        </aside>
      </section>

      {/* PULL QUOTES */}
      <section className="mt-8 card p-6 sm:p-8">
        <div className="badge">PULL QUOTES</div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {featured.length ? (
            featured.map((m) => (
              <div
                key={m.id}
                className="border-l-4 pl-4"
                style={{ borderColor: "var(--pink)" }}
              >
                <div
                  className="text-lg sm:text-xl leading-relaxed"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  “{m.message}”
                </div>
                <div className="mt-2 text-sm text-[color:var(--muted)]">
                  — {m.isAnonymous ? "Anonymous" : m.authorName ?? "Someone"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[color:var(--muted)]">No featured quotes yet.</p>
          )}
        </div>
      </section>

      {/* LATEST MOMENTS */}
      <section className="mt-8 card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="badge">LATEST MOMENTS</div>
          <Link style={{ color: "var(--pink)" }} href="/moments">
            See all →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {latestMoments.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--line)" }}
            >
              <img
                src={p.mediaUrl}
                className="h-32 sm:h-36 w-full object-cover"
                alt=""
              />
              <div className="p-3 text-xs text-[color:var(--muted)] line-clamp-2">
                “{p.memory.message}”
              </div>
            </div>
          ))}
          {latestMoments.length === 0 && (
            <div className="text-[color:var(--muted)]">No photos yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
