"use client";

import Link from "next/link";
import type { FotoInput } from "@voltis/shared";
import { Cargando, Estado, MensajeError, Titulo } from "@/components/admin/ui";
import { useLista } from "@/components/admin/useEditor";
import { srcFoto } from "@/lib/fotos";

type Fila = { id: number; titulo: string; slug: string; estado: string; destacado: boolean; fotos: FotoInput[]; fechaTrabajo: string | null };

export default function ProyectosAdmin() {
  const { filas, error } = useLista<Fila>("proyectos");
  return (
    <div className="max-w-5xl">
      <Titulo accion={{ href: "/admin/proyectos/editar", label: "+ Nuevo proyecto" }}>Proyectos</Titulo>
      <MensajeError texto={error} />
      {!filas && !error && <Cargando />}
      {filas?.length === 0 && (
        <p className="text-slate-600">Todavía no cargaste proyectos. Sumá el primero con fotos de un trabajo real.</p>
      )}
      <ul className="space-y-2">
        {filas?.map((p) => (
          <li key={p.id}>
            <Link
              href={`/admin/proyectos/editar?id=${p.id}`}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-3 hover:border-amber-400"
            >
              {p.fotos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={srcFoto(p.fotos[0], p.fotos[0].anchos[0])} alt="" className="w-20 h-14 object-cover rounded bg-slate-100" />
              ) : (
                <span className="w-20 h-14 rounded bg-slate-100 grid place-items-center text-xs text-slate-400">Sin foto</span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block font-medium truncate">{p.titulo}</span>
                <span className="block text-xs text-slate-500">/proyectos/{p.slug}</span>
              </span>
              {p.destacado && <span className="text-xs text-amber-700">★ Destacado</span>}
              <Estado estado={p.estado} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
