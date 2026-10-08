import { z } from "zod";

export const atribucionSchema = z
  .object({
    utm_source: z.string().max(200),
    utm_medium: z.string().max(200),
    utm_campaign: z.string().max(200),
    utm_term: z.string().max(200),
    utm_content: z.string().max(200),
    gclid: z.string().max(500),
    gbraid: z.string().max(500),
    wbraid: z.string().max(500),
  })
  .partial();

export const consultaSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(6).max(40),
  email: z.union([z.literal(""), z.email().max(200)]).optional(),
  localidad: z.string().trim().max(120).optional(),
  servicio: z.string().trim().max(120).optional(),
  tipoPropiedad: z.enum(["residential", "commercial", "industrial"]).optional(),
  urgencia: z.enum(["normal", "urgent", "emergency"]).optional(),
  mensaje: z.string().trim().max(4000).optional(),
  paginaOrigen: z.string().max(500).optional(),
  atribucion: atribucionSchema.optional(),
  // Honeypot: un humano lo deja vacío.
  empresa: z.string().max(0).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type Consulta = z.infer<typeof consultaSchema>;
