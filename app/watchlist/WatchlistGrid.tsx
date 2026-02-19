"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/app/components/MovieCard";
import { useWatchlistMovieIds } from "@/app/lib/watchlist";
import type { GenreMovie } from "@/app/genres/tmdb";

type WatchlistResponse = {
  movies: GenreMovie[];
};

export default function WatchlistGrid() {
  const watchlistIds = useWatchlistMovieIds();
  const [movies, setMovies] = useState<GenreMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (watchlistIds.length === 0) {
      setMovies([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    async function loadMovies() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: watchlistIds }),
        });

        if (!res.ok) {
          throw new Error(`Watchlist API failed with status ${res.status}`);
        }

        const data = (await res.json()) as WatchlistResponse;
        if (isActive) {
          setMovies(data.movies);
        }
      } catch {
        if (isActive) {
          setMovies([]);
          setError("Could not load watchlist movies.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isActive = false;
    };
  }, [watchlistIds]);

  if (watchlistIds.length === 0) {
    return (
      <p className="mt-8 text-zinc-400">
        Your watchlist is empty. Tap the heart on a movie card to add one.
      </p>
    );
  }

  if (isLoading) {
    return <p className="mt-8 text-zinc-400">Loading watchlist movies...</p>;
  }

  if (error) {
    return <p className="mt-8 text-rose-400">{error}</p>;
  }

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movieId={movie.id}
          title={movie.title}
          posterPath={movie.posterPath}
          backdropPath={movie.backdropPath}
          voteAverage={movie.voteAverage}
          releaseDate={movie.releaseDate}
        />
      ))}
    </section>
  );
}
