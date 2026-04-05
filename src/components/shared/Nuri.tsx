"use client";

interface NuriProps {
  expression?: "neutral" | "happy" | "thinking";
  size?: number;
}

export function Nuri({ expression = "neutral", size = 120 }: NuriProps) {
  const s = size / 120; // scale factor
  const eyeY = expression === "happy" ? 36 : 38;
  const browAngle = expression === "thinking" ? -10 : 0;
  const wingAngle = expression === "happy" ? 35 : 20;
  const blushOpacity = expression === "happy" ? 0.4 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Nuri the owl, ${expression}`}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="60" fill="url(#nuriBg)" />
      {/* Body */}
      <ellipse cx="60" cy="66" rx="36" ry="34" fill="#7D6B3D" />
      {/* Belly */}
      <ellipse cx="60" cy="62" rx="24" ry="22" fill="#C4A96A" />
      {/* Left wing */}
      <ellipse
        cx="22"
        cy="62"
        rx="10"
        ry="16"
        fill="#5E4A28"
        transform={`rotate(${wingAngle} 22 62)`}
      />
      {/* Right wing */}
      <ellipse
        cx="98"
        cy="62"
        rx="10"
        ry="16"
        fill="#5E4A28"
        transform={`rotate(-${wingAngle} 98 62)`}
      />
      {/* Left eye */}
      <ellipse cx="44" cy="45" rx="10" ry="11" fill="#FFFFFF" />
      {/* Right eye */}
      <ellipse cx="76" cy="45" rx="10" ry="11" fill="#FFFFFF" />
      {/* Left pupil */}
      <ellipse cx={expression === "happy" ? 46 : 44} cy={eyeY} rx="5" ry="6" fill="#2D2926" />
      {/* Right pupil */}
      <ellipse cx={expression === "happy" ? 78 : 76} cy={eyeY} rx="5" ry="6" fill="#2D2926" />
      {/* Eye sparkles */}
      {expression === "happy" && (
        <>
          <circle cx="48" cy="37" r="2" fill="#FFFFFF" />
          <circle cx="80" cy="37" r="2" fill="#FFFFFF" />
        </>
      )}
      {/* Beak */}
      <polygon points="60,57 53,64 67,64" fill="#D4913A" />
      {/* Blush cheeks */}
      {blushOpacity > 0 && (
        <>
          <ellipse cx="34" cy="56" rx="6" ry="4" fill="#E8997F" opacity={blushOpacity} />
          <ellipse cx="86" cy="56" rx="6" ry="4" fill="#E8997F" opacity={blushOpacity} />
        </>
      )}
      {/* Eyebrows */}
      <line
        x1="36" y1="32" x2="52" y2="32"
        stroke="#2D2926" strokeWidth="2.5" strokeLinecap="round"
        transform={`rotate(${browAngle} 44 32)`}
      />
      <line
        x1="68" y1="32" x2="84" y2="32"
        stroke="#2D2926" strokeWidth="2.5" strokeLinecap="round"
        transform={`rotate(${-browAngle} 76 32)`}
      />
      {/* Feet */}
      <ellipse cx="47" cy="98" rx="7" ry="4" fill="#D4913A" />
      <ellipse cx="73" cy="98" rx="7" ry="4" fill="#D4913A" />
      {/* Thinking dots */}
      {expression === "thinking" && (
        <>
          <circle cx="95" cy="25" r="3" fill="#C4A96A" opacity="0.6" />
          <circle cx="102" cy="18" r="4" fill="#C4A96A" opacity="0.4" />
          <circle cx="110" cy="10" r="5" fill="#C4A96A" opacity="0.3" />
        </>
      )}
      <defs>
        <radialGradient id="nuriBg" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#F0E8D4" />
          <stop offset="1" stopColor="#E2D9C2" />
        </radialGradient>
      </defs>
    </svg>
  );
}
