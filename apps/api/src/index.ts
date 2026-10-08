import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { consultas } from "./routes/consultas";
import { eventos } from "./routes/eventos";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", async (c, next) => {
  const permitidos = c.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  return cors({ origin: (origin) => (permitidos.includes(origin) ? origin : null) })(c, next);
});

app.get("/api/health", (c) => c.json({ ok: true }));
app.route("/api/consultas", consultas);
app.route("/api/eventos", eventos);

app.onError((err, c) => {
  console.error(err);
  return c.json({ ok: false, error: "interno" }, 500);
});

export default app;
