"use client";

import Image from "next/image";

interface MiloProps {
  expression?: "neutral" | "happy" | "thinking";
  size?: number;
}

const MILO_IMAGES: Record<string, string> = {
  neutral: "/icons/milo-neutral.png",
  happy: "/icons/milo-happy.png",
  thinking: "/icons/milo-thinking.png",
};

/**
 * Milo - The EduBridge cat mascot.
 * A cute white cat with gray tabby patches, golden eyes, and blue "Milo" collar tag.
 * Generated from the real Milo using Gemini AI.
 */
export function Milo({ expression = "neutral", size = 120 }: MiloProps) {
  const src = MILO_IMAGES[expression] || MILO_IMAGES.neutral;

  return (
    <Image
      src={src}
      alt={`Milo the cat, ${expression}`}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      priority={size >= 100}
    />
  );
}
