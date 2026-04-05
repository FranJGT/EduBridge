"use client";

import { useState, useEffect } from "react";

interface SpeechBubbleProps {
  text: string;
  label?: string;
  typewriter?: boolean;
  className?: string;
}

export function SpeechBubble({
  text,
  label = "Milo says:",
  typewriter = false,
  className = "",
}: SpeechBubbleProps) {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (!typewriter) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [text, typewriter]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm ${className}`}
    >
      <div className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 120 120" fill="none">
          <ellipse cx="60" cy="66" rx="36" ry="34" fill="#7D6B3D" />
          <ellipse cx="60" cy="62" rx="24" ry="22" fill="#C4A96A" />
          <ellipse cx="44" cy="45" rx="10" ry="11" fill="#FFF" />
          <ellipse cx="76" cy="45" rx="10" ry="11" fill="#FFF" />
          <ellipse cx="44" cy="48" rx="5" ry="6" fill="#2D2926" />
          <ellipse cx="76" cy="48" rx="5" ry="6" fill="#2D2926" />
          <polygon points="60,57 53,64 67,64" fill="#D4913A" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary mb-1">{label}</p>
        <p className="text-sm text-foreground/80 leading-relaxed">{displayed}</p>
      </div>
    </div>
  );
}
