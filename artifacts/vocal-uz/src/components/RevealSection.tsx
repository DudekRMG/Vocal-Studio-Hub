import { type ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RevealSection({ children, delay = 0, className = "" }: RevealSectionProps) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={visible ? `animate-[fadeUp_0.7s_both] ${className}` : className}
      style={
        visible
          ? delay > 0
            ? { animationDelay: `${delay}s` }
            : undefined
          : { opacity: 0, transform: "translateY(20px)" }
      }
    >
      {children}
    </div>
  );
}
