"use client";

import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

export function MathRenderer({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }, [html]);

  return (
    <div 
      ref={containerRef}
      className="prose prose-lg dark:prose-invert max-w-none text-gray-700 mb-12" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
