import { z } from "zod";
import { atribucionSchema } from "./consultas";

export const TIPOS_EVENTO = ["click_whatsapp", "click_telefono"] as const;

export const eventoSchema = z.object({
  tipo: z.enum(TIPOS_EVENTO),
  pagina: z.string().max(500).optional(),
  servicio: z.string().max(120).optional(),
  zona: z.string().max(120).optional(),
  atribucion: atribucionSchema.optional(),
});

export type Evento = z.infer<typeof eventoSchema>;
