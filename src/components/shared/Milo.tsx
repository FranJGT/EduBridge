"use client";

interface MiloProps {
  expression?: "neutral" | "happy" | "thinking";
  size?: number;
}

/**
 * Milo - A white cat with gray tabby patches, golden eyes, and a blue "Milo" tag.
 * Based on the real cat: white body, gray/brown tabby head and back patches,
 * amber eyes, blue bone-shaped collar tag, fluffy dark tail.
 */
export function Milo({ expression = "neutral", size = 120 }: MiloProps) {
  const eyeShift = expression === "happy" ? 1 : expression === "thinking" ? -1 : 0;
  const earTilt = expression === "happy" ? 3 : 0;
  const tailCurve = expression === "happy" ? "M85,88 Q105,60 95,45" : "M85,88 Q100,70 92,55";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Milo the cat, ${expression}`}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="60" fill="#F3F4F6" />

      {/* Tail */}
      <path
        d={tailCurve}
        stroke="#6B7280"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body - white */}
      <ellipse cx="58" cy="78" rx="30" ry="28" fill="#FAFAFA" />
      <ellipse cx="58" cy="78" rx="30" ry="28" stroke="#E5E7EB" strokeWidth="0.5" />

      {/* Chest - white */}
      <ellipse cx="58" cy="72" rx="20" ry="16" fill="#FFFFFF" />

      {/* Head */}
      <ellipse cx="58" cy="48" rx="24" ry="22" fill="#FAFAFA" />
      <ellipse cx="58" cy="48" rx="24" ry="22" stroke="#E5E7EB" strokeWidth="0.5" />

      {/* Tabby patches on head */}
      <ellipse cx="48" cy="38" rx="12" ry="8" fill="#9CA3AF" opacity="0.5" />
      <ellipse cx="68" cy="38" rx="12" ry="8" fill="#9CA3AF" opacity="0.5" />
      {/* Tabby stripes on forehead */}
      <path d="M50,34 Q58,30 66,34" stroke="#6B7280" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M52,37 Q58,33 64,37" stroke="#6B7280" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Tabby patch on back */}
      <ellipse cx="65" cy="70" rx="14" ry="10" fill="#9CA3AF" opacity="0.35" />

      {/* Left ear */}
      <polygon
        points="38,30 30,12 48,24"
        fill="#FAFAFA"
        stroke="#E5E7EB"
        strokeWidth="0.5"
        transform={`rotate(${-earTilt} 38 20)`}
      />
      <polygon
        points="39,28 33,16 46,25"
        fill="#F9A8D4"
        opacity="0.3"
        transform={`rotate(${-earTilt} 38 20)`}
      />

      {/* Right ear */}
      <polygon
        points="78,30 86,12 68,24"
        fill="#FAFAFA"
        stroke="#E5E7EB"
        strokeWidth="0.5"
        transform={`rotate(${earTilt} 78 20)`}
      />
      <polygon
        points="77,28 83,16 70,25"
        fill="#F9A8D4"
        opacity="0.3"
        transform={`rotate(${earTilt} 78 20)`}
      />
      {/* Tabby on ears */}
      <line x1="35" y1="20" x2="42" y2="28" stroke="#9CA3AF" strokeWidth="1" opacity="0.4" />
      <line x1="81" y1="20" x2="74" y2="28" stroke="#9CA3AF" strokeWidth="1" opacity="0.4" />

      {/* Eyes - golden/amber */}
      <ellipse cx={48 + eyeShift} cy="46" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx={68 + eyeShift} cy="46" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx={48 + eyeShift} cy={expression === "happy" ? 47 : 46} rx="3.5" ry={expression === "happy" ? 3 : 4.5} fill="#D97706" />
      <ellipse cx={68 + eyeShift} cy={expression === "happy" ? 47 : 46} rx="3.5" ry={expression === "happy" ? 3 : 4.5} fill="#D97706" />
      {/* Pupils */}
      <ellipse cx={48 + eyeShift} cy={expression === "happy" ? 47 : 46} rx="1.5" ry={expression === "happy" ? 2 : 3.5} fill="#1F2937" />
      <ellipse cx={68 + eyeShift} cy={expression === "happy" ? 47 : 46} rx="1.5" ry={expression === "happy" ? 2 : 3.5} fill="#1F2937" />
      {/* Eye shine */}
      <circle cx={46 + eyeShift} cy="44" r="1.5" fill="#FFFFFF" />
      <circle cx={66 + eyeShift} cy="44" r="1.5" fill="#FFFFFF" />

      {/* Nose */}
      <ellipse cx="58" cy="54" rx="3" ry="2" fill="#F9A8D4" />

      {/* Mouth */}
      <path d="M55,56 Q58,59 61,56" stroke="#9CA3AF" strokeWidth="1" fill="none" />

      {/* Whiskers */}
      <line x1="35" y1="52" x2="48" y2="54" stroke="#D1D5DB" strokeWidth="0.8" />
      <line x1="35" y1="56" x2="48" y2="56" stroke="#D1D5DB" strokeWidth="0.8" />
      <line x1="68" y1="54" x2="81" y2="52" stroke="#D1D5DB" strokeWidth="0.8" />
      <line x1="68" y1="56" x2="81" y2="56" stroke="#D1D5DB" strokeWidth="0.8" />

      {/* Blue collar tag */}
      <ellipse cx="58" cy="66" rx="8" ry="6" fill="#3B82F6" />
      <ellipse cx="58" cy="66" rx="8" ry="6" stroke="#2563EB" strokeWidth="0.5" />
      <text x="58" y="68" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#FFFFFF">
        Milo
      </text>
      {/* Collar line */}
      <path d="M40,64 Q58,68 76,64" stroke="#6B7280" strokeWidth="1.5" fill="none" />

      {/* Paws */}
      <ellipse cx="45" cy="100" rx="8" ry="5" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="0.5" />
      <ellipse cx="71" cy="100" rx="8" ry="5" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="0.5" />

      {/* Thinking bubbles */}
      {expression === "thinking" && (
        <>
          <circle cx="90" cy="28" r="3" fill="#E5E7EB" />
          <circle cx="97" cy="20" r="4" fill="#E5E7EB" />
          <circle cx="105" cy="12" r="5" fill="#E5E7EB" />
        </>
      )}
    </svg>
  );
}
