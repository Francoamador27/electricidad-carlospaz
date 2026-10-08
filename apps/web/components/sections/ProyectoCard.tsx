import Link from "next/link";
import FotoImg from "@/components/ui/FotoImg";
import { fotoPrincipal, type ProyectoConRelaciones } from "@/lib/contenido";

export default function ProyectoCard({ p, sizes }: { p: ProyectoConRelaciones; sizes: string }) {
  const foto = fotoPrincipal(p);
  return (
    <article className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group bg-white">
      <Link href={`/proyectos/${p.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100">
        {foto && (
          <FotoImg
            foto={foto}
            sizes={sizes}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {p.servicio && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {p.servicio.nombre}
            </span>
          )}
          {p.zona && <span className="text-xs text-slate-400">📍 {p.zona.nombre}</span>}
          {p.estado === "borrador" && (
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">BORRADOR</span>
          )}
        </div>
        <h3 className="font-bold text-slate-900 mb-2 leading-snug">
          <Link href={`/proyectos/${p.slug}`} className="hover:text-amber-600 transition-colors">
            {p.titulo}
          </Link>
        </h3>
      </div>
    </article>
  );
}
