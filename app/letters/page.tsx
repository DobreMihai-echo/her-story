import { prisma } from "@/lib/prisma";

export default async function LettersPage() {
  const memories = await prisma.memory.findMany({
    where: { isVisible: true },
    include: { media: true, prompt: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="badge">LETTERS</div>
      <h1 className="mt-4 text-5xl" style={{ fontFamily: "var(--font-heading)" }}>The notes.</h1>
      <p className="mt-3 text-[color:var(--muted)] text-lg">Heartfelt messages, like pull-quotes from a life.</p>

      <div className="mt-8 space-y-6">
        {memories.map((m) => (
          <article key={m.id} className="card p-7">
            {m.prompt?.title && <div className="badge">{m.prompt.title}</div>}
            <p className="mt-4 text-2xl leading-relaxed" style={{ fontFamily: "var(--font-heading)" }}>“{m.message}”</p>

            {m.media.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-3">
                {m.media.slice(0, 3).map((x) => (
                  <img key={x.id} src={x.mediaUrl} alt="" className="h-24 w-full rounded-2xl object-cover border" style={{ borderColor: "var(--line)" }} />
                ))}
              </div>
            )}

            <div className="mt-4 text-sm text-[color:var(--muted)]">
              — {m.isAnonymous ? "Anonymous" : m.authorName ?? "Someone"}
              {m.relationship ? `, ${m.relationship}` : ""}
              {m.placeName ? ` · ${m.placeName}` : ""}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
