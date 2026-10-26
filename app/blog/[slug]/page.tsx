import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getPost, getPostContent, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const content = getPostContent(post.slug);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <nav>
        <Link
          href="/"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          &larr; Yashi Surapaneni
        </Link>
      </nav>

      <header className="mt-10">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {post.title}
        </h1>
      </header>

      <hr className="mt-10 border-zinc-100 dark:border-zinc-800/80" />

      <article className="prose prose-zinc mt-10 max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:mt-12 prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-50 prose-pre:text-[13px] prose-pre:leading-relaxed prose-pre:text-zinc-800 dark:prose-pre:border-zinc-800 dark:prose-pre:bg-zinc-900/60 dark:prose-pre:text-zinc-200 prose-code:before:content-none prose-code:after:content-none prose-hr:border-zinc-100 dark:prose-hr:border-zinc-800/80">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </Markdown>
      </article>
    </div>
  );
}
