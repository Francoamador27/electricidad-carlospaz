// Tareas que corren solas cada 15 minutos (Cron Trigger del Worker, gratis):
// - Recordatorio antes de cada trabajo (según "Avisarme" del trabajo).
// - Resumen del día a las 7:00 de Córdoba.
import { eq, getDb, schema, sql } from "@voltis/db";
import { aIso, hoyLocal, horaLocal, sumarDias } from "@voltis/shared/agenda";
import type { Env } from "../env";
import { enviarPush, pushConfigurado } from "./push";

const HORA_RESUMEN = 7;

function lugar(zona: string | null, otra: string | null) {
  return zona ?? otra ?? "";
}

export async function recordatorios(env: Env, ahora = new Date()): Promise<number> {
  const db = getDb(env.DATABASE_URL);
  const t = schema.trabajos;
  const pendientes = await db
    .select({
      id: t.id,
      titulo: t.titulo,
      clienteNombre: t.clienteNombre,
      inicio: t.inicio,
      direccion: t.direccion,
      zona: schema.zonas.nombre,
      localidadOtra: t.localidadOtra,
    })
    .from(t)
    .leftJoin(schema.zonas, eq(schema.zonas.id, t.zonaId))
    .where(
      sql`${t.todoElDia} = false
        and ${t.estado} in ('agendado', 'en_curso')
        and ${t.recordatorioMin} is not null and ${t.recordatorioMin} > 0
        and ${t.recordatorioEnviadoAt} is null
        and ${t.inicio} > ${ahora.toISOString()}::timestamptz
        and ${t.inicio} - make_interval(mins => ${t.recordatorioMin}) <= ${ahora.toISOString()}::timestamptz`,
    );

  for (const p of pendientes) {
    const donde = [p.direccion, lugar(p.zona, p.localidadOtra)].filter(Boolean).join(", ");
    await enviarPush(env, {
      titulo: `${horaLocal(p.inicio)} · ${p.titulo}`,
      cuerpo: [p.clienteNombre, donde].filter(Boolean).join(" — "),
      url: `/admin/agenda?trabajo=${p.id}`,
      etiqueta: `trabajo${p.id}`,
    });
    await db.update(t).set({ recordatorioEnviadoAt: ahora }).where(eq(t.id, p.id));
  }
  return pendientes.length;
}

export async function resumenDelDia(env: Env, ahora = new Date()): Promise<boolean> {
  if (Number(horaLocal(ahora).slice(0, 2)) !== HORA_RESUMEN) return false;
  const hoy = hoyLocal();
  const db = getDb(env.DATABASE_URL);

  // Una sola vez por día, aunque el cron corra varias veces en esa hora.
  const [ya] = await db.select().from(schema.config).where(eq(schema.config.clave, "resumen_ultimo"));
  if (ya?.valor === hoy) return false;
  await db
    .insert(schema.config)
    .values({ clave: "resumen_ultimo", valor: hoy })
    .onConflictDoUpdate({ target: schema.config.clave, set: { valor: hoy, updatedAt: new Date() } });

  const t = schema.trabajos;
  const deHoy = await db
    .select({
      titulo: t.titulo,
      clienteNombre: t.clienteNombre,
      inicio: t.inicio,
      todoElDia: t.todoElDia,
      zona: schema.zonas.nombre,
      localidadOtra: t.localidadOtra,
    })
    .from(t)
    .leftJoin(schema.zonas, eq(schema.zonas.id, t.zonaId))
    .where(
      sql`${t.estado} in ('agendado', 'en_curso')
        and ${t.inicio} < ${aIso(sumarDias(hoy, 1))}::timestamptz
        and ${t.fin} > ${aIso(hoy)}::timestamptz`,
    )
    .orderBy(t.inicio);
  if (!deHoy.length) return false;

  const lineas = deHoy.slice(0, 6).map((j) => {
    const cuando = j.todoElDia ? "Todo el día" : horaLocal(j.inicio);
    return `${cuando} ${j.clienteNombre}${lugar(j.zona, j.localidadOtra) ? `, ${lugar(j.zona, j.localidadOtra)}` : ""}`;
  });
  await enviarPush(env, {
    titulo: `Hoy: ${deHoy.length} ${deHoy.length === 1 ? "trabajo" : "trabajos"}`,
    cuerpo: lineas.join(" · ") + (deHoy.length > 6 ? " · …" : ""),
    url: "/admin/agenda",
    etiqueta: "resumen",
  });
  return true;
}

export async function tareasProgramadas(env: Env): Promise<void> {
  if (!pushConfigurado(env)) return;
  await Promise.all([
    recordatorios(env).catch((e) => console.error("[recordatorios]", e)),
    resumenDelDia(env).catch((e) => console.error("[resumen]", e)),
  ]);
}
