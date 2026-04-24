"use client";

interface StakesMeterProps {
  level: 1 | 2 | 3;
  onLight?: boolean;
}

export function StakesMeter({ level, onLight = false }: StakesMeterProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((n) => {
        const isOn = n <= level;
        return (
          <div
            key={n}
            className={`w-3.5 h-[3px] rounded-sm ${
              isOn
                ? onLight
                  ? "bg-white shadow-[0_0_6px_rgba(184,165,255,0.6)]"
                  : "bg-brand-light"
                : onLight
                ? "bg-white/20"
                : "bg-brand-light/15"
            }`}
          />
        );
      })}
    </div>
  );
}
