import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BirthdayPage() {
  const cookieStore = await cookies();
  const vip = cookieStore.get("vip")?.value === "1";
  if (!vip) redirect("/vip");

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,246,251,.96)), url(/her/portrait2.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-5xl sm:text-6xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Happy Birthday, <span style={{ color: "var(--pink)" }}>MALI</span>!!
        </h1>

        <p className="mt-5 text-lg text-[color:var(--muted)] max-w-2xl mx-auto">
          A collection of memories, places, letters, and moments — all written for you.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NavCard href="/rewind" title="Memories" subtitle="Questions & answers" bg="/her/head.png" />
          <NavCard href="/letters" title="Letters" subtitle="Words meant for you" bg="/her/portrait2.png" />
          <NavCard href="/city" title="The City" subtitle="Pins on the map" bg="/her/cocktails.png" />
          <NavCard href="/moments" title="Moments" subtitle="Photos & snapshots" bg="/her/portrait1.png" />
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <Link className="btn-pink px-8 py-3" href="/">
            Go to Public Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function NavCard({
  href,
  title,
  subtitle,
  bg,
}: {
  href: string;
  title: string;
  subtitle: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl overflow-hidden border transition-transform hover:scale-[1.02]"
      style={{ borderColor: "var(--line)" }}
    >
      <div
        className="h-56 flex flex-col justify-end p-5 text-left"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,10,18,.15), rgba(20,10,18,.65)), url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-2xl text-white" style={{ fontFamily: "var(--font-heading)" }}>
          {title}
        </div>
        <div className="text-sm text-white/80 mt-1">{subtitle}</div>
      </div>
    </Link>
  );
}
