import { createRemoteJWKSet, jwtVerify } from "jose";
import type { MiddlewareHandler } from "hono";
import type { Env } from "../env";

const jwks = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

// Valida el JWT que Cloudflare Access agrega a cada request del panel.
// Falla cerrado: sin configuración de Access, el panel no responde (salvo en local).
export const requiereAccess: MiddlewareHandler<{ Bindings: Env; Variables: { usuario: string } }> = async (
  c,
  next,
) => {
  if (c.env.ADMIN_SIN_AUTH === "1") {
    c.set("usuario", "local");
    return next();
  }
  const { ACCESS_TEAM_DOMAIN: dominio, ACCESS_AUD: aud } = c.env;
  if (!dominio || !aud) return c.json({ ok: false, error: "access_no_configurado" }, 503);

  const token = c.req.header("Cf-Access-Jwt-Assertion");
  if (!token) return c.json({ ok: false, error: "no_autorizado" }, 401);

  let set = jwks.get(dominio);
  if (!set) {
    set = createRemoteJWKSet(new URL(`https://${dominio}/cdn-cgi/access/certs`));
    jwks.set(dominio, set);
  }
  try {
    const { payload } = await jwtVerify(token, set, { issuer: `https://${dominio}`, audience: aud });
    c.set("usuario", String(payload.email ?? payload.sub));
  } catch {
    return c.json({ ok: false, error: "no_autorizado" }, 401);
  }
  return next();
};
