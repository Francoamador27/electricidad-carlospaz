"use client";

import Link from "next/link";
import { IconoChevron, SECCIONES_MAS, usePanel } from "@/components/admin/AdminShell";

export default function MasPage() {
  const { usuario, salir } = usePanel();

  return (
    <div className="max-w-xl">
      <h1 className="ios-titulo-grande mb-6">Más</h1>

      <div className="ios-lista mb-8">
        {SECCIONES_MAS.map(({ href, label, Icono }) => (
          <Link key={href} href={href} className="ios-fila">
            <span className="w-8 h-8 rounded-lg grid place-items-center bg-[var(--ios-acento)] text-[var(--ios-acento-texto)]">
              <Icono className="w-5 h-5" />
            </span>
            <span className="flex-1">{label}</span>
            <IconoChevron className="w-4 h-4 ios-secundario" />
          </Link>
        ))}
      </div>

      <div className="ios-lista">
        <a href="/" target="_blank" className="ios-fila">
          <span className="flex-1">Ver sitio</span>
          <span className="ios-secundario">↗</span>
        </a>
        {usuario !== "local" && (
          <button type="button" onClick={salir} className="ios-fila w-full text-left text-[var(--ios-rojo)]">
            Salir ({usuario})
          </button>
        )}
      </div>
    </div>
  );
}
