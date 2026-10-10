"use client";

import { useRevelar } from "@/components/ui/useRevelar";

// Escalonado: cada hijo entra 90 ms después del anterior.
function escalonar(el: HTMLElement) {
  Array.from(el.children).forEach((hijo, i) =>
    (hijo as HTMLElement).style.setProperty("--volt-delay", `${0.05 + i * 0.09}s`),
  );
}

export function StaggerGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRevelar<HTMLDivElement>(escalonar);
  return (
    <div ref={ref} className={`volt-stagger ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`volt-stagger-item ${className}`}>{children}</div>;
}
