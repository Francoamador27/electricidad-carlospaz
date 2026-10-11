"use client";

import Link from "next/link";
import type { ErrorApi } from "@/lib/admin-api";

// Campos estilo iOS: relleno gris suave, esquinas redondeadas y 16 px de texto (con menos,
// Safari del iPhone hace zoom al tocar el campo).
export const claseInput =
  "w-full rounded-[10px] px-3 py-2.5 text-base md:text-sm bg-[var(--ios-relleno)] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ios-acento)]";

export function Campo({
  label,
  ayuda,
  error,
  children,
}: {
  label: string;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium ios-secundario mb-1 px-1">{label}</span>
      {children}
      {ayuda && !error && <span className="block text-xs text-slate-500 mt-1">{ayuda}</span>}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}

// Mensaje de zod para un campo (path[0]).
export function errorDe(e: ErrorApi | null, campo: string): string | undefined {
  return e?.detalles?.find((d) => d.path[0] === campo)?.message;
}

export function Boton({
  variante = "primario",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "primario" | "secundario" | "peligro" }) {
  const estilos = {
    primario: "bg-[var(--ios-acento)] text-[var(--ios-acento-texto)] active:opacity-70",
    secundario: "bg-[var(--ios-relleno)] text-[var(--ios-acento)] active:opacity-70",
    peligro: "bg-[var(--ios-relleno)] text-[var(--ios-rojo)] active:opacity-70",
  }[variante];
  return (
    <button
      {...props}
      className={`font-semibold text-[15px] rounded-xl px-4 min-h-11 disabled:opacity-50 ${estilos} ${props.className ?? ""}`}
    />
  );
}

export function Titulo({ children, accion }: { children: React.ReactNode; accion?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 className="ios-titulo-grande">{children}</h1>
      {accion && (
        <Link href={accion.href} className="ios-boton text-[15px]">
          {accion.label}
        </Link>
      )}
    </div>
  );
}

export function Estado({ estado }: { estado: string }) {
  return estado === "publicado" ? (
    <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-green-100 text-green-800">Publicado</span>
  ) : (
    <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-slate-200 text-slate-700">Borrador</span>
  );
}

export function Cargando() {
  return <p className="text-slate-500 text-sm">Cargando...</p>;
}

export function MensajeError({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return <p role="alert" className="rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm px-4 py-3 mb-4">{texto}</p>;
}

export function Tarjeta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`ios-card p-4 md:p-5 ${className}`}>{children}</section>;
}
