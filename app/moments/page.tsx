import { prisma } from "@/lib/prisma";

export default async function MomentsPage() {
  const photos = await prisma.memoryMedia.findMany({
    where: { memory: { isVisible: true } },
    include: { memory: true },
    orderBy: { createdAt: "desc" },
    take: 250,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="badge">MOMENTS</div>
      <h1 className="mt-4 text-5xl" style={{ fontFamily: "var(--font-heading)" }}>The snapshots.</h1>
      <p className="mt-3 text-[color:var(--muted)] text-lg">A glossy wall of proof.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => (
          <div key={p.id} className="card p-3 overflow-hidden">
            <img src={p.mediaUrl} alt="" className="h-56 w-full object-cover rounded-2xl" />
            <div className="mt-3 text-sm text-[color:var(--muted)] line-clamp-2">“{p.memory.message}”</div>
          </div>
        ))}
      </div>
    </main>
  );
}
