"use client";

import Link from "next/link";
import type { ErrorApi } from "@/lib/admin-api";

export const claseInput =
  "w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400";

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
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
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
    primario: "bg-amber-500 hover:bg-amber-400 text-slate-900",
    secundario: "bg-white border border-slate-300 hover:bg-slate-50 text-slate-800",
    peligro: "bg-white border border-red-300 text-red-700 hover:bg-red-50",
  }[variante];
  return (
    <button
      {...props}
      className={`font-semibold text-sm rounded px-4 py-2 disabled:opacity-60 ${estilos} ${props.className ?? ""}`}
    />
  );
}

export function Titulo({ children, accion }: { children: React.ReactNode; accion?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 className="text-2xl font-bold">{children}</h1>
      {accion && (
        <Link href={accion.href} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded px-4 py-2">
          {accion.label}
        </Link>
      )}
    </div>
  );
}

export function Estado({ estado }: { estado: string }) {
  return estado === "publicado" ? (
    <span className="text-xs font-semibold rounded px-2 py-0.5 bg-green-100 text-green-800">Publicado</span>
  ) : (
    <span className="text-xs font-semibold rounded px-2 py-0.5 bg-slate-200 text-slate-700">Borrador</span>
  );
}

export function Cargando() {
  return <p className="text-slate-500 text-sm">Cargando...</p>;
}

export function MensajeError({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return <p className="rounded border border-red-300 bg-red-50 text-red-800 text-sm px-4 py-3 mb-4">{texto}</p>;
}

export function Tarjeta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-white rounded-lg border border-slate-200 p-5 ${className}`}>{children}</section>;
}
