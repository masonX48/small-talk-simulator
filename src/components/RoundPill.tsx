"use client";

interface RoundPillProps {
  round: 1 | 2;
  totalRounds?: number;
  onLight?: boolean; // true when over video, uses brighter colors
}

export function RoundPill({
  round,
  totalRounds = 2,
  onLight = false,
}: RoundPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold ${
        onLight
          ? "bg-brand-softer border border-brand-light/30 text-white backdrop-blur-md"
          : "bg-brand-soft border border-brand-light/20 text-brand-light"
      }`}
    >
      R{round}
      <span className="inline-flex gap-1 ml-1">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            className={`w-1 h-1 rounded-full ${
              n <= round
                ? onLight
                  ? "bg-white"
                  : "bg-brand-light"
                : onLight
                ? "bg-white/30"
                : "bg-brand-light/30"
            }`}
          />
        ))}
      </span>
    </span>
  );
}
