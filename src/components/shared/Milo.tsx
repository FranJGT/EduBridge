"use client";

interface MiloProps {
  expression?: "neutral" | "happy" | "thinking";
  size?: number;
}

/**
 * Milo - A cute white cat with gray tabby markings, golden eyes, and blue "Milo" tag.
 * Designed to look charming at any size (32px to 200px).
 */
export function Milo({ expression = "neutral", size = 120 }: MiloProps) {
  const isHappy = expression === "happy";
  const isThinking = expression === "thinking";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Milo the cat, ${expression}`}
    >
      <defs>
        <radialGradient id="miloBg" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F0EE" />
        </radialGradient>
        <radialGradient id="eyeGrad" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx="100" cy="100" r="98" fill="url(#miloBg)" />
      <circle cx="100" cy="100" r="98" stroke="#C7D2FE" strokeWidth="1" />

      {/* Tail - fluffy dark */}
      <path
        d={isHappy
          ? "M145,145 Q175,115 170,85 Q168,72 158,68"
          : "M145,145 Q170,120 165,90 Q163,78 155,75"}
        stroke="#78716C"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={isHappy
          ? "M145,145 Q175,115 170,85 Q168,72 158,68"
          : "M145,145 Q170,120 165,90 Q163,78 155,75"}
        stroke="#9CA3AF"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body */}
      <ellipse cx="100" cy="138" rx="48" ry="42" fill="url(#bodyGrad)" />

      {/* Tabby patch on back/side */}
      <ellipse cx="118" cy="125" rx="22" ry="16" fill="#D1D5DB" opacity="0.5" transform="rotate(-15 118 125)" />
      <path d="M105,118 Q112,114 120,118" stroke="#A8A29E" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M108,123 Q115,119 122,123" stroke="#A8A29E" strokeWidth="1" fill="none" opacity="0.3" />

      {/* White chest */}
      <ellipse cx="98" cy="142" rx="30" ry="28" fill="#FFFFFF" />

      {/* Front paws */}
      <ellipse cx="78" cy="172" rx="14" ry="8" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="1" />
      <ellipse cx="120" cy="172" rx="14" ry="8" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="1" />
      {/* Paw pads - tiny pink ovals */}
      <ellipse cx="75" cy="174" rx="3" ry="2" fill="#FECDD3" opacity="0.6" />
      <ellipse cx="81" cy="174" rx="3" ry="2" fill="#FECDD3" opacity="0.6" />
      <ellipse cx="117" cy="174" rx="3" ry="2" fill="#FECDD3" opacity="0.6" />
      <ellipse cx="123" cy="174" rx="3" ry="2" fill="#FECDD3" opacity="0.6" />

      {/* Head */}
      <ellipse cx="100" cy="82" rx="42" ry="38" fill="url(#bodyGrad)" />

      {/* Tabby markings on head */}
      <ellipse cx="82" cy="68" rx="18" ry="12" fill="#C4B5A8" opacity="0.45" transform="rotate(-8 82 68)" />
      <ellipse cx="118" cy="68" rx="18" ry="12" fill="#C4B5A8" opacity="0.45" transform="rotate(8 118 68)" />

      {/* Tabby M mark on forehead */}
      <path d="M83,60 L92,52 L100,58 L108,52 L117,60" stroke="#A8A29E" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />

      {/* Left ear */}
      <path d="M64,62 L52,22 L82,50 Z" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1" />
      <path d="M66,58 L56,28 L78,50 Z" fill="#FECDD3" opacity="0.35" />
      {/* Ear tabby */}
      <path d="M58,35 L68,50" stroke="#C4B5A8" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M62,32 L70,46" stroke="#C4B5A8" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

      {/* Right ear */}
      <path d="M136,62 L148,22 L118,50 Z" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1" />
      <path d="M134,58 L144,28 L122,50 Z" fill="#FECDD3" opacity="0.35" />
      {/* Ear tabby */}
      <path d="M142,35 L132,50" stroke="#C4B5A8" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M138,32 L130,46" stroke="#C4B5A8" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

      {/* Eyes */}
      {isHappy ? (
        <>
          {/* Happy - squinted/smiling eyes */}
          <path d="M76,82 Q84,74 92,82" stroke="#78716C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M108,82 Q116,74 124,82" stroke="#78716C" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Normal/thinking - big golden eyes */}
          <ellipse cx="84" cy="82" rx="12" ry="13" fill="#FFFFFF" />
          <ellipse cx="116" cy="82" rx="12" ry="13" fill="#FFFFFF" />
          <ellipse cx={isThinking ? 82 : 84} cy={isThinking ? 80 : 82} rx="8" ry="9" fill="url(#eyeGrad)" />
          <ellipse cx={isThinking ? 114 : 116} cy={isThinking ? 80 : 82} rx="8" ry="9" fill="url(#eyeGrad)" />
          {/* Pupils - vertical cat slit */}
          <ellipse cx={isThinking ? 82 : 84} cy={isThinking ? 80 : 82} rx="3" ry="7" fill="#1C1917" />
          <ellipse cx={isThinking ? 114 : 116} cy={isThinking ? 80 : 82} rx="3" ry="7" fill="#1C1917" />
          {/* Eye shine */}
          <circle cx={isThinking ? 79 : 81} cy="78" r="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx={isThinking ? 111 : 113} cy="78" r="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx={isThinking ? 85 : 87} cy="85" r="1.5" fill="#FFFFFF" opacity="0.5" />
          <circle cx={isThinking ? 117 : 119} cy="85" r="1.5" fill="#FFFFFF" opacity="0.5" />
        </>
      )}

      {/* Nose - pink triangle */}
      <path d="M96,94 L100,100 L104,94 Z" fill="#FDA4AF" />
      <path d="M96,94 L100,100 L104,94 Z" stroke="#F9A8D4" strokeWidth="0.5" />

      {/* Mouth */}
      <path d="M100,100 L100,104" stroke="#D6D3D1" strokeWidth="1.2" />
      <path d="M94,106 Q100,110 106,106" stroke="#D6D3D1" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="52" y1="88" x2="76" y2="92" stroke="#D6D3D1" strokeWidth="1" opacity="0.7" />
      <line x1="50" y1="96" x2="76" y2="96" stroke="#D6D3D1" strokeWidth="1" opacity="0.7" />
      <line x1="54" y1="104" x2="76" y2="100" stroke="#D6D3D1" strokeWidth="1" opacity="0.6" />
      <line x1="124" y1="92" x2="148" y2="88" stroke="#D6D3D1" strokeWidth="1" opacity="0.7" />
      <line x1="124" y1="96" x2="150" y2="96" stroke="#D6D3D1" strokeWidth="1" opacity="0.7" />
      <line x1="124" y1="100" x2="146" y2="104" stroke="#D6D3D1" strokeWidth="1" opacity="0.6" />

      {/* Collar */}
      <path d="M68,112 Q100,122 132,112" stroke="#6366F1" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Blue tag - bone shape */}
      <path d="M90,118 Q88,114 90,112 L110,112 Q112,114 110,118 L108,122 Q100,126 92,122 Z" fill="#3B82F6" />
      <path d="M90,118 Q88,114 90,112 L110,112 Q112,114 110,118 L108,122 Q100,126 92,122 Z" stroke="#2563EB" strokeWidth="0.8" />
      <text x="100" y="119" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF" fontFamily="Inter, sans-serif">
        Milo
      </text>

      {/* Thinking bubbles */}
      {isThinking && (
        <>
          <circle cx="150" cy="50" r="5" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="0.5" />
          <circle cx="160" cy="38" r="7" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="0.5" />
          <circle cx="172" cy="24" r="9" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="0.5" />
          {/* Math symbol in thought bubble */}
          <text x="172" y="28" textAnchor="middle" fontSize="10" fill="#6366F1" fontFamily="serif" fontStyle="italic">∫</text>
        </>
      )}

      {/* Happy blush marks */}
      {isHappy && (
        <>
          <ellipse cx="70" cy="92" rx="8" ry="4" fill="#FECDD3" opacity="0.4" />
          <ellipse cx="130" cy="92" rx="8" ry="4" fill="#FECDD3" opacity="0.4" />
        </>
      )}
    </svg>
  );
}
