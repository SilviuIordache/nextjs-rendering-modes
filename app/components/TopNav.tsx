"use client";

import { Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useWatchlistCount } from "@/app/lib/watchlist";

const navItems = [
  { href: "/genres", label: "Genres" },
  { href: "/trending", label: "Trending" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/explore", label: "Explore" },
];

export default function TopNav() {
  const pathname = usePathname();
  const watchlistCount = useWatchlistCount();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getLabel = (href: string, label: string) =>
    href === "/watchlist" ? `${label} (${watchlistCount})` : label;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/15 dark:bg-black/85">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-[0.04em] text-zinc-400 transition hover:text-zinc-200"
        >
          <Home className="h-3.5 w-3.5" aria-hidden />
          Render Modes
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
          className="rounded-md border border-white/15 p-2 text-zinc-200 transition hover:bg-zinc-800 sm:hidden"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {getLabel(item.href, item.label)}
              </Link>
            );
          })}
        </div>
      </nav>

      {isMobileOpen ? (
        <div className="border-t border-white/10 bg-black/95 px-4 py-3 sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  {getLabel(item.href, item.label)}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
