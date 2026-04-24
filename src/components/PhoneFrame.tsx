"use client";

import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * PhoneFrame:
 * - On mobile (< 640px): fills viewport naturally
 * - On desktop (>= 640px): shows in phone-shaped frame with shadow
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-0 sm:p-8">
      <div
        className="
          relative overflow-hidden bg-bg-app
          w-full h-[100dvh] sm:h-[720px] sm:w-[360px]
          sm:rounded-[44px] sm:border sm:border-line-strong
          sm:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_0_80px_-20px_rgba(139,111,255,0.15)]
        "
      >
        {children}
      </div>
    </div>
  );
}
