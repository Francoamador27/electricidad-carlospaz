// Schemas de lo que el panel envía a /admin/api.
import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones");

const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null)
    .nullable()
    .optional();

export const estadoSchema = z.enum(["borrador", "publicado"]);

export const fotoSchema = z.object({
  key: z.string().min(1).max(300),
  anchos: z.array(z.number().int().positive()).max(6),
  ancho: z.number().int().positive(),
  alto: z.number().int().positive(),
  alt: z.string().trim().min(3).max(200),
  tipo: z.enum(["antes", "despues", "general"]),
  formato: z.enum(["webp", "jpeg"]).optional(),
});

export const postInput = z.object({
  slug,
  titulo: z.string().trim().min(5).max(200),
  extracto: z.string().trim().min(10).max(400),
  contenido: z.string().min(20).max(60000),
  categoria: textoOpcional(60),
  portada: fotoSchema.nullable().optional(),
  servicioId: z.number().int().positive().nullable().optional(),
  zonaId: z.number().int().positive().nullable().optional(),
  seoTitulo: textoOpcional(70),
  seoDescripcion: textoOpcional(170),
  estado: estadoSchema,
});

export const proyectoInput = z.object({
  slug,
  titulo: z.string().trim().min(5).max(200),
  descripcion: z.string().min(10).max(20000),
  servicioId: z.number().int().positive().nullable().optional(),
  zonaId: z.number().int().positive().nullable().optional(),
  fechaTrabajo: z.iso.date().nullable().optional(),
  fotos: z.array(fotoSchema).max(20),
  destacado: z.boolean(),
  estado: estadoSchema,
});

export const zonaInput = z.object({
  slug,
  nombre: z.string().trim().min(2).max(120),
  texto: z.string().min(20).max(20000),
  seoTitulo: textoOpcional(70),
  seoDescripcion: textoOpcional(170),
  estado: estadoSchema,
  orden: z.number().int().min(0).max(1000),
});

export const resenaInput = z.object({
  nombre: z.string().trim().min(2).max(80),
  localidad: textoOpcional(120),
  servicio: textoOpcional(120),
  texto: z.string().trim().min(10).max(1500),
  estrellas: z.number().int().min(1).max(5),
  fuente: textoOpcional(40),
  estado: estadoSchema,
});

export type PostInput = z.infer<typeof postInput>;
export type ProyectoInput = z.infer<typeof proyectoInput>;
export type ZonaInput = z.infer<typeof zonaInput>;
export type ResenaInput = z.infer<typeof resenaInput>;
export type FotoInput = z.infer<typeof fotoSchema>;

export const ANCHOS_FOTO = [480, 960, 1600] as const;
