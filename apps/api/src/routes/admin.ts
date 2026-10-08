import { Hono } from "hono";
import type { z } from "zod";
import { postInput, proyectoInput, resenaInput, zonaInput, ANCHOS_FOTO } from "@voltis/shared";
import { asc, desc, eq, getDb, schema, sql } from "@voltis/db";
import type { Env } from "../env";
import { requiereAccess } from "../lib/access";

type App = { Bindings: Env; Variables: { usuario: string } };

export const admin = new Hono<App>();
admin.use("*", requiereAccess);

// ---------- CRUD genérico ----------

type Tabla =
  | typeof schema.posts
  | typeof schema.proyectos
  | typeof schema.zonas
  | typeof schema.resenas;

function crud(tabla: Tabla, input: z.ZodType, orden: "reciente" | "orden" = "reciente") {
  const r = new Hono<App>();
  // drizzle no infiere bien sobre una unión de tablas: las operaciones son las mismas.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = tabla as any;

  // Al pasar a "publicado" por primera vez se fija la fecha de publicación.
  const conFecha = (datos: Record<string, unknown>, previo?: { publicadoAt?: Date | null }) =>
    "publicadoAt" in t && datos.estado === "publicado" && !previo?.publicadoAt
      ? { ...datos, publicadoAt: new Date() }
      : datos;

  r.get("/", async (c) => {
    const db = getDb(c.env.DATABASE_URL);
    const filas = await db
      .select()
      .from(t)
      .orderBy(orden === "orden" ? asc(t.orden) : desc(t.id));
    return c.json(filas);
  });

  r.get("/:id{[0-9]+}", async (c) => {
    const db = getDb(c.env.DATABASE_URL);
    const [fila] = await db.select().from(t).where(eq(t.id, Number(c.req.param("id"))));
    return fila ? c.json(fila) : c.json({ ok: false, error: "no_encontrado" }, 404);
  });

  r.post("/", async (c) => {
    const parsed = input.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
    const db = getDb(c.env.DATABASE_URL);
    try {
      const filas = (await db.insert(t).values(conFecha(parsed.data as Record<string, unknown>)).returning()) as unknown[];
      return c.json(filas[0], 201);
    } catch (e) {
      return errorDb(c, e);
    }
  });

  r.put("/:id{[0-9]+}", async (c) => {
    const parsed = input.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
    const db = getDb(c.env.DATABASE_URL);
    const id = Number(c.req.param("id"));
    const [previo] = await db.select().from(t).where(eq(t.id, id));
    if (!previo) return c.json({ ok: false, error: "no_encontrado" }, 404);
    try {
      const filas: unknown[] = await db
        .update(t)
        .set(conFecha(parsed.data as Record<string, unknown>, previo))
        .where(eq(t.id, id))
        .returning();
      return c.json(filas[0]);
    } catch (e) {
      return errorDb(c, e);
    }
  });

  r.delete("/:id{[0-9]+}", async (c) => {
    const db = getDb(c.env.DATABASE_URL);
    try {
      await db.delete(t).where(eq(t.id, Number(c.req.param("id"))));
      return c.body(null, 204);
    } catch (e) {
      return errorDb(c, e);
    }
  });

  return r;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorDb(c: any, e: unknown) {
  const causa = (e as { cause?: { code?: string } })?.cause ?? (e as { code?: string });
  if (causa?.code === "23505") return c.json({ ok: false, error: "slug_repetido" }, 409);
  if (causa?.code === "23503") return c.json({ ok: false, error: "en_uso" }, 409);
  throw e;
}

admin.route("/posts", crud(schema.posts, postInput));
admin.route("/proyectos", crud(schema.proyectos, proyectoInput));
admin.route("/zonas", crud(schema.zonas, zonaInput, "orden"));
admin.route("/resenas", crud(schema.resenas, resenaInput));

admin.get("/servicios", async (c) => {
  const db = getDb(c.env.DATABASE_URL);
  return c.json(await db.select().from(schema.servicios).orderBy(asc(schema.servicios.orden)));
});

admin.get("/yo", (c) => c.json({ usuario: c.get("usuario") }));

// ---------- Consultas (leads) ----------

admin.get("/consultas", async (c) => {
  const db = getDb(c.env.DATABASE_URL);
  const limite = Math.min(Number(c.req.query("limite") ?? 200), 1000);
  const filas = await db
    .select()
    .from(schema.consultas)
    .orderBy(desc(schema.consultas.createdAt))
    .limit(limite);
  return c.json(filas);
});

admin.delete("/consultas/:id{[0-9]+}", async (c) => {
  const db = getDb(c.env.DATABASE_URL);
  await db.delete(schema.consultas).where(eq(schema.consultas.id, Number(c.req.param("id"))));
  return c.body(null, 204);
});

// ---------- Estadísticas de conversiones ----------

const ORIGEN = sql`case
  when atribucion->>'gclid' is not null or atribucion->>'gbraid' is not null or atribucion->>'wbraid' is not null then 'Google Ads'
  when atribucion->>'utm_source' is not null then atribucion->>'utm_source'
  else 'Directo / orgánico' end`;

admin.get("/estadisticas", async (c) => {
  const dias = Math.min(Math.max(Number(c.req.query("dias") ?? 30), 1), 365);
  const db = getDb(c.env.DATABASE_URL);
  const desde = sql`now() - make_interval(days => ${dias})`;
  const dia = (col: string) =>
    sql.raw(`to_char(date_trunc('day', ${col} at time zone 'America/Argentina/Cordoba'), 'YYYY-MM-DD')`);

  const [porDia, porPagina, porOrigen, porZona, totales] = await Promise.all([
    db.execute(sql`
      select d, tipo, count(*)::int as n from (
        select ${dia("created_at")} as d, 'formulario' as tipo from consultas where created_at >= ${desde}
        union all
        select ${dia("created_at")} as d, tipo from eventos where created_at >= ${desde}
      ) x group by d, tipo order by d`),
    db.execute(sql`
      select pagina, count(*)::int as n from (
        select pagina_origen as pagina from consultas where created_at >= ${desde}
        union all
        select pagina from eventos where created_at >= ${desde}
      ) x where pagina is not null group by pagina order by n desc limit 10`),
    db.execute(sql`
      select origen, count(*)::int as n from (
        select ${ORIGEN} as origen from consultas where created_at >= ${desde}
        union all
        select ${ORIGEN} as origen from eventos where created_at >= ${desde}
      ) x group by origen order by n desc`),
    db.execute(sql`
      select coalesce(nullif(localidad, ''), 'Sin indicar') as zona, count(*)::int as n
      from consultas where created_at >= ${desde} group by 1 order by n desc limit 10`),
    db.execute(sql`
      select tipo, count(*)::int as n from (
        select 'formulario' as tipo from consultas where created_at >= ${desde}
        union all
        select tipo from eventos where created_at >= ${desde}
      ) x group by tipo`),
  ]);

  return c.json({
    dias,
    totales: Object.fromEntries(totales.rows.map((r) => [r.tipo, r.n])),
    porDia: porDia.rows,
    porPagina: porPagina.rows,
    porOrigen: porOrigen.rows,
    porZona: porZona.rows,
  });
});

// ---------- Fotos (R2) ----------

const MAX_BYTES = 5 * 1024 * 1024;

// Recibe las versiones ya redimensionadas en el navegador (campos w480, w960, ...).
admin.post("/uploads", async (c) => {
  const form = await c.req.formData();
  const carpeta = String(form.get("carpeta") ?? "general").replace(/[^a-z0-9-]/g, "") || "general";
  const key = `${carpeta}/${new Date().getFullYear()}/${crypto.randomUUID()}`;

  const anchos: number[] = [];
  let formato: "webp" | "jpeg" | undefined;
  for (const w of ANCHOS_FOTO) {
    const archivo = form.get(`w${w}`);
    if (!(archivo instanceof File)) continue;
    if (archivo.size > MAX_BYTES) return c.json({ ok: false, error: "archivo_grande" }, 413);
    const tipo = archivo.type === "image/webp" ? "webp" : archivo.type === "image/jpeg" ? "jpeg" : null;
    if (!tipo || (formato && formato !== tipo)) return c.json({ ok: false, error: "formato_invalido" }, 400);
    formato = tipo;
    await c.env.IMAGENES.put(`${key}-${w}.${tipo === "jpeg" ? "jpg" : "webp"}`, archivo.stream(), {
      httpMetadata: { contentType: archivo.type, cacheControl: "public, max-age=31536000, immutable" },
    });
    anchos.push(w);
  }
  if (!anchos.length) return c.json({ ok: false, error: "sin_archivos" }, 400);
  return c.json({ key, anchos, formato }, 201);
});

// ---------- Publicar ----------

admin.post("/publicar", async (c) => {
  if (!c.env.PAGES_DEPLOY_HOOK_URL) {
    return c.json({ ok: true, simulado: true, mensaje: "Sin deploy hook configurado (modo local)." });
  }
  const res = await fetch(c.env.PAGES_DEPLOY_HOOK_URL, { method: "POST" });
  return c.json({ ok: res.ok, estado: res.status }, res.ok ? 200 : 502);
});
