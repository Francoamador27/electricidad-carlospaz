import { Hono } from "hono";
import { consultaSchema } from "@voltis/shared";
import { getDb, schema } from "../db";
import type { Env } from "../env";
import { verificarTurnstile } from "../lib/turnstile";
import { enviarAviso } from "../lib/aviso";

export const consultas = new Hono<{ Bindings: Env }>();

consultas.post("/", async (c) => {
  const json = await c.req.json().catch(() => null);
  const parsed = consultaSchema.safeParse(json);
  if (!parsed.success) {
    return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
  }
  const data = parsed.data;

  // Honeypot completado: respondemos OK para no darle pistas al bot.
  if (data.empresa) return c.json({ ok: true }, 201);

  if (c.env.TURNSTILE_SECRET) {
    const valido = await verificarTurnstile(
      c.env.TURNSTILE_SECRET,
      data.turnstileToken,
      c.req.header("CF-Connecting-IP") ?? null,
    );
    if (!valido) return c.json({ ok: false, error: "turnstile" }, 403);
  }

  const db = getDb(c.env.DATABASE_URL);
  const [fila] = await db
    .insert(schema.consultas)
    .values({
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email || null,
      localidad: data.localidad,
      servicio: data.servicio,
      tipoPropiedad: data.tipoPropiedad,
      urgencia: data.urgencia,
      mensaje: data.mensaje,
      paginaOrigen: data.paginaOrigen,
      atribucion: data.atribucion,
    })
    .returning({ id: schema.consultas.id });

  c.executionCtx.waitUntil(enviarAviso(c.env, data).catch((e) => console.error("[aviso]", e)));

  return c.json({ ok: true, id: fila.id }, 201);
});
