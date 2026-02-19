"use client";

import {
  toggleWatchlistMovie,
  useWatchlistMovieIds,
} from "@/app/lib/watchlist";

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
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition ${
          isInWatchlist ? "fill-rose-500 text-rose-500" : "fill-transparent"
        }`}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 21s-6.716-4.259-9.2-8.03C.83 9.987 2.07 6.5 5.255 5.485c2.09-.67 4.132.204 5.329 1.786 1.197-1.582 3.24-2.456 5.33-1.786 3.183 1.015 4.424 4.502 2.455 7.485C18.885 16.741 12 21 12 21z" />
      </svg>
    </button>
  );
}
