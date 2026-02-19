"use client";

import { useEffect, useMemo, useState } from "react";

function formatGeneratedAt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(iso));
}

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs <= 0) return "just now";

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) return `${days}d ${hours}h ago`;
  return `${hours}h ago`;
}

export default function SsgInfoCard({ generatedAtIso }: { generatedAtIso: string }) {
  const absolute = useMemo(() => formatGeneratedAt(generatedAtIso), [generatedAtIso]);
  const [relative, setRelative] = useState("just now");

  useEffect(() => {
    const update = () => setRelative(formatRelative(generatedAtIso));
    update();
    const intervalId = window.setInterval(update, 60_000);
    return () => window.clearInterval(intervalId);
  }, [generatedAtIso]);

  return (
    <aside className="rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm dark:border-white/15 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        SSG
      </p>
      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
        Generated at: {absolute} UTC ({relative})
      </p>
    </aside>
  );
}
