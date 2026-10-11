// Notificaciones (suscripciones Web Push) y calendario .ics: rutas del panel + el .ics público.
import { Hono } from "hono";
import { desc, eq, getDb, schema, sql } from "@voltis/db";
import { suscripcionPushInput } from "@voltis/shared";
import { sumarDias, hoyLocal, aIso } from "@voltis/shared/agenda";
import type { Env } from "../env";
import { borrarSuscripcion, enviarPush, pushConfigurado } from "../lib/push";
import { generarIcs } from "../lib/ics";

type App = { Bindings: Env; Variables: { usuario: string } };

// ---------- Panel (con sesión): /admin/api/push y /admin/api/calendario ----------

export const avisos = new Hono<App>();

avisos.get("/push/clave", (c) =>
  c.json({ configurado: pushConfigurado(c.env), clavePublica: c.env.VAPID_PUBLIC_KEY ?? null }),
);

avisos.post("/push/suscribir", async (c) => {
  const parsed = suscripcionPushInput.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  const { endpoint, keys, dispositivo } = parsed.data;
  const db = getDb(c.env.DATABASE_URL);
  await db
    .insert(schema.suscripcionesPush)
    .values({ endpoint, p256dh: keys.p256dh, auth: keys.auth, dispositivo: dispositivo ?? null })
    .onConflictDoUpdate({
      target: schema.suscripcionesPush.endpoint,
      set: { p256dh: keys.p256dh, auth: keys.auth, dispositivo: dispositivo ?? null },
    });
  return c.json({ ok: true }, 201);
});

avisos.get("/push/dispositivos", async (c) => {
  const db = getDb(c.env.DATABASE_URL);
  const filas = await db
    .select({
      id: schema.suscripcionesPush.id,
      endpoint: schema.suscripcionesPush.endpoint,
      dispositivo: schema.suscripcionesPush.dispositivo,
      createdAt: schema.suscripcionesPush.createdAt,
      ultimoEnvioAt: schema.suscripcionesPush.ultimoEnvioAt,
    })
    .from(schema.suscripcionesPush)
    .orderBy(desc(schema.suscripcionesPush.createdAt));
  return c.json(filas);
});

avisos.delete("/push/dispositivos/:id{[0-9]+}", async (c) => {
  await borrarSuscripcion(c.env, Number(c.req.param("id")));
  return c.body(null, 204);
});

avisos.post("/push/probar", async (c) => {
  if (!pushConfigurado(c.env)) return c.json({ ok: false, error: "push_no_configurado" }, 503);
  const r = await enviarPush(c.env, {
    titulo: "Voltis",
    cuerpo: "¡Listo! Las notificaciones funcionan en este dispositivo.",
    url: "/admin/agenda",
    etiqueta: "prueba",
  });
  return c.json({ ok: true, ...r });
});

// Dirección secreta del calendario. Se crea la primera vez que se pide.
async function tokenCalendario(env: Env, regenerar = false): Promise<string> {
  const db = getDb(env.DATABASE_URL);
  if (!regenerar) {
    const [fila] = await db.select().from(schema.config).where(eq(schema.config.clave, "ics_token"));
    if (fila) return fila.valor;
  }
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  await db
    .insert(schema.config)
    .values({ clave: "ics_token", valor: token })
    .onConflictDoUpdate({ target: schema.config.clave, set: { valor: token, updatedAt: new Date() } });
  return token;
}

// Siempre https fuera de la compu (el Calendario del iPhone no acepta http).
function urlCalendario(origen: string, token: string) {
  const u = new URL(origen);
  if (u.hostname !== "localhost" && u.hostname !== "127.0.0.1") u.protocol = "https:";
  return `${u.origin}/api/agenda.ics?t=${token}`;
}

avisos.get("/calendario", async (c) => {
  const origen = new URL(c.req.url).origin;
  return c.json({ url: urlCalendario(origen, await tokenCalendario(c.env)) });
});

avisos.post("/calendario/regenerar", async (c) => {
  const origen = new URL(c.req.url).origin;
  return c.json({ url: urlCalendario(origen, await tokenCalendario(c.env, true)) });
});

// ---------- Público con token: /api/agenda.ics?t=... ----------

export const calendarioPublico = new Hono<{ Bindings: Env }>();

calendarioPublico.get("/", async (c) => {
  const token = c.req.query("t") ?? "";
  const db = getDb(c.env.DATABASE_URL);
  const [fila] = await db.select().from(schema.config).where(eq(schema.config.clave, "ics_token"));
  // Comparación sobre hashes del mismo largo: no da pistas por tiempo de respuesta.
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(token)),
    crypto.subtle.digest("SHA-256", enc.encode(fila?.valor ?? "\u0000sin-token")),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let dif = fila && token ? 0 : 1;
  for (let i = 0; i < x.length; i++) dif |= x[i] ^ y[i];
  if (dif !== 0) return c.notFound();

  const desde = sumarDias(hoyLocal(), -60);
  const hasta = sumarDias(hoyLocal(), 400);
  const t = schema.trabajos;
  const filas = await db
    .select({
      id: t.id,
      titulo: t.titulo,
      clienteNombre: t.clienteNombre,
      clienteTelefono: t.clienteTelefono,
      direccion: t.direccion,
      localidad: sql<string | null>`coalesce(${schema.zonas.nombre}, ${t.localidadOtra})`,
      descripcion: t.descripcion,
      quienVa: t.quienVa,
      servicio: schema.servicios.nombre,
      inicio: t.inicio,
      fin: t.fin,
      todoElDia: t.todoElDia,
      estado: t.estado,
      recordatorioMin: t.recordatorioMin,
      lat: t.lat,
      lng: t.lng,
      actualizado: t.updatedAt,
    })
    .from(t)
    .leftJoin(schema.servicios, eq(schema.servicios.id, t.servicioId))
    .leftJoin(schema.zonas, eq(schema.zonas.id, t.zonaId))
    .where(sql`${t.fin} > ${aIso(desde)}::timestamptz and ${t.inicio} < ${aIso(hasta)}::timestamptz`)
    .limit(3000);

  const origen = new URL(c.req.url);
  const ics = generarIcs(filas, { dominio: origen.hostname, urlPanel: origen.origin });
  return c.body(ics, 200, {
    "Content-Type": "text/calendar; charset=utf-8",
    "Cache-Control": "private, max-age=300",
    "Content-Disposition": 'inline; filename="voltis-agenda.ics"',
  });
});
