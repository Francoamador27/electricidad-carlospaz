import Link from "next/link";
import ProyectoCard from "@/components/sections/ProyectoCard";
import { getProyectosConRelaciones } from "@/lib/contenido";

export default async function FeaturedProjects() {
  const todos = await getProyectosConRelaciones();
  const destacados = todos.filter((p) => p.destacado);
  const proyectos = (destacados.length ? destacados : todos).slice(0, 3);
  if (!proyectos.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
            Trabajos realizados
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Proyectos eléctricos en Carlos Paz y Punilla
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Conocé algunos de los trabajos que realizamos en la región. Instalaciones domiciliarias,
            comerciales e industriales con garantía en toda la zona de Punilla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proyectos.map((p) => (
            <ProyectoCard key={p.id} p={p} sizes="(min-width: 768px) 33vw, 100vw" />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Ver todos los proyectos →
          </Link>
        </div>
      </div>
    </section>
  );
}
