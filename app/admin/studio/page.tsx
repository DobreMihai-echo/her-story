import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export default async function Studio() {
  if (!(await isAdmin())) redirect("/admin");

  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
    take: 120,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="badge">ADMIN STUDIO</div>
          <h1 className="mt-4 text-5xl" style={{ fontFamily: "var(--font-heading)" }}>Edit memories</h1>
        </div>
        <Link className="btn-ghost" href="/">Home</Link>
      </div>

      <div className="mt-8 card p-7">
        <div className="badge">MEMORIES</div>

        <div className="mt-6 grid gap-3">
          {memories.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 rounded-2xl border bg-white/70 p-4" style={{ borderColor: "var(--line)" }}>
              <div className="min-w-0">
                <div className="text-sm text-[color:var(--muted)]">
                  {m.isVisible ? "Visible" : "Hidden"} · {m.isFeatured ? "Featured" : "—"}
                </div>
                <div className="text-lg line-clamp-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {m.message}
                </div>
              </div>
              <Link className="btn-ghost" href={`/admin/memories/${m.id}`}>Edit</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
