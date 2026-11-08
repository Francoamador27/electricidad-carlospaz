import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICIOS } from "@voltis/shared/negocio";
import LandingServicio from "@/components/sections/LandingServicio";
import ServicioJsonLd from "@/components/seo/ServicioJsonLd";
import { metaPagina } from "@/lib/seo";
import { CONTENIDO_SERVICIOS } from "@/lib/servicios";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ slug: s.slug }));
}

function buscar(slug: string) {
  const servicio = SERVICIOS.find((s) => s.slug === slug);
  return servicio ? { servicio, contenido: CONTENIDO_SERVICIOS[servicio.slug] } : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = buscar(slug);
  if (!item) return {};
  return metaPagina({
    titulo: item.contenido.titulo,
    descripcion: item.contenido.descripcion,
    ruta: `/servicios/${slug}`,
  });
}

export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = buscar((await params).slug);
  if (!item) notFound();
  const { servicio, contenido } = item;

  return (
    <>
      <ServicioJsonLd slug={servicio.slug} faq={contenido.faq} />
      <LandingServicio
        etiqueta={contenido.etiqueta}
        h1={contenido.h1}
        intro={contenido.intro}
        mensaje={servicio.whatsapp}
        incluye={contenido.incluye}
        detalleTitulo={contenido.detalleTitulo}
        detalle={contenido.detalle}
        faq={contenido.faq}
        cierre={contenido.cierre}
      />
    </>
  );
}
