import Link from "next/link";
import { Monitor, RefreshCw, Server, Wrench } from "lucide-react";

const routes = [
  {
    mode: "SSG",
    icon: Wrench,
    title: "Static Site Generation",
    description: "Built once at deploy time.",
    href: "/genres",
  },
  {
    mode: "ISR",
    icon: RefreshCw,
    title: "Incremental Static Regeneration",
    description: "Revalidates in the background on an interval.",
    href: "/trending",
  },
  {
    mode: "SSR",
    icon: Server,
    title: "Server-Side Rendering",
    description: "Rendered fresh on every request.",
    href: "/watchlist",
  },
  {
    mode: "CSR",
    icon: Monitor,
    title: "Client-Side Rendering",
    description: "Browser-driven interactivity and data fetching.",
    href: "/explore",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            Next.js Render Modes Demo
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Explore each route to compare how SSG, ISR, SSR, and CSR behave in a
            real app.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.mode}
              href={route.href}
              className="rounded-xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-white/20 hover:bg-zinc-900"
            >
              <div className="inline-flex items-center gap-2.5">
                <route.icon className="h-6 w-6 text-zinc-100" aria-hidden />
                <p className="text-2xl font-extrabold uppercase tracking-[0.08em] text-zinc-100">
                  {route.mode}
                </p>
              </div>
              <p className="mt-1 text-sm font-semibold text-zinc-400">
                {route.title}
              </p>
              <p className="mt-3 text-zinc-300">{route.description}</p>
              <p className="mt-4 text-sm font-medium text-zinc-500">
                Open route: {route.href}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
