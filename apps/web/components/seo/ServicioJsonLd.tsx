import { LOCALIDADES, SERVICIOS } from "@voltis/shared";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";

type Slug = (typeof SERVICIOS)[number]["slug"];

export default function ServicioJsonLd({ slug }: { slug: Slug }) {
  const servicio = SERVICIOS.find((s) => s.slug === slug)!;
  const url = `/servicios/${slug}`;
  return (
    <>
      <Breadcrumbs
        items={[
          { nombre: "Servicios", url: "/servicios" },
          { nombre: servicio.nombre, url },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: servicio.nombre,
          serviceType: servicio.nombre,
          url: `${SITE_URL}${url}`,
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: LOCALIDADES.map((l) => ({ "@type": "City", name: l.nombre })),
        }}
      />
    </>
  );
}
