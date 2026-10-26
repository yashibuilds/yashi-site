import Link from "next/link";
import { formatDate, posts } from "@/lib/posts";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Yashi Surapaneni
        </h1>
      </header>

      <main className="mt-14">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Blog
        </h2>
        <ul className="mt-6 flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="text-lg font-medium text-zinc-800 underline-offset-4 group-hover:underline dark:text-zinc-200">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="shrink-0 text-sm tabular-nums text-zinc-400 dark:text-zinc-500"
                >
                  {formatDate(post.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
