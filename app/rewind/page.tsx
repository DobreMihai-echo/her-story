"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Answer = {
  id: string;
  message: string;
  author: string;
  placeName?: string | null;
  photo?: string | null;     // first photo (backward)
  photos?: string[];         // all photos
};

type PromptGroup = {
  promptId: string;
  promptTitle: string;
  helperText?: string | null;
  answers: Answer[];
};

type Payload = {
  byPrompt: PromptGroup[];
};

type Slide =
  | { kind: "TITLE" }
  | { kind: "SECTION"; title: string; subtitle?: string }
  | { kind: "QUOTE"; answer: Answer }
  | { kind: "END" };

export default function RewindPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/rewind", { cache: "no-store" });
      const d = await r.json();
      if (d.ok) setData(d);
    })();
  }, []);

  const slides: Slide[] = useMemo(() => {
    if (!data) return [];
    const out: Slide[] = [];
    out.push({ kind: "TITLE" });

    for (const grp of data.byPrompt) {
      if (!grp.answers?.length) continue;

      out.push({
        kind: "SECTION",
        title: grp.promptTitle,
        subtitle: grp.helperText ?? "What people answered.",
      });

      for (const a of grp.answers.slice(0, 6)) out.push({ kind: "QUOTE", answer: a });
    }

    out.push({ kind: "END" });
    return out;
  }, [data]);

  const slide = slides[idx];

  function prev() {
    setIdx((i) => Math.max(0, i - 1));
  }
  function next() {
    setIdx((i) => Math.min(slides.length - 1, i + 1));
  }
  function restart() {
    setIdx(0);
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* FULL PAGE BACKGROUND (HTML page background) */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,246,251,.90) 0%, rgba(255,246,251,.78) 40%, rgba(255,246,251,.92) 100%), url(/her/head.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="badge">MEMORIES</div>
          <h1 className="mt-3 text-4xl sm:text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Memories.
          </h1>
          <p className="mt-3 text-[color:var(--muted)] text-base sm:text-lg">
            Four questions. A hundred little truths.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn-ghost" onClick={prev} disabled={idx === 0}>Prev</button>
          <button className="btn-pink" onClick={next} disabled={idx >= slides.length - 1}>Next</button>
          <button className="btn-ghost" onClick={restart}>Restart</button>
        </div>
      </div>

      {/* PLAYER */}
      <div
        className="mt-6 sm:mt-8 card p-6 sm:p-10 min-h-[520px] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,.86) 0%, rgba(255,246,251,.93) 55%, rgba(255,255,255,.88) 100%), url(/satc/rewind.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!slide ? (
          <div className="text-[color:var(--muted)]">Loading…</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide.kind}-${idx}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
              className="w-full"
            >
              {slide.kind === "TITLE" && <TitleSlide />}
              {slide.kind === "SECTION" && <SectionSlide title={slide.title} subtitle={slide.subtitle} />}
              {slide.kind === "QUOTE" && <QuoteSlide answer={slide.answer} />}
              {slide.kind === "END" && <EndSlide />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 text-sm text-[color:var(--muted)]">
        <div className="badge">PROGRESS</div>
        <div>{slides.length ? `${idx + 1} / ${slides.length}` : "—"}</div>
      </div>
    </main>
  );
}

function TitleSlide() {
  return (
    <div
      className="text-center max-w-4xl mx-auto rounded-2xl overflow-hidden border p-8 sm:p-12"
      style={{
        borderColor: "var(--line)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,45,141,.18) 0%, rgba(20,10,18,.55) 75%), url(/satc/rewind.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <div className="badge" style={{ background: "rgba(255,45,141,.22)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}>
        ISSUE 01
      </div>
      <div className="mt-6 text-5xl sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
        MEMORIES
      </div>
      <div className="mt-4 text-white/85 text-base sm:text-lg">
        The questions people answered about her.
      </div>
    </div>
  );
}

function SectionSlide({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div
      className="text-center max-w-5xl mx-auto rounded-2xl overflow-hidden border p-8 sm:p-12"
      style={{
        borderColor: "var(--line)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,45,141,.14) 0%, rgba(20,10,18,.58) 80%), url(/satc/column.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <div className="badge" style={{ background: "rgba(255,45,141,.20)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}>
        QUESTION
      </div>
      <div className="mt-6 text-4xl sm:text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </div>
      {subtitle && <div className="mt-4 text-white/85 text-base sm:text-lg">{subtitle}</div>}
    </div>
  );
}

function QuoteSlide({ answer }: { answer: Answer }) {
  // photos list (supports multiple)
  const photos = (answer.photos && answer.photos.length)
    ? answer.photos
    : (answer.photo ? [answer.photo] : []);

  const [imgIdx, setImgIdx] = useState(0);

  // reset when slide changes
  useEffect(() => {
    setImgIdx(0);
  }, [answer.id]);

  // rotate if multiple photos
  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setImgIdx((i) => (i + 1) % photos.length), 2500);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    // IMPORTANT: items-start ensures both columns align at the top
    <div className="grid gap-6 md:grid-cols-12 items-start">
      {/* LEFT */}
      <div
        className="md:col-span-7 rounded-2xl border p-6"
        style={{
          borderColor: "var(--line)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,.90), rgba(255,246,251,.92)), url(/satc/memories.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="badge">ANSWER</div>

        {/* scrollable long text */}
        <div className="mt-5 pr-2" style={{ maxHeight: 380, overflowY: "auto" }}>
          <div className="text-3xl sm:text-4xl leading-relaxed" style={{ fontFamily: "var(--font-heading)" }}>
            “{answer.message}”
          </div>
        </div>

        <div className="mt-5 text-[color:var(--muted)]">— {answer.author}</div>
        {answer.placeName && <div className="mt-3 text-sm text-[color:var(--muted)]">{answer.placeName}</div>}
      </div>

      {/* RIGHT — fixed height + image fills full height (no white gap) */}
      <div
        className="md:col-span-5 rounded-2xl border overflow-hidden h-72 sm:h-80 self-start relative"
        style={{ borderColor: "var(--line)" }}
      >
        {photos.length ? (
          <>
            <img
              src={photos[imgIdx]}
              alt=""
              className="w-full h-full object-cover block"
            />

            {photos.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {photos.map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: i === imgIdx ? "rgba(255,45,141,0.95)" : "rgba(255,255,255,0.65)",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="p-10 text-[color:var(--muted)]">No photo attached.</div>
        )}
      </div>
    </div>
  );
}

function EndSlide() {
  return (
    <div
      className="text-center max-w-4xl mx-auto rounded-2xl overflow-hidden border p-8 sm:p-12"
      style={{
        borderColor: "var(--line)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,45,141,.10) 0%, rgba(20,10,18,.60) 80%), url(/satc/end.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <div className="badge" style={{ background: "rgba(255,45,141,.20)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}>
        THE END
      </div>
      <div className="mt-6 text-4xl sm:text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        And so it continues.
      </div>
      <div className="mt-4 text-white/85 text-base sm:text-lg">
        Because the best stories don’t end—people just keep adding chapters.
      </div>
    </div>
  );
}
