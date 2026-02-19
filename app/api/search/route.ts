import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `TMDB request failed with status ${res.status}.` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
