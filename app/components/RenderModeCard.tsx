"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Monitor, RefreshCw, Server, Wrench } from "lucide-react";

type RenderModeCardProps = {
  mode: string;
  modeFullName: string;
  modeDescription: string;
  modeIcon: "ssg" | "isr" | "ssr" | "csr";
  generatedAtIso: string;
  showRelative?: boolean;
};

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

export default function RenderModeCard({
  mode,
  modeFullName,
  modeDescription,
  modeIcon,
  generatedAtIso,
  showRelative = false,
}: RenderModeCardProps) {
  const absolute = useMemo(() => formatGeneratedAt(generatedAtIso), [generatedAtIso]);
  const [relative, setRelative] = useState("just now");

  useEffect(() => {
    if (!showRelative) return;

    const update = () => setRelative(formatRelative(generatedAtIso));
    update();
    const intervalId = window.setInterval(update, 60_000);

    return () => window.clearInterval(intervalId);
  }, [generatedAtIso, showRelative]);

  const ModeIcon = {
    ssg: Wrench,
    isr: RefreshCw,
    ssr: Server,
    csr: Monitor,
  }[modeIcon];

  return (
    <aside className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm sm:w-[380px] dark:border-white/15 dark:bg-zinc-900">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <ModeIcon
            className="h-7 w-7 text-zinc-100"
            strokeWidth={2.2}
            aria-hidden
          />
          <p className="text-3xl font-extrabold uppercase leading-none tracking-[0.08em] text-zinc-200 dark:text-zinc-100">
            {mode}
          </p>
        </div>
        <p className="text-xs font-semibold tracking-[0.04em] text-zinc-500 dark:text-zinc-400">
          {modeFullName}
        </p>
      </div>
      <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-400">
        {modeDescription}
      </p>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Clock3 className="h-[12px] w-[12px]" aria-hidden />
        <span>
          {absolute}
          {showRelative ? ` (${relative})` : ""}
        </span>
      </p>
    </aside>
  );
}
