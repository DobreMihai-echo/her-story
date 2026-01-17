import Link from "next/link";
import { cookies } from "next/headers";
import BackButton from "./BackButton";

export default async function TopNav() {
  const cookieStore = await cookies();
  const isVip = cookieStore.get("vip")?.value === "1";

  return (
    <div className="sticky top-0 z-50">
      {/* subtle glass bar */}
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* Left side: Home + VIP */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link className="btn-ghost whitespace-nowrap" href="/">
            Home
          </Link>

          {/* VIP-only shortcut */}
          {isVip && (
            <Link className="btn-pink whitespace-nowrap" href="/birthday">
              Birthday Intro
            </Link>
          )}

          {/* Public can access VIP entry link if they know it (harmless) */}
          {!isVip && (
            <Link className="btn-ghost whitespace-nowrap" href="/vip">
              VIP
            </Link>
          )}
        </div>

        {/* Right side: Back + (public-only) Write a note */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <BackButton fallback="/" />

          {/* Hide submit for VIP */}
          {!isVip && (
            <Link className="btn-pink whitespace-nowrap" href="/submit">
              Write a note
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
