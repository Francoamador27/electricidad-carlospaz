import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://www.voltis.com.ar";

const blogPosts: Array<{ slug: string; lastModified: Date }> = [
  { slug: "como-saber-si-necesito-actualizar-tablero-electrico", lastModified: new Date("2025-06-01") },
  { slug: "seguridad-electrica-hogar-carlos-paz",                lastModified: new Date("2025-05-15") },
  { slug: "iluminacion-led-ahorro-energia-punilla",              lastModified: new Date("2025-04-20") },
  { slug: "instalacion-electrica-obra-nueva-carlos-paz",         lastModified: new Date("2025-03-10") },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Páginas principales ──────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/presupuesto`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.85,
    },

    // ── Servicios ────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/servicios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios/instalaciones-domiciliarias`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/servicios/instalaciones-empresariales`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/servicios/tableros-electricos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/servicios/reparaciones-electricas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/servicios/mantenimiento-electricidad`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/servicios/iluminacion-automatizacion`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ── Proyectos y empresa ──────────────────────────────────────────
    {
      url: `${BASE_URL}/proyectos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },

    // ── Blog ─────────────────────────────────────────────────────────
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
