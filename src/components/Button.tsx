"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    const base =
      "w-full rounded-full font-semibold text-[15px] tracking-wide transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
    const styles =
      variant === "primary"
        ? "bg-gradient-brand text-white py-[18px] px-7 shadow-cta hover:-translate-y-0.5"
        : "bg-transparent text-ink border border-line-strong py-[16px] px-7 hover:border-brand-softer";
    return (
      <button
        ref={ref}
        className={`${base} ${styles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
