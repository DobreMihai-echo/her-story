import Link from "next/link";

export default function PhotosPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl">Photos</h1>
        <p className="mt-4 text-neutral-300">
          MVP note: photo upload will be added next (Cloudinary recommended for Render).
        </p>

        <div className="mt-10 text-sm text-neutral-400">
          <Link className="underline" href="/">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
