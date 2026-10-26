import fs from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** Draft posts appear in the list but have no page yet. */
  draft?: boolean;
};

export const posts: Post[] = [
  {
    slug: "building-a-smol-inference-engine-for-smollm2",
    title: "Building a smol inference engine for SmolLM2",
    description:
      "Making each step of LLM inference more intuitive, one smol model at a time.",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug && !post.draft);
}

export function getPostContent(slug: string): string {
  const filePath = path.join(process.cwd(), "content", "posts", `${slug}.md`);
  return fs.readFileSync(filePath, "utf8");
}