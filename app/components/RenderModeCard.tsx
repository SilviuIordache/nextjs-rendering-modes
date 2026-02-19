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
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(new Date(iso));
}

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs <= 0) return "just now";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  if (totalMinutes < 60) return `${totalMinutes}m ago`;

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ago`;
  return `${hours}h ${minutes}m ago`;
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
    <aside className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 shadow-sm sm:w-[380px] dark:border-white/15 dark:bg-zinc-900">
      <div className="space-y-1">
        <div className="flex items-end gap-2.5">
          <ModeIcon
            className="h-7 w-7 text-zinc-100"
            strokeWidth={2.2}
            aria-hidden
          />
          <p className="text-3xl font-extrabold uppercase leading-none tracking-[0.08em] text-zinc-200 dark:text-zinc-100">
            {mode}
          </p>
          <p className="pb-0.5 text-xs font-semibold tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
            {modeFullName}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm leading-snug text-zinc-400 dark:text-zinc-400">
        {modeDescription}
      </p>
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        <Clock3 className="h-[12px] w-[12px]" aria-hidden />
        <span>
          {absolute}
          {showRelative ? ` (${relative})` : ""}
        </span>
      </p>
    </aside>
  );
}
