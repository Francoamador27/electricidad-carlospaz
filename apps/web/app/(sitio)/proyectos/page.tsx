import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Link from "next/link";
import ContactBanner from "@/components/sections/ContactBanner";
import ProyectoCard from "@/components/sections/ProyectoCard";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getProyectosConRelaciones } from "@/lib/contenido";

export const metadata: Metadata = metaPagina({
  titulo: "Proyectos eléctricos realizados en Carlos Paz y Punilla",
  descripcion:
    "Proyectos de instalaciones eléctricas realizados en Carlos Paz y Punilla, Córdoba. Trabajos en viviendas, locales comerciales, oficinas e industrias.",
  ruta: "/proyectos",
});

export default async function ProjectsPage() {
  const proyectos = await getProyectosConRelaciones();

  return (
    <>
      <Breadcrumbs items={[{ nombre: "Proyectos", url: "/proyectos" }]} />
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Proyectos realizados
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Trabajos eléctricos en Carlos Paz y Punilla
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Algunos de los proyectos eléctricos que realizamos en Carlos Paz, Punilla y la región
            de Córdoba. Instalaciones domiciliarias, comerciales, industriales y más.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {proyectos.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {proyectos.map((p) => (
                <ProyectoCard
                  key={p.id}
                  p={p}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-8">
              <p className="text-slate-700 text-lg mb-6">
                Estamos sumando fotos de nuestros últimos trabajos. Mientras tanto, contanos qué
                necesitás y te pasamos un presupuesto sin cargo.
              </p>
              <Link
                href="/presupuesto"
                className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors"
              >
                Pedir presupuesto
              </Link>
            </div>
          )}
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
