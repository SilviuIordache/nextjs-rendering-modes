"use client";

import { FormEvent, useState } from "react";
import MovieCard from "@/app/components/MovieCard";
import RenderModeCard from "@/app/components/RenderModeCard";

type SearchResult = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
};

type SearchResponse = {
  results: SearchResult[];
};

export default function ExplorePage() {
  const [generatedAtIso] = useState(() => new Date().toISOString());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError("Enter a movie title to search.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(trimmedQuery)}`);
      if (!res.ok) {
        throw new Error(`Search failed with status ${res.status}`);
      }

      const data = (await res.json()) as SearchResponse;
      setResults(data.results ?? []);
    } catch {
      setResults([]);
      setError("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Explore
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              CSR route: search runs in the browser, API key stays on the server.
            </p>
          </div>
          <RenderModeCard
            mode="CSR"
            modeIcon="csr"
            modeFullName="Client-Side Rendering"
            modeDescription="Rendered and updated in the browser."
            generatedAtIso={generatedAtIso}
          />
        </header>

        <form onSubmit={onSubmit} className="mt-6 flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search movies..."
            className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-2.5 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-zinc-100 px-5 py-2.5 font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {error ? <p className="mt-4 text-rose-400">{error}</p> : null}

        {!isLoading && !error && results.length === 0 ? (
          <p className="mt-6 text-zinc-400">
            Start by searching for a movie title.
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              movieId={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              backdropPath={movie.backdrop_path}
              voteAverage={movie.vote_average}
              releaseDate={movie.release_date}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
