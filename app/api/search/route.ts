import { NextRequest, NextResponse } from "next/server";
import { tmdbGetJson } from "@/app/lib/tmdb-server";

export const dynamic = "force-dynamic";

type SearchMovie = {
  adult?: boolean;
};

type SearchResponse = {
  results: SearchMovie[];
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter." }, { status: 400 });
  }

  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing TMDB access token." },
      { status: 500 },
    );
  }

  try {
    const data = await tmdbGetJson<SearchResponse>({
      accessToken,
      path: "/search/movie",
      query: {
        query,
        include_adult: false,
        language: "en-US",
        region: "US",
      },
    });

    return NextResponse.json({
      ...data,
      // Defensive filter in case upstream content still includes adult titles.
      results: (data.results ?? []).filter((movie) => movie.adult !== true),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TMDB request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
