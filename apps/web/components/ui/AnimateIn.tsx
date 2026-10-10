"use client";

import type { CSSProperties } from "react";
import { useRevelar } from "@/components/ui/useRevelar";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "none";
}

export default function AnimateIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: Props) {
  const ref = useRevelar<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-direccion={direction}
      className={`volt-reveal ${className}`}
      style={{ "--volt-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
