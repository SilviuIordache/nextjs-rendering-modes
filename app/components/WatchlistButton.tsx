"use client";

import {
  toggleWatchlistMovie,
  useWatchlistMovieIds,
} from "@/app/lib/watchlist";
import { Heart } from "lucide-react";

type WatchlistButtonProps = {
  movieId: number;
  movieTitle: string;
};

export default function WatchlistButton({
  movieId,
  movieTitle,
}: WatchlistButtonProps) {
  const watchlistMovieIds = useWatchlistMovieIds();
  const isInWatchlist = watchlistMovieIds.includes(movieId);

  const toggleWatchlist = () => {
    toggleWatchlistMovie(movieId);
  };

  return (
    <button
      type="button"
      onClick={toggleWatchlist}
      aria-label={
        isInWatchlist
          ? `Remove ${movieTitle} from watchlist`
          : `Add ${movieTitle} to watchlist`
      }
      title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      className="absolute right-3 top-3 rounded-full border border-black/15 bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/70 dark:border-white/20 dark:bg-black/50 dark:hover:bg-black/70"
    >
      <Heart
        className={`h-5 w-5 transition ${
          isInWatchlist ? "fill-rose-500 text-rose-500" : "fill-transparent"
        }`}
        strokeWidth={1.8}
      />
    </button>
  );
}
