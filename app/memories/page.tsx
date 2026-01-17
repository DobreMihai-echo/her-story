"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Answer = {
  id: string;
  message: string;
  author: string;
  placeName?: string | null;
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

export default function MemoriesPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [idx, setIdx] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadError(null);
        const r = await fetch("/api/rewind", { cache: "no-store" });
        const d = await r.json();
        if (!d.ok) {
          setLoadError(d.error || "Could not load memories.");
          return;
        }
        setData(d);
        setIdx(0);
      } catch (e: any) {
        setLoadError(e?.message ?? "Could not load memories.");
      }
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

      for (const a of grp.answers.slice(0, 6)) {
        out.push({ kind: "QUOTE", answer: a });
      }
    }

    out.push({ kind: "END" });
    return out;
  }, [data]);

  const slide = slides[idx];

  const atStart = idx <= 0;
  const atEnd = slides.length ? idx >= slides.length - 1 : true;

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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="badge">MEMORIES</div>
          <h1 className="mt-4 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Memories.
          </h1>
          <p className="mt-3 text-[color:var(--muted)] text-lg">
            Click Next to move through the chapters.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn-ghost" onClick={() => (history.length > 1 ? history.back() : (window.location.href = "/"))}>
            Back
          </button>
          <button className="btn-ghost" onClick={restart} disabled={!slides.length}>
            Restart
          </button>
        </div>
      </div>

      <div
        className="mt-8 card p-6 sm:p-10 min-h-[520px] flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,.86) 0%, rgba(255,246,251,.93) 55%, rgba(255,255,255,.88) 100%), url(/satc/rewind.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex-1 flex items-center justify-center">
          {loadError ? (
            <div className="card p-6 max-w-xl w-full">
              <div className="badge">ERROR</div>
              <div className="mt-3 text-red-600">{loadError}</div>
              <div className="mt-3 text-[color:var(--muted)] text-sm">
                Check that <code>/api/rewind</code> returns ok:true and that your database has memories with <code>isVisible=true</code>.
              </div>
            </div>
          ) : !data ? (
            <div className="text-[color:var(--muted)]">Loading…</div>
          ) : slides.length === 0 ? (
            <div className="card p-8 max-w-xl w-full text-center">
              <div className="badge">EMPTY</div>
              <div className="mt-4 text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                No memories yet.
              </div>
              <div className="mt-3 text-[color:var(--muted)]">
                Add a memory from “Write a note”, then come back here.
              </div>
              <div className="mt-6">
                <button className="btn-pink" onClick={() => (window.location.href = "/submit")}>
                  Write a note
                </button>
              </div>
            </div>
          ) : !slide ? (
            <div className="text-[color:var(--muted)]">Loading slide…</div>
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

        {/* Fixed controls */}
        <div className="mt-6 rounded-2xl border bg-white/80 backdrop-blur px-4 py-3" style={{ borderColor: "var(--line)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
              <div className="badge">PROGRESS</div>
              <div>{slides.length ? `${idx + 1} / ${slides.length}` : "—"}</div>
            </div>

            <div className="flex items-center gap-3">
              <button className="btn-ghost" onClick={prev} disabled={atStart || !slides.length}>
                Prev
              </button>
              <button className="btn-pink" onClick={next} disabled={atEnd || !slides.length}>
                Next
              </button>
            </div>
          </div>

          <div className="mt-2 text-xs text-[color:var(--muted)]">
            Long text? Scroll inside the quote panel—controls stay here.
          </div>
        </div>
      </div>
    </main>
  );
}

function TitleSlide() {
  return (
    <div
      className="text-center max-w-4xl mx-auto rounded-2xl overflow-hidden border p-10 sm:p-12"
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
      <div className="mt-6 text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
        MEMORIES
      </div>
      <div className="mt-4 text-white/85 text-lg">
        Click Next to read through the prompts and answers.
      </div>
    </div>
  );
}

function SectionSlide({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div
      className="text-center max-w-5xl mx-auto rounded-2xl overflow-hidden border p-10 sm:p-12"
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
      {subtitle && <div className="mt-4 text-white/85 text-lg">{subtitle}</div>}
    </div>
  );
}

function QuoteSlide({ answer }: { answer: any }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 items-stretch">
      <div
        className="rounded-2xl border p-6 flex flex-col"
        style={{
          borderColor: "var(--line)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,.90), rgba(255,246,251,.92)), url(/satc/memories.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="badge">ANSWER</div>

        <div className="mt-5 pr-2" style={{ maxHeight: 220, overflowY: "auto" }}>
          <div className="text-3xl sm:text-4xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            “{answer.message}”
          </div>
        </div>

        <div className="mt-5 text-[color:var(--muted)]">— {answer.author}</div>
        {answer.placeName && <div className="mt-3 text-sm text-[color:var(--muted)]">{answer.placeName}</div>}
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
      className="text-center max-w-4xl mx-auto rounded-2xl overflow-hidden border p-10 sm:p-12"
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
      <div className="mt-6 text-5xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        And so it continues.
      </div>
      <div className="mt-4 text-white/85 text-lg">
        Because the best stories don’t end—people just keep adding chapters.
      </div>
    </div>
  );
}
