import Link from "next/link";

export default function Shell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="badge">VOL. 1 · NO. 1 · HER CITY</div>
            {title && <h1 className="mt-4 font-heading text-5xl leading-tight">{title}</h1>}
            {subtitle && <p className="mt-4 max-w-2xl text-[color:var(--muted)] text-lg">{subtitle}</p>}
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-[color:var(--text)]">
            <Link className="hover:underline" href="/column">The Column</Link>
            <Link className="hover:underline" href="/letters">Letters</Link>
            <Link className="hover:underline" href="/moments">Moments</Link>
            <Link className="hover:underline" href="/city">The City</Link>
            <Link className="hover:underline" href="/rewind">Rewind</Link>
            <Link
              className="rounded-full border border-[color:var(--line)] px-4 py-2 hover:border-[color:var(--accent)]"
              href="/submit"
            >
              Write a note
            </Link>
          </nav>
        </div>

        <div className="mt-10 rule" />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  );
}
