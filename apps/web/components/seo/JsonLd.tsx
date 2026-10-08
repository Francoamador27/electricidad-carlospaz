import { SITE_URL } from "@/lib/site";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { nombre: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ nombre: "Inicio", url: "/" }, ...items].map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.nombre,
          item: `${SITE_URL}${it.url === "/" ? "" : it.url}`,
        })),
      }}
    />
  );
}
