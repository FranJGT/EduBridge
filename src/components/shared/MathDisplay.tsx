"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathDisplayProps {
  latex: string;
  display?: boolean;
  className?: string;
}

/**
 * Renders LaTeX math notation using KaTeX.
 * Use `display` for block-level equations, default is inline.
 */
export function MathDisplay({ latex, display = false, className = "" }: MathDisplayProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && latex) {
      try {
        katex.render(latex, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = latex;
        }
      }
    }
  }, [latex, display]);

  return <span ref={ref} className={`math-display ${className}`} />;
}
