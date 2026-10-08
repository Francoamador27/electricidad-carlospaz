import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const estado = pgEnum("estado", ["borrador", "publicado"]);

export type Foto = {
  key: string;
  anchos: number[];
  ancho: number;
  alto: number;
  alt: string;
  tipo: "antes" | "despues" | "general";
  // Safari puede no generar WebP desde canvas: en ese caso se sube JPEG.
  formato?: "webp" | "jpeg";
};

const actualizado = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// Solo para relaciones: el contenido de cada servicio vive en apps/web.
export const servicios = pgTable("servicios", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  orden: integer("orden").notNull().default(0),
});

export const zonas = pgTable("zonas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  texto: text("texto").notNull(),
  seoTitulo: text("seo_titulo"),
  seoDescripcion: text("seo_descripcion"),
  estado: estado("estado").notNull().default("borrador"),
  orden: integer("orden").notNull().default(0),
  updatedAt: actualizado(),
});

export const proyectos = pgTable("proyectos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  servicioId: integer("servicio_id").references(() => servicios.id),
  zonaId: integer("zona_id").references(() => zonas.id),
  fechaTrabajo: date("fecha_trabajo"),
  fotos: jsonb("fotos").$type<Foto[]>().notNull().default([]),
  destacado: boolean("destacado").notNull().default(false),
  estado: estado("estado").notNull().default("borrador"),
  publicadoAt: timestamp("publicado_at", { withTimezone: true }),
  updatedAt: actualizado(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  extracto: text("extracto").notNull(),
  contenido: text("contenido").notNull(),
  categoria: text("categoria"),
  portada: jsonb("portada").$type<Foto>(),
  servicioId: integer("servicio_id").references(() => servicios.id),
  zonaId: integer("zona_id").references(() => zonas.id),
  seoTitulo: text("seo_titulo"),
  seoDescripcion: text("seo_descripcion"),
  estado: estado("estado").notNull().default("borrador"),
  publicadoAt: timestamp("publicado_at", { withTimezone: true }),
  updatedAt: actualizado(),
});

export const resenas = pgTable(
  "resenas",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    localidad: text("localidad"),
    servicio: text("servicio"),
    texto: text("texto").notNull(),
    estrellas: integer("estrellas").notNull(),
    fuente: text("fuente"),
    estado: estado("estado").notNull().default("borrador"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("estrellas_rango", sql`${t.estrellas} between 1 and 5`)],
);

export const consultas = pgTable("consultas", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  email: text("email"),
  localidad: text("localidad"),
  servicio: text("servicio"),
  tipoPropiedad: text("tipo_propiedad"),
  urgencia: text("urgencia"),
  mensaje: text("mensaje"),
  paginaOrigen: text("pagina_origen"),
  atribucion: jsonb("atribucion").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Clics en CTA (WhatsApp, teléfono). Los formularios quedan en `consultas`.
export const eventos = pgTable(
  "eventos",
  {
    id: serial("id").primaryKey(),
    tipo: text("tipo").notNull(),
    pagina: text("pagina"),
    servicio: text("servicio"),
    zona: text("zona"),
    atribucion: jsonb("atribucion").$type<Record<string, string>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("eventos_created_at_idx").on(t.createdAt)],
);

// Configuración editable desde el panel (IDs de GTM, códigos de verificación).
export const config = pgTable("config", {
  clave: text("clave").primaryKey(),
  valor: text("valor").notNull(),
  updatedAt: actualizado(),
});
