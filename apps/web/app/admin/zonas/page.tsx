"use client";

import Link from "next/link";
import { Cargando, Estado, MensajeError, Titulo } from "@/components/admin/ui";
import { useLista } from "@/components/admin/useEditor";

type Fila = { id: number; nombre: string; slug: string; estado: string };

export default function ZonasAdmin() {
  const { filas, error } = useLista<Fila>("zonas");
  const pendientes = filas?.filter((z) => z.estado === "borrador").length ?? 0;
  return (
    <div className="max-w-5xl">
      <Titulo accion={{ href: "/admin/zonas/editar", label: "+ Nueva localidad" }}>Zonas</Titulo>
      <MensajeError texto={error} />
      {!filas && !error && <Cargando />}
      {pendientes > 0 && (
        <p className="mb-4 rounded border border-amber-300 bg-amber-50 text-amber-900 text-sm px-4 py-3">
          {pendientes} localidades en borrador. Revisá que cada texto sea correcto antes de publicarlo: Google
          penaliza páginas de zona genéricas o con datos falsos.
        </p>
      )}
      <ul className="space-y-2">
        {filas?.map((z) => (
          <li key={z.id}>
            <Link
              href={`/admin/zonas/editar?id=${z.id}`}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-3 hover:border-amber-400"
            >
              <span className="flex-1 font-medium">📍 {z.nombre}</span>
              <span className="text-xs text-slate-500">/zonas/{z.slug}</span>
              <Estado estado={z.estado} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
