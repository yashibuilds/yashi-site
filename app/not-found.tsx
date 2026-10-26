import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-6 py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        That page doesn&apos;t exist (yet).
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        &larr; Back home
      </Link>
    </div>
  );
}
