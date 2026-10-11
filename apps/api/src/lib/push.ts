// Notificaciones en el celular (Web Push estándar, RFC 8291, con claves VAPID). Gratis y sin
// servicios externos: el Worker cifra el mensaje y lo entrega al servicio push del navegador
// (Apple para iPhone, Google para Android).
import { buildPushPayload } from "@block65/webcrypto-web-push";
import { eq, getDb, inArray, schema } from "@voltis/db";
import type { Env } from "../env";

export type MensajePush = {
  titulo: string;
  cuerpo: string;
  url: string; // ruta del panel que se abre al tocar la notificación
  etiqueta?: string; // reemplaza una notificación anterior con la misma etiqueta
};

export function pushConfigurado(env: Env): boolean {
  return Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);
}

// Envía a todos los dispositivos suscriptos. Los que ya no existen (404/410) se borran.
export async function enviarPush(env: Env, mensaje: MensajePush): Promise<{ enviados: number; fallidos: number }> {
  if (!pushConfigurado(env)) return { enviados: 0, fallidos: 0 };
  const db = getDb(env.DATABASE_URL);
  const subs = await db.select().from(schema.suscripcionesPush);
  const vapid = {
    subject: env.VAPID_SUBJECT || "mailto:avisos@proyectoswebsite.com",
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  };

  let enviados = 0;
  const vencidas: number[] = [];
  const ok: number[] = [];
  await Promise.all(
    subs.map(async (s) => {
      try {
        const pedido = await buildPushPayload(
          { data: mensaje, options: { ttl: 60 * 60 * 24, urgency: "high", ...(mensaje.etiqueta ? { topic: mensaje.etiqueta.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32) } : {}) } },
          { endpoint: s.endpoint, expirationTime: null, keys: { p256dh: s.p256dh, auth: s.auth } },
          vapid,
        );
        const res = await fetch(s.endpoint, pedido);
        if (res.status === 404 || res.status === 410) vencidas.push(s.id);
        else if (res.ok) {
          enviados++;
          ok.push(s.id);
        } else console.error("[push]", res.status, await res.text().catch(() => ""));
      } catch (e) {
        console.error("[push]", e);
      }
    }),
  );
  if (vencidas.length) await db.delete(schema.suscripcionesPush).where(inArray(schema.suscripcionesPush.id, vencidas));
  if (ok.length) {
    await db
      .update(schema.suscripcionesPush)
      .set({ ultimoEnvioAt: new Date() })
      .where(inArray(schema.suscripcionesPush.id, ok));
  }
  return { enviados, fallidos: subs.length - enviados - vencidas.length };
}

export async function borrarSuscripcion(env: Env, id: number): Promise<void> {
  await getDb(env.DATABASE_URL).delete(schema.suscripcionesPush).where(eq(schema.suscripcionesPush.id, id));
}
