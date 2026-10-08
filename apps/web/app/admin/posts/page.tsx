"use client";

import Link from "next/link";
import { Cargando, Estado, MensajeError, Titulo } from "@/components/admin/ui";
import { useLista } from "@/components/admin/useEditor";

type Fila = { id: number; titulo: string; slug: string; estado: string; categoria: string | null; publicadoAt: string | null };

export default function PostsAdmin() {
  const { filas, error } = useLista<Fila>("posts");
  return (
    <div className="max-w-5xl">
      <Titulo accion={{ href: "/admin/posts/editar", label: "+ Nuevo artículo" }}>Blog</Titulo>
      <MensajeError texto={error} />
      {!filas && !error && <Cargando />}
      <ul className="space-y-2">
        {filas?.map((p) => (
          <li key={p.id}>
            <Link
              href={`/admin/posts/editar?id=${p.id}`}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-3 hover:border-amber-400"
            >
              <span className="flex-1 min-w-0">
                <span className="block font-medium truncate">{p.titulo}</span>
                <span className="block text-xs text-slate-500">
                  {p.categoria ?? "Sin categoría"}
                  {p.publicadoAt && ` · ${new Date(p.publicadoAt).toLocaleDateString("es-AR")}`}
                </span>
              </span>
              <Estado estado={p.estado} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
