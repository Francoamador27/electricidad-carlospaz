import { Hono } from "hono";
import { aIso, leerCoordenadasMaps, sumarDias } from "@voltis/shared/agenda";
import { gastoInput, pagoInput, trabajoInput } from "@voltis/shared";
import { and, asc, eq, getDb, schema, sql } from "@voltis/db";
import type { Env } from "../env";

type App = { Bindings: Env; Variables: { usuario: string } };

export const trabajos = new Hono<App>();

const t = schema.trabajos;

// Columnas que devuelve la agenda: el trabajo + nombres y totales cobrados/gastados.
const columnas = {
  id: t.id,
  titulo: t.titulo,
  servicioId: t.servicioId,
  servicio: schema.servicios.nombre,
  clienteNombre: t.clienteNombre,
  clienteTelefono: t.clienteTelefono,
  direccion: t.direccion,
  zonaId: t.zonaId,
  zona: schema.zonas.nombre,
  localidadOtra: t.localidadOtra,
  mapsUrl: t.mapsUrl,
  lat: t.lat,
  lng: t.lng,
  descripcion: t.descripcion,
  notas: t.notas,
  quienVa: t.quienVa,
  inicio: t.inicio,
  fin: t.fin,
  todoElDia: t.todoElDia,
  precioCentavos: t.precioCentavos,
  estado: t.estado,
  consultaId: t.consultaId,
  proyectoId: t.proyectoId,
  fotos: t.fotos,
  recordatorioMin: t.recordatorioMin,
  pagadoCentavos: sql<number>`coalesce((select sum(${schema.trabajoPagos.montoCentavos}) from ${schema.trabajoPagos} where ${schema.trabajoPagos.trabajoId} = ${t.id}), 0)::bigint`.mapWith(Number),
  gastadoCentavos: sql<number>`coalesce((select sum(${schema.trabajoGastos.montoCentavos}) from ${schema.trabajoGastos} where ${schema.trabajoGastos.trabajoId} = ${t.id}), 0)::bigint`.mapWith(Number),
};

const fechaValida = (f: string | undefined) => (f && /^\d{4}-\d{2}-\d{2}$/.test(f) ? f : null);

// Trabajos que se superponen con [desde, hasta] (fechas locales, ambas incluidas).
trabajos.get("/", async (c) => {
  const desde = fechaValida(c.req.query("desde"));
  const hasta = fechaValida(c.req.query("hasta"));
  if (!desde || !hasta || hasta < desde) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  const db = getDb(c.env.DATABASE_URL);
  const filas = await db
    .select(columnas)
    .from(t)
    .leftJoin(schema.servicios, eq(schema.servicios.id, t.servicioId))
    .leftJoin(schema.zonas, eq(schema.zonas.id, t.zonaId))
    .where(and(sql`${t.inicio} < ${aIso(sumarDias(hasta, 1))}::timestamptz`, sql`${t.fin} > ${aIso(desde)}::timestamptz`))
    .orderBy(asc(t.inicio))
    .limit(2000);
  return c.json(filas);
});

async function detalle(env: Env, id: number) {
  const db = getDb(env.DATABASE_URL);
  const [trabajo] = await db
    .select(columnas)
    .from(t)
    .leftJoin(schema.servicios, eq(schema.servicios.id, t.servicioId))
    .leftJoin(schema.zonas, eq(schema.zonas.id, t.zonaId))
    .where(eq(t.id, id));
  if (!trabajo) return null;
  const [pagos, gastos] = await Promise.all([
    db.select().from(schema.trabajoPagos).where(eq(schema.trabajoPagos.trabajoId, id)).orderBy(asc(schema.trabajoPagos.fecha), asc(schema.trabajoPagos.id)),
    db.select().from(schema.trabajoGastos).where(eq(schema.trabajoGastos.trabajoId, id)).orderBy(asc(schema.trabajoGastos.fecha), asc(schema.trabajoGastos.id)),
  ]);
  return { ...trabajo, pagos, gastos };
}

trabajos.get("/:id{[0-9]+}", async (c) => {
  const d = await detalle(c.env, Number(c.req.param("id")));
  return d ? c.json(d) : c.json({ ok: false, error: "no_encontrado" }, 404);
});

function aFila(datos: ReturnType<typeof trabajoInput.parse>) {
  return {
    ...datos,
    inicio: new Date(datos.inicio),
    fin: new Date(datos.fin),
    mapsUrl: datos.mapsUrl || null,
  };
}

trabajos.post("/", async (c) => {
  const parsed = trabajoInput.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
  const db = getDb(c.env.DATABASE_URL);
  const [fila] = await db.insert(t).values(aFila(parsed.data)).returning({ id: t.id });
  return c.json(await detalle(c.env, fila.id), 201);
});

trabajos.put("/:id{[0-9]+}", async (c) => {
  const parsed = trabajoInput.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
  const id = Number(c.req.param("id"));
  const db = getDb(c.env.DATABASE_URL);
  const [previo] = await db.select({ inicio: t.inicio, recordatorioMin: t.recordatorioMin }).from(t).where(eq(t.id, id));
  if (!previo) return c.json({ ok: false, error: "no_encontrado" }, 404);
  const nuevo = aFila(parsed.data);
  // Si cambia el horario o el aviso, el recordatorio se vuelve a enviar.
  const reprogramado =
    previo.inicio.getTime() !== nuevo.inicio.getTime() || previo.recordatorioMin !== (nuevo.recordatorioMin ?? null);
  await db
    .update(t)
    .set({ ...nuevo, ...(reprogramado ? { recordatorioEnviadoAt: null } : {}) })
    .where(eq(t.id, id));
  return c.json(await detalle(c.env, id));
});

// Cambio rápido de estado (desde el detalle: "Marcar terminado").
trabajos.patch("/:id{[0-9]+}/estado", async (c) => {
  const cuerpo = (await c.req.json().catch(() => null)) as { estado?: string } | null;
  const estados = ["agendado", "en_curso", "terminado", "cancelado"] as const;
  const estado = estados.find((e) => e === cuerpo?.estado);
  if (!estado) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  const id = Number(c.req.param("id"));
  await getDb(c.env.DATABASE_URL).update(t).set({ estado }).where(eq(t.id, id));
  const d = await detalle(c.env, id);
  return d ? c.json(d) : c.json({ ok: false, error: "no_encontrado" }, 404);
});

trabajos.delete("/:id{[0-9]+}", async (c) => {
  await getDb(c.env.DATABASE_URL).delete(t).where(eq(t.id, Number(c.req.param("id"))));
  return c.body(null, 204);
});

// ---------- Pagos y gastos ----------

trabajos.post("/:id{[0-9]+}/pagos", async (c) => {
  const parsed = pagoInput.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
  const id = Number(c.req.param("id"));
  const db = getDb(c.env.DATABASE_URL);
  const [existe] = await db.select({ id: t.id }).from(t).where(eq(t.id, id));
  if (!existe) return c.json({ ok: false, error: "no_encontrado" }, 404);
  await db.insert(schema.trabajoPagos).values({ ...parsed.data, trabajoId: id });
  return c.json(await detalle(c.env, id), 201);
});

trabajos.delete("/:id{[0-9]+}/pagos/:pago{[0-9]+}", async (c) => {
  const id = Number(c.req.param("id"));
  await getDb(c.env.DATABASE_URL)
    .delete(schema.trabajoPagos)
    .where(and(eq(schema.trabajoPagos.id, Number(c.req.param("pago"))), eq(schema.trabajoPagos.trabajoId, id)));
  return c.json(await detalle(c.env, id));
});

trabajos.post("/:id{[0-9]+}/gastos", async (c) => {
  const parsed = gastoInput.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ ok: false, error: "datos_invalidos", detalles: parsed.error.issues }, 400);
  const id = Number(c.req.param("id"));
  const db = getDb(c.env.DATABASE_URL);
  const [existe] = await db.select({ id: t.id }).from(t).where(eq(t.id, id));
  if (!existe) return c.json({ ok: false, error: "no_encontrado" }, 404);
  await db.insert(schema.trabajoGastos).values({ ...parsed.data, trabajoId: id });
  return c.json(await detalle(c.env, id), 201);
});

trabajos.delete("/:id{[0-9]+}/gastos/:gasto{[0-9]+}", async (c) => {
  const id = Number(c.req.param("id"));
  await getDb(c.env.DATABASE_URL)
    .delete(schema.trabajoGastos)
    .where(and(eq(schema.trabajoGastos.id, Number(c.req.param("gasto"))), eq(schema.trabajoGastos.trabajoId, id)));
  return c.json(await detalle(c.env, id));
});

// ---------- Trabajo terminado → proyecto del sitio (sin datos del cliente) ----------

const slugify = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

const escaparHtml = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);

trabajos.post("/:id{[0-9]+}/proyecto", async (c) => {
  const id = Number(c.req.param("id"));
  const d = await detalle(c.env, id);
  if (!d) return c.json({ ok: false, error: "no_encontrado" }, 404);
  if (d.proyectoId) return c.json({ ok: true, proyectoId: d.proyectoId });

  const db = getDb(c.env.DATABASE_URL);
  const lugar = d.zona ?? d.localidadOtra;
  const titulo = [d.servicio ?? d.titulo, lugar && `en ${lugar}`].filter(Boolean).join(" ");
  const descripcion = d.descripcion
    ? d.descripcion
        .split(/\n{2,}/)
        .map((p) => `<p>${escaparHtml(p).replace(/\n/g, "<br>")}</p>`)
        .join("")
    : "<p>Describí acá el trabajo realizado.</p>";
  const [proyecto] = await db
    .insert(schema.proyectos)
    .values({
      slug: `${slugify(titulo)}-${id}`,
      titulo,
      descripcion,
      servicioId: d.servicioId,
      zonaId: d.zonaId,
      fechaTrabajo: d.inicio.toISOString().slice(0, 10),
      fotos: d.fotos,
      destacado: false,
      estado: "borrador",
    })
    .returning({ id: schema.proyectos.id });
  await db.update(t).set({ proyectoId: proyecto.id }).where(eq(t.id, id));
  return c.json({ ok: true, proyectoId: proyecto.id }, 201);
});

// ---------- Links de Google Maps ----------

const HOSTS_MAPS = /^(maps\.app\.goo\.gl|goo\.gl|(www\.)?google\.[a-z.]+|maps\.google\.[a-z.]+)$/i;

// Los links cortos (maps.app.goo.gl/...) no traen coordenadas: se sigue la redirección
// (solo hacia dominios de Google, para no usar el Worker como proxy de cualquier sitio).
trabajos.post("/maps", async (c) => {
  const { url } = ((await c.req.json().catch(() => ({}))) ?? {}) as { url?: string };
  if (!url || url.length > 2000) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  let actual: URL;
  try {
    actual = new URL(url.trim());
  } catch {
    return c.json({ ok: false, error: "datos_invalidos" }, 400);
  }
  for (let i = 0; i < 5; i++) {
    if (actual.protocol !== "https:" || !HOSTS_MAPS.test(actual.hostname)) break;
    const coords = leerCoordenadasMaps(actual.toString());
    if (coords) return c.json({ ok: true, ...coords, url: actual.toString() });
    const res = await fetch(actual.toString(), { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0" } });
    const destino = res.headers.get("location");
    if (!destino) {
      // Algunas páginas traen las coordenadas en el HTML (meta og / center).
      const html = res.status === 200 ? (await res.text()).slice(0, 200_000) : "";
      const enHtml = leerCoordenadasMaps(html.match(/https:\/\/www\.google\.[^"' ]*@-?\d[^"' ]*/)?.[0] ?? "");
      if (enHtml) return c.json({ ok: true, ...enHtml, url: actual.toString() });
      break;
    }
    actual = new URL(destino, actual);
  }
  return c.json({ ok: false, error: "sin_coordenadas" }, 422);
});

