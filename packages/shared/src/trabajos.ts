// Validación de lo que el panel envía para agenda, pagos, gastos y notificaciones.
import { z } from "zod";
import { fotoSchema } from "./admin";

const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null)
    .nullable()
    .optional();

// ISO con desfase horario: "2026-10-16T09:00:00-03:00".
const instante = z.iso.datetime({ offset: true });
const centavos = z.number().int().min(0).max(1_000_000_000_00);

export const trabajoInput = z
  .object({
    titulo: z.string().trim().min(2).max(160),
    servicioId: z.number().int().positive().nullable().optional(),
    clienteNombre: z.string().trim().min(2).max(160),
    clienteTelefono: textoOpcional(40),
    direccion: textoOpcional(250),
    zonaId: z.number().int().positive().nullable().optional(),
    localidadOtra: textoOpcional(120),
    mapsUrl: z.union([z.literal(""), z.url().max(2000)]).nullable().optional(),
    lat: z.number().min(-90).max(90).nullable().optional(),
    lng: z.number().min(-180).max(180).nullable().optional(),
    descripcion: textoOpcional(5000),
    notas: textoOpcional(5000),
    quienVa: textoOpcional(80),
    inicio: instante,
    fin: instante,
    todoElDia: z.boolean(),
    precioCentavos: centavos.nullable().optional(),
    estado: z.enum(["agendado", "en_curso", "terminado", "cancelado"]),
    consultaId: z.number().int().positive().nullable().optional(),
    fotos: z.array(fotoSchema).max(20),
    recordatorioMin: z.number().int().min(0).max(10080).nullable().optional(),
  })
  .refine((t) => new Date(t.fin) >= new Date(t.inicio), { message: "El fin no puede ser antes del inicio", path: ["fin"] })
  .refine((t) => new Date(t.fin).getTime() - new Date(t.inicio).getTime() <= 366 * 86400000, {
    message: "Un trabajo no puede durar más de un año",
    path: ["fin"],
  });

export const pagoInput = z.object({
  fecha: z.iso.date(),
  montoCentavos: centavos.positive(),
  medio: z.enum(["efectivo", "transferencia", "mercadopago", "otro"]),
  nota: textoOpcional(300),
});

export const gastoInput = z.object({
  fecha: z.iso.date(),
  descripcion: z.string().trim().min(2).max(200),
  montoCentavos: centavos.positive(),
});

export const suscripcionPushInput = z.object({
  endpoint: z.url().max(2000),
  keys: z.object({ p256dh: z.string().min(10).max(300), auth: z.string().min(5).max(100) }),
  dispositivo: z.string().max(120).optional(),
});

export type TrabajoInput = z.infer<typeof trabajoInput>;
export type PagoInput = z.infer<typeof pagoInput>;
export type GastoInput = z.infer<typeof gastoInput>;
