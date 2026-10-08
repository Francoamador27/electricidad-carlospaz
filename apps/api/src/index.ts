import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { consultas } from "./routes/consultas";
import { eventos } from "./routes/eventos";
import { admin } from "./routes/admin";

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

// Fotos subidas desde el panel. En producción se sirven por el dominio propio de R2.
app.get("/img/:key{.+}", async (c) => {
  const objeto = await c.env.IMAGENES.get(c.req.param("key"));
  if (!objeto) return c.notFound();
  const headers = new Headers();
  objeto.writeHttpMetadata(headers);
  headers.set("etag", objeto.httpEtag);
  return new Response(objeto.body, { headers });
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ ok: false, error: "interno" }, 500);
});

export default app;
