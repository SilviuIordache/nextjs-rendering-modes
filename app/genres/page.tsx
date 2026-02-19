import Link from "next/link";
import GeneratedAtCard from "@/app/components/GeneratedAtCard";
import GenreCard from "./GenreCard";
import { getGenresWithBackdrops } from "./tmdb";

export const dynamic = "force-static";

export default async function GenresPage() {
  const generatedAtIso = new Date().toISOString();
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing TMDB_ACCESS_TOKEN in environment variables.");
  }

  const genresWithImages = await getGenresWithBackdrops(accessToken);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Browse by Genre
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Pick a genre to continue to its page.
            </p>
          </div>
          <GeneratedAtCard
            mode="SSG"
            generatedAtIso={generatedAtIso}
            showRelative
          />
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genresWithImages.map((genre) => (
            <Link key={genre.id} href={`/genres/${genre.id}`} className="block">
              <GenreCard name={genre.name} backdrop={genre.backdrop} />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
