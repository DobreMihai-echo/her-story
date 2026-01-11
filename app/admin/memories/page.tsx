import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminMemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-serif text-4xl">Admin · Memories</h1>
          <div className="flex gap-3 text-sm">
            <Link className="underline text-neutral-300" href="/">
              Home
            </Link>
            <Link className="underline text-neutral-300" href="/letters">
              Letters
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 text-neutral-200">
              <tr>
                <th className="p-3 text-left">When</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Place</th>
                <th className="p-3 text-left">Featured</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memories.map((m) => (
                <tr key={m.id} className="border-t border-neutral-800">
                  <td className="p-3 text-neutral-300">
                    {m.createdAt.toISOString().slice(0, 10)}
                  </td>
                  <td className="p-3 text-neutral-200">
                    {m.isAnonymous ? "Anonymous" : m.authorName ?? "—"}
                    {m.relationship ? (
                      <div className="text-xs text-neutral-400">{m.relationship}</div>
                    ) : null}
                  </td>
                  <td className="p-3 text-neutral-200">
                    <div className="line-clamp-2 max-w-[520px]">
                      {m.message}
                    </div>
                  </td>
                  <td className="p-3 text-neutral-300">{m.placeName ?? "—"}</td>
                  <td className="p-3 text-neutral-300">{m.isFeatured ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <Link
                      className="underline text-neutral-200"
                      href={`/admin/memories/${m.id}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {memories.length === 0 && (
                <tr>
                  <td className="p-3 text-neutral-400" colSpan={7}>
                    No memories.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
