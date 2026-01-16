"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Answer = {
  id: string;
  message: string;
  author: string;
  placeName?: string | null;
  lat?: number | null;
  lng?: number | null;
  photo?: string | null;
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
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/rewind");
      const d = await r.json();
      if (d.ok) setData(d);
    })();
  }, []);

  const slides: Slide[] = useMemo(() => {
    if (!data) return [];

    const out: Slide[] = [];
    out.push({ kind: "TITLE" });

    // For each prompt: section -> answers
    for (const grp of data.byPrompt) {
      if (!grp.answers?.length) continue;

      out.push({
        kind: "SECTION",
        title: grp.promptTitle,
        subtitle: grp.helperText ?? "What people answered.",
      });

      // show up to 6 answers per prompt (tune as you like)
      for (const a of grp.answers.slice(0, 6)) {
        out.push({ kind: "QUOTE", answer: a });
      }
    }

    out.push({ kind: "END" });
    return out;
  }, [data]);

  useEffect(() => {
    if (!playing) return;
    if (!slides.length) return;

    const t = setTimeout(() => {
      setIdx((i) => {
        const next = i + 1;
        return next >= slides.length ? slides.length - 1 : next;
      });
    }, 4200);

    return () => clearTimeout(t);
  }, [playing, slides.length, idx]);

  const slide = slides[idx];

  function prev() {
    setIdx((i) => Math.max(0, i - 1));
  }
  function next() {
    setIdx((i) => Math.min(slides.length - 1, i + 1));
  }
  function restart() {
    setIdx(0);
    setPlaying(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="badge">REWIND</div>
          <h1 className="mt-4 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            The rewind.
          </h1>
          <p className="mt-3 text-[color:var(--muted)] text-lg">
            Four questions. A hundred little truths.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn-ghost" onClick={prev} disabled={idx === 0}>Prev</button>
          <button className="btn-ghost" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
          <button className="btn-pink" onClick={next} disabled={idx >= slides.length - 1}>Next</button>
          <button className="btn-ghost" onClick={restart}>Restart</button>
        </div>
      </div>

      {/* Main player background */}
      <div
        className="mt-8 card p-10 min-h-[460px] flex items-center justify-center"
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

              {slide.kind === "SECTION" && (
                <SectionSlide title={slide.title} subtitle={slide.subtitle} />
              )}

              {slide.kind === "QUOTE" && <QuoteSlide answer={slide.answer} />}

              {slide.kind === "END" && <EndSlide />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 text-sm text-[color:var(--muted)]">
        <div className="badge">PROGRESS</div>
        <div>{slides.length ? `${idx + 1} / ${slides.length}` : "—"}</div>
      </div>
    </main>
  );
}

function TitleSlide() {
  return (
    <div
      className="text-center max-w-4xl mx-auto rounded-2xl overflow-hidden border p-12"
      style={{
        borderColor: "var(--line)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,45,141,.18) 0%, rgba(20,10,18,.55) 75%), url(/satc/rewind.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <div
        className="badge"
        style={{ background: "rgba(255,45,141,.22)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}
      >
        ISSUE 01
      </div>
      <div className="mt-6 text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
        REWIND
      </div>
      <div className="mt-4 text-white/85 text-lg">
        The questions people answered about her.
      </div>
    </div>
  );
}

function SectionSlide({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div
      className="text-center max-w-5xl mx-auto rounded-2xl overflow-hidden border p-12"
      style={{
        borderColor: "var(--line)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,45,141,.14) 0%, rgba(20,10,18,.58) 80%), url(/satc/column.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <div
        className="badge"
        style={{ background: "rgba(255,45,141,.20)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}
      >
        QUESTION
      </div>
      <div className="mt-6 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </div>
      {subtitle && <div className="mt-4 text-white/85 text-lg">{subtitle}</div>}
    </div>
  );
}

function QuoteSlide({ answer }: { answer: Answer }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 items-center">
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: "var(--line)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,.90), rgba(255,246,251,.92)), url(/satc/memories.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="badge">ANSWER</div>
        <div className="mt-5 text-4xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
          “{answer.message}”
        </div>
        <div className="mt-5 text-[color:var(--muted)]">— {answer.author}</div>

        {answer.placeName && (
          <div className="mt-4 text-sm text-[color:var(--muted)]">{answer.placeName}</div>
        )}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
        {answer.photo ? (
          <img src={answer.photo} alt="" className="w-full h-72 object-cover" />
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
      className="text-center max-w-4xl mx-auto rounded-2xl overflow-hidden border p-12"
      style={{
        borderColor: "var(--line)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,45,141,.10) 0%, rgba(20,10,18,.60) 80%), url(/satc/end.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <div
        className="badge"
        style={{ background: "rgba(255,45,141,.20)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}
      >
        THE END
      </div>
      <div className="mt-6 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        And so it continues.
      </div>
      <div className="mt-4 text-white/85 text-lg">
        Because the best stories don’t end—people just keep adding chapters.
      </div>
    </div>
  );
}
