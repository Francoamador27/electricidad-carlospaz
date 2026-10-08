// Lectura de contenido desde Neon. Corre solo en el servidor: durante `next build`
// (export estático) y en `next dev`.
import { cache } from "react";
import { and, asc, desc, eq, getDb, inArray, schema } from "@voltis/db";
import type { ConfigSitio } from "@voltis/shared";

const db = getDb(process.env.DATABASE_URL!);

// En desarrollo se ven también los borradores, para revisarlos antes de publicar.
const MOSTRAR_BORRADORES = process.env.NODE_ENV === "development";
const visibles = MOSTRAR_BORRADORES
  ? (["borrador", "publicado"] as const)
  : (["publicado"] as const);

export type Post = typeof schema.posts.$inferSelect;
export type Proyecto = typeof schema.proyectos.$inferSelect;
export type Zona = typeof schema.zonas.$inferSelect;
export type Resena = typeof schema.resenas.$inferSelect;
export type Servicio = typeof schema.servicios.$inferSelect;

export const getServicios = cache(() =>
  db.select().from(schema.servicios).orderBy(asc(schema.servicios.orden)),
);

export const getPosts = cache(() =>
  db
    .select()
    .from(schema.posts)
    .where(inArray(schema.posts.estado, visibles))
    .orderBy(desc(schema.posts.publicadoAt)),
);

export const getPost = cache(async (slug: string) => {
  const [post] = await db
    .select()
    .from(schema.posts)
    .where(and(eq(schema.posts.slug, slug), inArray(schema.posts.estado, visibles)));
  return post;
});

export const getZonas = cache(() =>
  db
    .select()
    .from(schema.zonas)
    .where(inArray(schema.zonas.estado, visibles))
    .orderBy(asc(schema.zonas.orden)),
);

export const getZona = cache(async (slug: string) => {
  const [zona] = await db
    .select()
    .from(schema.zonas)
    .where(and(eq(schema.zonas.slug, slug), inArray(schema.zonas.estado, visibles)));
  return zona;
});

export const getProyectos = cache(() =>
  db
    .select()
    .from(schema.proyectos)
    .where(inArray(schema.proyectos.estado, visibles))
    .orderBy(desc(schema.proyectos.fechaTrabajo), desc(schema.proyectos.id)),
);

export const getProyecto = cache(async (slug: string) => {
  const [proyecto] = await db
    .select()
    .from(schema.proyectos)
    .where(and(eq(schema.proyectos.slug, slug), inArray(schema.proyectos.estado, visibles)));
  return proyecto;
});

export const getResenas = cache(() =>
  db
    .select()
    .from(schema.resenas)
    .where(inArray(schema.resenas.estado, visibles))
    .orderBy(desc(schema.resenas.createdAt)),
);

export function formatoFecha(fecha: Date | string | null): string {
  if (!fecha) return "";
  const d = typeof fecha === "string" ? new Date(`${fecha}T12:00:00-03:00`) : fecha;
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Cordoba",
  });
}

// generateStaticParams no puede devolver [] con output: "export". Mientras no haya
// contenido publicado se genera una página centinela que responde notFound().
export const SLUG_VACIO = "_vacio";
export function paramsOVacio<T extends { slug: string }>(filas: T[]) {
  return filas.length ? filas.map((f) => ({ slug: f.slug })) : [{ slug: SLUG_VACIO }];
}

// Proyectos con el nombre de su servicio y su zona (si la zona es visible).
export const getProyectosConRelaciones = cache(async () => {
  const [proyectos, servicios, zonas] = await Promise.all([
    getProyectos(),
    getServicios(),
    getZonas(),
  ]);
  return proyectos.map((p) => ({
    ...p,
    servicio: servicios.find((s) => s.id === p.servicioId),
    zona: zonas.find((z) => z.id === p.zonaId),
  }));
});

export type ProyectoConRelaciones = Awaited<ReturnType<typeof getProyectosConRelaciones>>[number];

export function fotoPrincipal(p: Proyecto) {
  return p.fotos.find((f) => f.tipo === "despues") ?? p.fotos[0];
}

// Configuración del panel (GTM, verificaciones). Las variables de entorno sirven de respaldo.
export const getConfig = cache(async (): Promise<ConfigSitio> => {
  const filas = await db.select().from(schema.config);
  const valores = Object.fromEntries(filas.map((f) => [f.clave, f.valor])) as ConfigSitio;
  return {
    ...valores,
    gtm_id: valores.gtm_id ?? (process.env.NEXT_PUBLIC_GTM_ID || undefined),
  };
});
