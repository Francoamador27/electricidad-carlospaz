// Login del panel: usuario y contraseña (secretos del Worker) + Turnstile, con bloqueo por
// intentos fallidos y sesión en cookie firmada. Falla cerrado: sin configuración, nadie entra.
import { SignJWT, jwtVerify } from "jose";
import { getCookie } from "hono/cookie";
import type { Context, MiddlewareHandler } from "hono";
import type { Env } from "../env";

export const COOKIE_SESION = "voltis_sesion";
export const DURACION_SESION = 60 * 60 * 24 * 30; // 30 días
const MIN_LARGO_PASSWORD = 12;

type App = { Bindings: Env; Variables: { usuario: string } };

export function authConfigurada(env: Env): "ok" | "falta" | "debil" {
  if (!env.ADMIN_USUARIO || !env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) return "falta";
  if (env.ADMIN_PASSWORD.length < MIN_LARGO_PASSWORD || env.ADMIN_SESSION_SECRET.length < 32) return "debil";
  return "ok";
}

const enc = new TextEncoder();

async function sha256(texto: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", enc.encode(texto));
}

// Compara en tiempo constante (sobre los hash, que siempre miden lo mismo).
export async function igualSeguro(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diferencia = 0;
  for (let i = 0; i < x.length; i++) diferencia |= x[i] ^ y[i];
  return diferencia === 0;
}

// La clave de firma depende también de la contraseña: si la cambiás, todas las sesiones
// abiertas dejan de valer.
async function claveSesion(env: Env): Promise<Uint8Array> {
  return new Uint8Array(await sha256(`${env.ADMIN_SESSION_SECRET}\n${env.ADMIN_PASSWORD}`));
}

export async function crearSesion(env: Env, usuario: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(usuario)
    .setIssuedAt()
    .setExpirationTime(`${DURACION_SESION}s`)
    .sign(await claveSesion(env));
}

export async function leerSesion(env: Env, token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await claveSesion(env), { algorithms: ["HS256"] });
    return payload.sub && payload.sub === env.ADMIN_USUARIO ? payload.sub : null;
  } catch {
    return null;
  }
}

export function ipDe(c: Context): string {
  return c.req.header("CF-Connecting-IP") ?? "local";
}

// Protege /admin/api/*: sesión válida y, en pedidos que modifican, origen permitido (CSRF).
export const requiereSesion: MiddlewareHandler<App> = async (c, next) => {
  if (c.req.path.startsWith("/admin/api/auth/")) return next();

  if (c.req.method !== "GET") {
    const origen = c.req.header("Origin");
    const permitidos = c.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    if (origen && !permitidos.includes(origen)) return c.json({ ok: false, error: "origen_no_permitido" }, 403);
  }

  if (c.env.ADMIN_SIN_AUTH === "1") {
    c.set("usuario", "local");
    return next();
  }
  if (authConfigurada(c.env) !== "ok") return c.json({ ok: false, error: "auth_no_configurado" }, 503);

  const usuario = await leerSesion(c.env, getCookie(c, COOKIE_SESION));
  if (!usuario) return c.json({ ok: false, error: "no_autorizado" }, 401);
  c.set("usuario", usuario);
  return next();
};
