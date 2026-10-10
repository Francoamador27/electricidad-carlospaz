import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactBanner from "@/components/sections/ContactBanner";
import FotoImg from "@/components/ui/FotoImg";
import Contenido from "@/components/ui/Contenido";
import { textoPlano } from "@/lib/contenido-html";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import VerProyecto from "@/components/tracking/VerProyecto";
import {
  fotoPrincipal,
  formatoFecha,
  getProyectosConRelaciones,
  paramsOVacio,
} from "@/lib/contenido";
import { srcFoto } from "@/lib/fotos";

export const dynamicParams = false;

export async function generateStaticParams() {
  return paramsOVacio(await getProyectosConRelaciones());
}

async function buscar(slug: string) {
  return (await getProyectosConRelaciones()).find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await buscar((await params).slug);
  if (!p) return {};
  const titulo = p.zona ? `${p.titulo} en ${p.zona.nombre}` : p.titulo;
  const foto = fotoPrincipal(p);
  return metaPagina({
    titulo,
    descripcion: textoPlano(p.descripcion),
    ruta: `/proyectos/${p.slug}`,
    imagen: foto ? { url: srcFoto(foto), alt: foto.alt } : undefined,
    noIndexar: p.estado === "borrador",
  });
}

const ETIQUETA = { antes: "Antes", despues: "Después", general: "" } as const;

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await buscar((await params).slug);
  if (!p) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { nombre: "Proyectos", url: "/proyectos" },
          { nombre: p.titulo, url: `/proyectos/${p.slug}` },
        ]}
      />
      <VerProyecto proyecto={p.slug} servicio={p.servicio?.slug} zona={p.zona?.slug} />

      <section className="bg-slate-900 text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {p.estado === "borrador" && (
            <p className="mb-4 inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
              BORRADOR — solo visible en desarrollo
            </p>
          )}
          <div className="text-sm text-slate-400 mb-4">
            <Link href="/proyectos" className="hover:text-amber-400 transition-colors">
              Proyectos
            </Link>
            {p.zona && (
              <>
                {" / "}
                <span className="text-amber-400">{p.zona.nombre}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{p.titulo}</h1>
          {p.fechaTrabajo && (
            <p className="text-slate-400 text-sm">{formatoFecha(p.fechaTrabajo)}</p>
          )}
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {p.fotos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {p.fotos.map((f, i) => (
                <figure key={f.key} className={i === 0 && p.fotos.length % 2 ? "sm:col-span-2" : ""}>
                  <FotoImg
                    foto={f}
                    prioridad={i === 0}
                    sizes="(min-width: 896px) 864px, 100vw"
                    className="w-full h-auto rounded-xl"
                  />
                  {ETIQUETA[f.tipo] && (
                    <figcaption className="text-sm text-slate-500 mt-2">{ETIQUETA[f.tipo]}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          <Contenido texto={p.descripcion} />

          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            {p.servicio && (
              <Link
                href={`/servicios/${p.servicio.slug}`}
                className="text-amber-700 font-semibold hover:underline"
              >
                Servicio: {p.servicio.nombre} →
              </Link>
            )}
            {p.zona && (
              <Link href={`/zonas/${p.zona.slug}`} className="text-amber-700 font-semibold hover:underline">
                Electricista en {p.zona.nombre} →
              </Link>
            )}
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
