import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MomentsPage() {
  const photos = await prisma.memoryMedia.findMany({
    where: { memory: { isVisible: true } },
    include: { memory: true },
    orderBy: { createdAt: "desc" },
    take: 250,
  });

  return (
    <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* FULL PAGE BACKGROUND */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,246,251,.90) 0%, rgba(255,246,251,.78) 40%, rgba(255,246,251,.92) 100%), url(/her/portrait1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="badge">MOMENTS</div>
      <h1 className="mt-3 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
        Moments.
      </h1>
      <p className="mt-3 text-[color:var(--muted)] text-base sm:text-lg">
        A gallery of her life.
      </p>

      <section className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => (
          <div key={p.id} className="card p-3 overflow-hidden">
            <img src={p.mediaUrl} alt="" className="h-44 sm:h-56 w-full object-cover rounded-2xl" />
            <div className="mt-3 text-sm text-[color:var(--muted)] line-clamp-2">
              “{p.memory.message}”
            </div>
          </div>
        ))}

        {photos.length === 0 && (
          <div className="card p-7 text-[color:var(--muted)] col-span-2 sm:col-span-3 lg:col-span-4">
            No photos yet.
          </div>
        )}
      </section>
    </main>
  );
}
