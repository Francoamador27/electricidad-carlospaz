import { Hono } from "hono";
import { eventoSchema } from "@voltis/shared";
import { getDb, schema } from "@voltis/db";
import type { Env } from "../env";

export const eventos = new Hono<{ Bindings: Env }>();

// Llega por navigator.sendBeacon (text/plain, sin preflight): parseamos el texto.
eventos.post("/", async (c) => {
  const texto = await c.req.text();
  let json: unknown;
  try {
    json = JSON.parse(texto);
  } catch {
    return c.body(null, 400);
  }
  const parsed = eventoSchema.safeParse(json);
  if (!parsed.success) return c.body(null, 400);

  const db = getDb(c.env.DATABASE_URL);
  c.executionCtx.waitUntil(
    db
      .insert(schema.eventos)
      .values(parsed.data)
      .then(() => undefined)
      .catch((e) => console.error("[eventos]", e)),
  );
  return c.body(null, 204);
});
