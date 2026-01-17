import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LettersPage() {
  const memories = await prisma.memory.findMany({
    where: { isVisible: true },
    include: { media: true, prompt: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
            <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,246,251,.90) 0%, rgba(255,246,251,.78) 40%, rgba(255,246,251,.92) 100%), url(/her/portrait2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />  
      <header className="mb-8">
        <div className="badge">LETTERS</div>
        <h1 className="mt-3 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
          Letters.
        </h1>
        <p className="mt-3 text-[color:var(--muted)] text-base sm:text-lg max-w-2xl">
          Notes, confessions, and memories—just as they were written.
        </p>
      </header>

      {/* Carousel CSS (one time) */}
      <style>{`
        .carousel {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,.72);
        }

        /* slower speed */
        .track {
          display: flex;
          gap: 14px;
          padding: 14px;
          width: max-content;
          animation: scroll-left 32s linear infinite;
          will-change: transform;
        }

        .carousel:hover .track { animation-play-state: paused; }

        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .imgWrap {
          width: 260px;
          height: 190px;
          flex: 0 0 auto;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: rgba(0,0,0,0.04);
        }

        .imgWrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 640px) {
          .imgWrap { width: 220px; height: 170px; }
          .track { padding: 12px; gap: 12px; }
          .track { animation-duration: 40s; } /* even slower on mobile */
        }
      `}</style>

      <div className="space-y-8">
        {memories.map((m) => {
          const raw = (m.media || []).slice(0, 5);

          // Build a "base" list long enough so animation never shows blank space,
          // even when raw has only 1-2 images.
          const base = [...raw];
          if (base.length > 0) {
            while (base.length < 6) {
              base.push(raw[base.length % raw.length]);
            }
          }

          // Seamless loop: duplicate base
          const loopImgs = base.length ? [...base, ...base] : [];

          return (
            <article key={m.id} className="card p-6 sm:p-8">
              {m.prompt?.title && <div className="badge">{m.prompt.title}</div>}

              <p
                className="mt-4 text-xl sm:text-2xl leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                “{m.message}”
              </p>

              <div className="mt-4 text-sm text-[color:var(--muted)]">
                — {m.isAnonymous ? "Anonymous" : m.authorName ?? "Someone"}
                {m.relationship ? `, ${m.relationship}` : ""}
                {m.placeName ? ` · ${m.placeName}` : ""}
              </div>

              {/* Carousel */}
              {loopImgs.length > 0 && (
                <div className="mt-6 carousel">
                  <div className="track">
                    {loopImgs.map((img, idx) => (
                      <div key={`${img.id}-${idx}`} className="imgWrap">
                        <img src={img.mediaUrl} alt="" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {memories.length === 0 && (
          <div className="card p-7 text-[color:var(--muted)]">No letters yet.</div>
        )}
      </div>
    </main>
  );
}
