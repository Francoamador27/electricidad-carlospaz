import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { and, eq, getDb, gte, schema, sql } from "@voltis/db";
import type { Env } from "../env";
import { verificarTurnstile } from "../lib/turnstile";
import {
  COOKIE_SESION,
  DURACION_SESION,
  authConfigurada,
  crearSesion,
  igualSeguro,
  ipDe,
} from "../lib/sesion";

export const auth = new Hono<{ Bindings: Env }>();

const MAX_FALLOS_IP = 5; // por IP cada 15 minutos
const MAX_FALLOS_TOTAL = 30; // de cualquier IP por hora: freno ante ataques distribuidos

const loginSchema = z.object({
  usuario: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(200),
  turnstileToken: z.string().max(4096).optional(),
});

auth.post("/login", async (c) => {
  const estado = authConfigurada(c.env);
  if (estado !== "ok") return c.json({ ok: false, error: estado === "debil" ? "password_debil" : "auth_no_configurado" }, 503);

  const parsed = loginSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  const { usuario, password, turnstileToken } = parsed.data;
  const ip = ipDe(c);
  const db = getDb(c.env.DATABASE_URL);

  const [{ porIp, total }] = await db
    .select({
      porIp: sql<number>`count(*) filter (where ${schema.adminIntentos.ip} = ${ip} and ${schema.adminIntentos.createdAt} >= now() - interval '15 minutes')::int`,
      total: sql<number>`count(*)::int`,
    })
    .from(schema.adminIntentos)
    .where(and(eq(schema.adminIntentos.exito, false), gte(schema.adminIntentos.createdAt, sql`now() - interval '1 hour'`)));
  if (porIp >= MAX_FALLOS_IP || total >= MAX_FALLOS_TOTAL) {
    return c.json({ ok: false, error: "bloqueado" }, 429);
  }

  if (c.env.TURNSTILE_SECRET) {
    const humano = await verificarTurnstile(c.env.TURNSTILE_SECRET, turnstileToken, ip);
    if (!humano) return c.json({ ok: false, error: "turnstile" }, 403);
  }

  const [usuarioOk, passwordOk] = await Promise.all([
    igualSeguro(usuario.toLowerCase(), c.env.ADMIN_USUARIO!.toLowerCase()),
    igualSeguro(password, c.env.ADMIN_PASSWORD!),
  ]);
  const exito = usuarioOk && passwordOk;
  await db.insert(schema.adminIntentos).values({ ip, usuario: usuario.slice(0, 120), exito });

  if (!exito) return c.json({ ok: false, error: "credenciales" }, 401);

  setCookie(c, COOKIE_SESION, await crearSesion(c.env, c.env.ADMIN_USUARIO!), {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/admin/api",
    maxAge: DURACION_SESION,
  });
  return c.json({ ok: true, usuario: c.env.ADMIN_USUARIO });
});

auth.post("/salir", (c) => {
  deleteCookie(c, COOKIE_SESION, { path: "/admin/api", secure: true });
  return c.json({ ok: true });
});
