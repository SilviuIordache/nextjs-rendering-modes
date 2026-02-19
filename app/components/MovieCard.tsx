import WatchlistButton from "./WatchlistButton";

type MovieCardProps = {
  movieId: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
};

const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

function formatReleaseYear(releaseDate: string | null) {
  if (!releaseDate) return "Unknown year";
  return releaseDate.slice(0, 4);
}

export default function MovieCard({
  movieId,
  title,
  posterPath,
  backdropPath,
  voteAverage,
  releaseDate,
}: MovieCardProps) {
  const imagePath = posterPath ?? backdropPath;
  const imageUrl = imagePath
    ? `${posterPath ? TMDB_POSTER_BASE_URL : TMDB_BACKDROP_BASE_URL}${imagePath}`
    : null;

  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/15 dark:bg-zinc-900">
      <div className="relative">
        {imageUrl ? (
          <div
            className="aspect-[16/10] w-full bg-cover bg-center sm:aspect-[2/3]"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-zinc-200 to-zinc-300 sm:aspect-[2/3] dark:from-zinc-700 dark:to-zinc-800" />
        )}
        <WatchlistButton movieId={movieId} movieTitle={title} />
      </div>
      <div className="space-y-2 p-4">
        <h2 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatReleaseYear(releaseDate)} • {voteAverage.toFixed(1)} / 10
        </p>
      </div>
    </article>
  );
}
