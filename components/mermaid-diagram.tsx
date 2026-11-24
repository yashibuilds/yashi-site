"use client";

import { useEffect, useState } from "react";

let renderCounter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "neutral",
        fontFamily: "var(--font-geist-sans), sans-serif",
      });
      const id = `mermaid-${renderCounter++}`;
      const { svg } = await mermaid.render(id, chart.trim());
      if (!cancelled) setSvg(svg);
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (!svg) {
    return (
      <div className="my-8 flex h-40 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="my-8 flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
