import { Hono } from "hono";
import { aIso, sumarDias } from "@voltis/shared/agenda";
import { getDb, sql } from "@voltis/db";
import type { Env } from "../env";

type App = { Bindings: Env; Variables: { usuario: string } };

export const finanzas = new Hono<App>();

const fechaValida = (f: string | undefined) => (f && /^\d{4}-\d{2}-\d{2}$/.test(f) ? f : null);
const n = (v: unknown) => Number(v ?? 0);

function rango(c: { req: { query: (k: string) => string | undefined } }) {
  const desde = fechaValida(c.req.query("desde"));
  const hasta = fechaValida(c.req.query("hasta"));
  if (!desde || !hasta || hasta < desde) return null;
  return { desde, hasta };
}

// Los ingresos se cuentan por FECHA DE PAGO (lo que realmente entró), no por fecha del trabajo.
finanzas.get("/", async (c) => {
  const r = rango(c);
  if (!r) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  const { desde, hasta } = r;
  // Período anterior de la misma duración, para comparar.
  const dias = Math.round((Date.parse(hasta) - Date.parse(desde)) / 86400000) + 1;
  const prevHasta = sumarDias(desde, -1);
  const prevDesde = sumarDias(prevHasta, -(dias - 1));
  const db = getDb(c.env.DATABASE_URL);

  const [totales, previo, porCobrar, terminados, porTipo, porZona, porMes, medios, embudo, pendientes] =
    await Promise.all([
      db.execute(sql`
        select
          (select coalesce(sum(monto_centavos), 0) from trabajo_pagos where fecha between ${desde} and ${hasta}) as cobrado,
          (select coalesce(sum(monto_centavos), 0) from trabajo_gastos where fecha between ${desde} and ${hasta}) as gastos,
          (select count(distinct trabajo_id) from trabajo_pagos where fecha between ${desde} and ${hasta}) as trabajos_cobrados`),
      db.execute(sql`
        select
          (select coalesce(sum(monto_centavos), 0) from trabajo_pagos where fecha between ${prevDesde} and ${prevHasta}) as cobrado,
          (select coalesce(sum(monto_centavos), 0) from trabajo_gastos where fecha between ${prevDesde} and ${prevHasta}) as gastos`),
      // Lo que falta cobrar hoy, de todos los trabajos no cancelados (no depende del período).
      db.execute(sql`
        select coalesce(sum(greatest(t.precio_centavos - coalesce(p.pagado, 0), 0)), 0) as por_cobrar
        from trabajos t
        left join (select trabajo_id, sum(monto_centavos) as pagado from trabajo_pagos group by trabajo_id) p on p.trabajo_id = t.id
        where t.estado <> 'cancelado' and t.precio_centavos is not null`),
      db.execute(sql`
        select count(*) as terminados from trabajos
        where estado = 'terminado' and fin > ${aIso(desde)}::timestamptz and fin <= ${aIso(sumarDias(hasta, 1))}::timestamptz`),
      db.execute(sql`
        select coalesce(s.nombre, 'Sin tipo') as tipo,
               sum(p.monto_centavos) as cobrado,
               count(distinct p.trabajo_id) as trabajos
        from trabajo_pagos p
        join trabajos t on t.id = p.trabajo_id
        left join servicios s on s.id = t.servicio_id
        where p.fecha between ${desde} and ${hasta}
        group by 1 order by cobrado desc`),
      db.execute(sql`
        select coalesce(z.nombre, nullif(t.localidad_otra, ''), 'Sin localidad') as zona,
               sum(p.monto_centavos) as cobrado,
               count(distinct p.trabajo_id) as trabajos
        from trabajo_pagos p
        join trabajos t on t.id = p.trabajo_id
        left join zonas z on z.id = t.zona_id
        where p.fecha between ${desde} and ${hasta}
        group by 1 order by cobrado desc limit 15`),
      // Últimos 12 meses (hasta el fin del período elegido), independiente del filtro.
      db.execute(sql`
        with meses as (
          select to_char(m, 'YYYY-MM') as mes
          from generate_series(date_trunc('month', ${hasta}::date) - interval '11 months', date_trunc('month', ${hasta}::date), interval '1 month') m
        )
        select meses.mes,
          coalesce((select sum(monto_centavos) from trabajo_pagos where to_char(fecha, 'YYYY-MM') = meses.mes), 0) as cobrado,
          coalesce((select sum(monto_centavos) from trabajo_gastos where to_char(fecha, 'YYYY-MM') = meses.mes), 0) as gastos
        from meses order by meses.mes`),
      db.execute(sql`
        select medio, sum(monto_centavos) as cobrado, count(*) as pagos
        from trabajo_pagos where fecha between ${desde} and ${hasta}
        group by medio order by cobrado desc`),
      db.execute(sql`
        select
          (select count(*) from consultas where created_at >= ${aIso(desde)}::timestamptz and created_at < ${aIso(sumarDias(hasta, 1))}::timestamptz) as consultas,
          (select count(*) from trabajos where consulta_id is not null and created_at >= ${aIso(desde)}::timestamptz and created_at < ${aIso(sumarDias(hasta, 1))}::timestamptz) as agendados,
          (select count(*) from trabajos where consulta_id is not null and estado = 'terminado' and created_at >= ${aIso(desde)}::timestamptz and created_at < ${aIso(sumarDias(hasta, 1))}::timestamptz) as terminados`),
      db.execute(sql`
        select t.id, t.titulo, t.cliente_nombre, t.cliente_telefono, t.inicio, t.estado,
               t.precio_centavos, coalesce(p.pagado, 0) as pagado
        from trabajos t
        left join (select trabajo_id, sum(monto_centavos) as pagado from trabajo_pagos group by trabajo_id) p on p.trabajo_id = t.id
        where t.estado <> 'cancelado' and t.precio_centavos is not null and t.precio_centavos > coalesce(p.pagado, 0)
        order by t.inicio asc limit 50`),
    ]);

  const tot = totales.rows[0] ?? {};
  const prev = previo.rows[0] ?? {};
  const cobrado = n(tot.cobrado);
  const gastos = n(tot.gastos);
  const trabajosCobrados = n(tot.trabajos_cobrados);

  return c.json({
    desde,
    hasta,
    previo: { desde: prevDesde, hasta: prevHasta, cobrado: n(prev.cobrado), ganancia: n(prev.cobrado) - n(prev.gastos) },
    cobrado,
    gastos,
    ganancia: cobrado - gastos,
    porCobrar: n(porCobrar.rows[0]?.por_cobrar),
    terminados: n(terminados.rows[0]?.terminados),
    trabajosCobrados,
    ticketPromedio: trabajosCobrados ? Math.round(cobrado / trabajosCobrados) : 0,
    porTipo: porTipo.rows.map((f) => ({
      tipo: String(f.tipo),
      cobrado: n(f.cobrado),
      trabajos: n(f.trabajos),
      promedio: n(f.trabajos) ? Math.round(n(f.cobrado) / n(f.trabajos)) : 0,
    })),
    porZona: porZona.rows.map((f) => ({ zona: String(f.zona), cobrado: n(f.cobrado), trabajos: n(f.trabajos) })),
    porMes: porMes.rows.map((f) => ({ mes: String(f.mes), cobrado: n(f.cobrado), gastos: n(f.gastos) })),
    medios: medios.rows.map((f) => ({ medio: String(f.medio), cobrado: n(f.cobrado), pagos: n(f.pagos) })),
    embudo: {
      consultas: n(embudo.rows[0]?.consultas),
      agendados: n(embudo.rows[0]?.agendados),
      terminados: n(embudo.rows[0]?.terminados),
    },
    pendientes: pendientes.rows.map((f) => ({
      id: n(f.id),
      titulo: String(f.titulo),
      clienteNombre: String(f.cliente_nombre),
      clienteTelefono: f.cliente_telefono ? String(f.cliente_telefono) : null,
      inicio: f.inicio,
      estado: String(f.estado),
      precio: n(f.precio_centavos),
      pagado: n(f.pagado),
      saldo: n(f.precio_centavos) - n(f.pagado),
    })),
  });
});

// CSV para Excel en español: separador ";", decimales con coma y BOM para los acentos.
const MEDIOS: Record<string, string> = { efectivo: "Efectivo", transferencia: "Transferencia", mercadopago: "Mercado Pago", otro: "Otro" };
const celda = (v: unknown) => {
  const s = String(v ?? "");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const pesos = (centavos: number) => (centavos / 100).toFixed(2).replace(".", ",");

finanzas.get("/csv", async (c) => {
  const r = rango(c);
  if (!r) return c.json({ ok: false, error: "datos_invalidos" }, 400);
  const db = getDb(c.env.DATABASE_URL);
  const movimientos = await db.execute(sql`
    select p.fecha, 'Cobro' as tipo, t.titulo, t.cliente_nombre, coalesce(s.nombre, '') as trabajo,
           coalesce(z.nombre, t.localidad_otra, '') as localidad, p.medio::text as medio, coalesce(p.nota, '') as detalle,
           p.monto_centavos as monto
    from trabajo_pagos p join trabajos t on t.id = p.trabajo_id
    left join servicios s on s.id = t.servicio_id left join zonas z on z.id = t.zona_id
    where p.fecha between ${r.desde} and ${r.hasta}
    union all
    select g.fecha, 'Gasto', t.titulo, t.cliente_nombre, coalesce(s.nombre, ''), coalesce(z.nombre, t.localidad_otra, ''),
           '', g.descripcion, -g.monto_centavos
    from trabajo_gastos g join trabajos t on t.id = g.trabajo_id
    left join servicios s on s.id = t.servicio_id left join zonas z on z.id = t.zona_id
    where g.fecha between ${r.desde} and ${r.hasta}
    order by 1, 2`);
  const filas = [
    ["Fecha", "Movimiento", "Trabajo", "Cliente", "Tipo de trabajo", "Localidad", "Medio de pago", "Detalle", "Monto ($)"],
    ...movimientos.rows.map((f) => [
      String(f.fecha).slice(0, 10),
      f.tipo,
      f.titulo,
      f.cliente_nombre,
      f.trabajo,
      f.localidad,
      MEDIOS[String(f.medio)] ?? "",
      f.detalle,
      pesos(n(f.monto)),
    ]),
  ];
  const csv = "﻿" + filas.map((f) => f.map(celda).join(";")).join("\r\n") + "\r\n";
  return c.body(csv, 200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="voltis-finanzas-${r.desde}-a-${r.hasta}.csv"`,
  });
});

