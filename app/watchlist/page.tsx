import RenderModeCard from "@/app/components/RenderModeCard";
import WatchlistGrid from "./WatchlistGrid";

export const dynamic = "force-dynamic";

export default function WatchlistPage() {
  const generatedAtIso = new Date().toISOString();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Watchlist
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Movies saved in your local watchlist.
            </p>
          </div>
          <RenderModeCard
            mode="SSR"
            modeIcon="ssr"
            modeFullName="Server-Side Rendering"
            modeDescription="Rendered on each request."
            generatedAtIso={generatedAtIso}
          />
        </header>

        <WatchlistGrid />
      </div>
    </main>
  );
}
