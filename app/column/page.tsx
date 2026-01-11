import { prisma } from "@/lib/prisma";

export default async function ColumnPage() {
  const entries = await prisma.columnEntry.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">

      {/* ===== SATC HERO HEADER ===== */}
      <section className="card overflow-hidden mb-10">
        <div
          className="p-10 text-white"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,45,141,.18) 0%, rgba(20,10,18,.65) 75%), url(/satc/column.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 260,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            className="badge"
            style={{
              background: "rgba(255,45,141,.25)",
              borderColor: "rgba(255,255,255,.35)",
              color: "#fff",
            }}
          >
            THE COLUMN
          </div>

          <h1
            className="mt-4 text-5xl leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The column.
          </h1>

          <p className="mt-3 text-white/80 text-lg max-w-xl">
            Short essays that frame the story.
          </p>
        </div>
      </section>
      {/* ===== END HERO ===== */}

      {/* ===== COLUMN ENTRIES ===== */}
      <div className="space-y-8 max-w-3xl mx-auto">
        {entries.map((e) => (
          <article key={e.id} className="card p-7">
            <div className="text-xs text-[color:var(--muted)]">
              {e.createdAt.toISOString().slice(0, 10)}
            </div>

            <h2
              className="mt-3 text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {e.title}
            </h2>

            <p className="mt-4 whitespace-pre-line text-[color:var(--muted)] leading-relaxed">
              {e.body}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
