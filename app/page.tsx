import Link from "next/link";
import { posts } from "@/lib/posts";

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
        <ul className="mt-6 flex flex-col gap-5">
          {posts.map((post) => (
            <li key={post.slug}>
              {post.draft ? (
                <span className="text-lg font-medium text-zinc-400 dark:text-zinc-600">
                  {post.title}
                </span>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-lg font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
                >
                  {post.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
