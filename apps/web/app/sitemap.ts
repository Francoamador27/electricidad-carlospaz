import type { MetadataRoute } from "next";
import { SERVICIOS } from "@voltis/shared";
import { SITE_URL } from "@/lib/site";
import { getPosts, getProyectos, getZonas } from "@/lib/contenido";

export const dynamic = "force-static";

type Entrada = MetadataRoute.Sitemap[number];

function url(path: string, extra: Omit<Entrada, "url"> = {}): Entrada {
  return { url: `${SITE_URL}${path}`, ...extra };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, proyectos, zonas] = await Promise.all([getPosts(), getProyectos(), getZonas()]);
  const publicados = <T extends { estado: string }>(filas: T[]) =>
    filas.filter((f) => f.estado === "publicado");

  const masReciente = (filas: { updatedAt: Date }[]) =>
    filas.reduce<Date | undefined>((max, f) => (!max || f.updatedAt > max ? f.updatedAt : max), undefined);
  const ultimoPost = masReciente(publicados(posts));
  const ultimoProyecto = masReciente(publicados(proyectos));

  return [
    url("", { changeFrequency: "monthly", priority: 1 }),
    url("/presupuesto", { changeFrequency: "yearly", priority: 0.95 }),
    url("/contacto", { changeFrequency: "yearly", priority: 0.85 }),
    url("/servicios", { changeFrequency: "monthly", priority: 0.9 }),
    ...SERVICIOS.map((s) => url(`/servicios/${s.slug}`, { changeFrequency: "monthly", priority: 0.85 })),
    url("/zonas", { changeFrequency: "monthly", priority: 0.8 }),
    ...publicados(zonas).map((z) =>
      url(`/zonas/${z.slug}`, { lastModified: z.updatedAt, changeFrequency: "monthly", priority: 0.8 }),
    ),
    url("/proyectos", { lastModified: ultimoProyecto, changeFrequency: "weekly", priority: 0.75 }),
    ...publicados(proyectos).map((p) =>
      url(`/proyectos/${p.slug}`, { lastModified: p.updatedAt, changeFrequency: "yearly", priority: 0.6 }),
    ),
    url("/about", { changeFrequency: "yearly", priority: 0.7 }),
    url("/blog", { lastModified: ultimoPost, changeFrequency: "weekly", priority: 0.65 }),
    ...publicados(posts).map((p) =>
      url(`/blog/${p.slug}`, { lastModified: p.updatedAt, changeFrequency: "yearly", priority: 0.6 }),
    ),
    url("/certificado-instalacion-electrica-apta", { changeFrequency: "yearly", priority: 0.85 }),
    url("/politica-de-privacidad", { changeFrequency: "yearly", priority: 0.2 }),
  ];
}
