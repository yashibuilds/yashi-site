import GithubSlugger from "github-slugger";

export type TocItem = {
  id: string;
  text: string;
  depth: number;
};

/**
 * Extracts h2–h4 headings from markdown, slugging them the same way
 * rehype-slug does so the TOC links match the rendered heading ids.
 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const withoutCode = markdown.replace(/^```[\s\S]*?^```/gm, "");
  const items: TocItem[] = [];
  for (const match of withoutCode.matchAll(/^(#{2,4})[ \t]+(.+)$/gm)) {
    const depth = match[1].length;
    const text = match[2].replace(/\*\*|__|[*_`]/g, "").trim();
    items.push({ id: slugger.slug(text), text, depth });
  }
  return items;
}
