"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

const INDENT: Record<number, string> = {
  2: "",
  3: "pl-3",
  4: "pl-6",
};

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = item.id;
        }
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Table of contents
      </p>
      <ul className="mt-4 flex flex-col gap-2.5 border-l border-zinc-100 pl-4 text-sm dark:border-zinc-800/80">
        {items.map((item) => (
          <li key={item.id} className={INDENT[item.depth]}>
            <a
              href={`#${item.id}`}
              className={
                activeId === item.id
                  ? "font-medium text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
