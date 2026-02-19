"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWatchlistCount } from "@/app/lib/watchlist";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/genres", label: "Genres" },
  { href: "/trending", label: "Trending" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/explore", label: "Explore" },
];

export default function TopNav() {
  const pathname = usePathname();
  const watchlistCount = useWatchlistCount();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/15 dark:bg-black/85">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              {item.href === "/watchlist"
                ? `${item.label} (${watchlistCount})`
                : item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
