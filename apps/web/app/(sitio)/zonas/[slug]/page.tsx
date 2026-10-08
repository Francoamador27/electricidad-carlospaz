import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactBanner from "@/components/sections/ContactBanner";
import ProyectoCard from "@/components/sections/ProyectoCard";
import Contenido from "@/components/ui/Contenido";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import {
  getProyectosConRelaciones,
  getServicios,
  getZona,
  getZonas,
  paramsOVacio,
} from "@/lib/contenido";
import { LINK_TELEFONO, NEGOCIO, linkWhatsapp } from "@voltis/shared";

export const dynamicParams = false;

export async function generateStaticParams() {
  return paramsOVacio(await getZonas());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const zona = await getZona((await params).slug);
  if (!zona) return {};
  return {
    title: zona.seoTitulo ?? `Electricista en ${zona.nombre}`,
    description: zona.seoDescripcion ?? undefined,
    alternates: { canonical: `/zonas/${zona.slug}` },
    robots: zona.estado === "borrador" ? { index: false } : undefined,
  };
}

export default async function ZonaPage({ params }: { params: Promise<{ slug: string }> }) {
  const zona = await getZona((await params).slug);
  if (!zona) notFound();

  const [proyectos, servicios] = await Promise.all([getProyectosConRelaciones(), getServicios()]);
  const proyectosZona = proyectos.filter((p) => p.zonaId === zona.id);

  return (
    <>
      <Breadcrumbs
        items={[
          { nombre: "Zonas", url: "/zonas" },
          { nombre: zona.nombre, url: `/zonas/${zona.slug}` },
        ]}
      />

      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {zona.estado === "borrador" && (
            <p className="mb-4 inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
              BORRADOR — solo visible en desarrollo
            </p>
          )}
          <div className="text-sm text-slate-400 mb-4">
            <Link href="/zonas" className="hover:text-amber-400 transition-colors">
              Zonas
            </Link>{" "}
            / <span className="text-amber-400">{zona.nombre}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Electricista en {zona.nombre}</h1>
          <div className="flex flex-wrap gap-3">
            <a
              href={linkWhatsapp(`Hola, necesito un electricista en ${zona.nombre}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors"
            >
              💬 Escribir por WhatsApp
            </a>
            <a
              href={LINK_TELEFONO}
              className="border border-slate-600 text-white font-bold px-6 py-3 rounded-lg hover:border-amber-400 transition-colors"
            >
              ☎ {NEGOCIO.telefonoVisible}
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Contenido texto={zona.texto} />

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
            Servicios en {zona.nombre}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {servicios.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/servicios/${s.slug}`}
                  className="block border border-slate-200 rounded-lg px-4 py-3 text-slate-800 hover:border-amber-400 transition-colors"
                >
                  {s.nombre} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {proyectosZona.length > 0 && (
        <section className="py-14 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Trabajos realizados en {zona.nombre}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {proyectosZona.map((p) => (
                <ProyectoCard key={p.id} p={p} sizes="(min-width: 768px) 33vw, 100vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBanner />
    </>
  );
}
