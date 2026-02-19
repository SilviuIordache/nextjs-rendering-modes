type GenreCardProps = {
  name: string;
  backdrop: string | null;
};

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

export default function GenreCard({ name, backdrop }: GenreCardProps) {
  const backdropUrl = backdrop ? `${TMDB_IMAGE_BASE_URL}${backdrop}` : null;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/15 dark:bg-zinc-900">
      {backdropUrl ? (
        <div
          className="h-36 w-full bg-cover bg-center grayscale-[60%] transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      ) : (
        <div className="h-36 w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
      )}
      <div className="p-5">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {name}
        </h2>
      </div>
    </article>
  );
}
