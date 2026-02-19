import { NextResponse } from "next/server";
import type { GenreMovie } from "@/app/genres/tmdb";
import { tmdbGetJson } from "@/app/lib/tmdb-server";

type TmdbMovieResponse = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
};

export const dynamic = "force-dynamic";

function sanitizeIds(input: unknown): number[] {
  if (!Array.isArray(input)) return [];

  return [
    ...new Set(
      input.filter(
        (value): value is number =>
          typeof value === "number" &&
          Number.isInteger(value) &&
          value > 0 &&
          value < Number.MAX_SAFE_INTEGER,
      ),
    ),
  ].slice(0, 50);
}

export async function POST(req: Request) {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing TMDB access token." },
      { status: 500 },
    );
  }

  const body = (await req.json()) as { ids?: unknown };
  const ids = sanitizeIds(body.ids);

  if (ids.length === 0) {
    return NextResponse.json({ movies: [] satisfies GenreMovie[] });
  }

  const movies = await Promise.all(
    ids.map(async (id) => {
      try {
        const movie = await tmdbGetJson<TmdbMovieResponse>({
          accessToken,
          path: `/movie/${id}`,
        });
        const mappedMovie: GenreMovie = {
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          voteAverage: movie.vote_average,
          releaseDate: movie.release_date,
        };
        return mappedMovie;
      } catch {
        return null;
      }
    }),
  );

  return NextResponse.json({
    movies: movies.filter((movie): movie is GenreMovie => movie !== null),
  });
}
