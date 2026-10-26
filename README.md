# Yashi Surapaneni — personal site

A minimalist personal website built with Next.js, TypeScript, and Tailwind CSS. The home page lists blog posts; each post is written in Markdown and rendered with `react-markdown`.

## Structure

- `app/page.tsx` — home page (name + blog list)
- `app/blog/[slug]/page.tsx` — blog post page
- `content/posts/*.md` — blog post content in Markdown
- `lib/posts.ts` — post metadata; add an entry here and a matching `.md` file to publish a new post

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (the dev server picks the port passed via `-p`, or 3000 by default).
