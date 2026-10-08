import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { consultas } from "./routes/consultas";
import { eventos } from "./routes/eventos";
import { admin } from "./routes/admin";
import { servirFoto } from "./lib/fotos";

const app = new Hono<{ Bindings: Env }>();

// En producción todo vive en el mismo dominio; CORS solo hace falta en desarrollo.
app.use("*", async (c, next) => {
  const permitidos = c.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  return cors({
    origin: (origin) => (permitidos.includes(origin) ? origin : null),
    credentials: true,
  })(c, next);
});

app.get("/api/health", (c) => c.json({ ok: true }));
app.route("/api/consultas", consultas);
app.route("/api/eventos", eventos);
app.route("/admin/api", admin);

// Fotos subidas desde el panel (Vercel Blob, con caché de Cloudflare).
app.get("/img/:key{.+}", (c) => servirFoto(c.env, c.executionCtx, c.req.url, c.req.param("key")));

app.onError((err, c) => {
  console.error(err);
  return c.json({ ok: false, error: "interno" }, 500);
});

export default app;
