# Next.js Render Modes Demo

A demo project that showcases how rendering strategies work in the Next.js App Router:

- `SSG` (Static Site Generation)
- `ISR` (Incremental Static Regeneration)
- `SSR` (Server-Side Rendering)
- `CSR` (Client-Side Rendering)

The app uses TMDB data and includes a localStorage-based watchlist to show client-side state behavior alongside server rendering modes.

## Live Demo

Try it here:

[https://nextjs-rendering-modes-wine.vercel.app/](https://nextjs-rendering-modes-wine.vercel.app/)

## Routes

- `/` - Overview landing page with links to each rendering mode demo
- `/genres` - `SSG` list of genres
- `/genres/[id]` - `SSG` genre detail pages (generated via `generateStaticParams`)
- `/trending` - `ISR` page (`revalidate = 600`)
- `/watchlist` - `SSR` page (server-rendered per request) with client-hydrated local watchlist items
- `/explore` - `CSR` search page (browser-driven interactions)

## API Routes

- `/api/search` - Proxies TMDB search requests (keeps TMDB token on the server)
- `/api/watchlist` - Fetches movie details for local watchlist IDs

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- `lucide-react` icons

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with:

```bash
TMDB_ACCESS_TOKEN=your_tmdb_bearer_token
```

3. Start the dev server:

```bash
npm run dev
```

4. Open:

[http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm run start
```
