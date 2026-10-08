"use client";

import { useEffect, useMemo, useState } from "react";
import GraficoDias, { SERIES, type Dia } from "@/components/admin/GraficoDias";
import { Cargando, MensajeError, Tarjeta } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";

type Fila = { n: number };
type Estadisticas = {
  dias: number;
  totales: Record<string, number>;
  porDia: { d: string; tipo: string; n: number }[];
  porPagina: (Fila & { pagina: string })[];
  porOrigen: (Fila & { origen: string })[];
  porZona: (Fila & { zona: string })[];
};

const RANGOS = [7, 30, 90] as const;

function completarDias(est: Estadisticas): Dia[] {
  const hoy = new Date();
  const dias: Dia[] = [];
  for (let i = est.dias - 1; i >= 0; i--) {
    const f = new Date(hoy);
    f.setDate(hoy.getDate() - i);
    const fecha = f.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Cordoba" });
    dias.push({ fecha, formulario: 0, click_whatsapp: 0, click_telefono: 0 });
  }
  for (const r of est.porDia) {
    const dia = dias.find((d) => d.fecha === r.d);
    if (dia && r.tipo in dia) dia[r.tipo as keyof Omit<Dia, "fecha">] += r.n;
  }
  return dias;
}

function Ranking({ titulo, filas }: { titulo: string; filas: { etiqueta: string; n: number }[] }) {
  const max = Math.max(1, ...filas.map((f) => f.n));
  return (
    <Tarjeta>
      <h2 className="font-semibold mb-3">{titulo}</h2>
      {filas.length === 0 ? (
        <p className="text-sm text-slate-500">Sin datos en este período.</p>
      ) : (
        <ul className="space-y-2">
          {filas.map((f) => (
            <li key={f.etiqueta} className="text-sm">
              <div className="flex justify-between gap-3">
                <span className="truncate text-slate-700" title={f.etiqueta}>{f.etiqueta}</span>
                <span className="tabular-nums font-medium">{f.n}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded mt-1">
                <div className="h-1.5 rounded bg-slate-500" style={{ width: `${(f.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}

export default function ConversionesPage() {
  const [rango, setRango] = useState<(typeof RANGOS)[number]>(30);
  const [est, setEst] = useState<Estadisticas | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    adminApi<Estadisticas>(`/estadisticas?dias=${rango}`)
      .then((r) => vigente && (setEst(r), setError(null)))
      .catch((e) => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, [rango]);

  const dias = useMemo(() => (est ? completarDias(est) : []), [est]);
  const total = est ? Object.values(est.totales).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Conversiones</h1>
        <div className="inline-flex rounded border border-slate-300 bg-white overflow-hidden" role="group" aria-label="Período">
          {RANGOS.map((r) => (
            <button
              key={r}
              onClick={() => setRango(r)}
              className={`px-3 py-1.5 text-sm ${rango === r ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
            >
              {r} días
            </button>
          ))}
        </div>
      </div>

      <MensajeError texto={error} />
      {!est && !error && <Cargando />}

      {est && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Tarjeta>
              <p className="text-sm text-slate-500">Total de contactos</p>
              <p className="text-3xl font-bold tabular-nums mt-1">{total}</p>
            </Tarjeta>
            {SERIES.map((s) => (
              <Tarjeta key={s.clave}>
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
                  {s.label}
                </p>
                <p className="text-3xl font-bold tabular-nums mt-1">{est.totales[s.clave] ?? 0}</p>
              </Tarjeta>
            ))}
          </div>

          <Tarjeta className="mb-6">
            <h2 className="font-semibold mb-3">Por día</h2>
            <GraficoDias dias={dias} />
          </Tarjeta>

          <div className="grid md:grid-cols-3 gap-4">
            <Ranking titulo="Páginas que más convierten" filas={est.porPagina.map((f) => ({ etiqueta: f.pagina, n: f.n }))} />
            <Ranking titulo="Origen" filas={est.porOrigen.map((f) => ({ etiqueta: f.origen, n: f.n }))} />
            <Ranking titulo="Localidad (formularios)" filas={est.porZona.map((f) => ({ etiqueta: f.zona, n: f.n }))} />
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Formularios = consultas guardadas. WhatsApp y teléfono = clics en los botones del sitio (no
            garantizan que la persona haya escrito o llamado). Para el detalle de campañas, usá Google
            Analytics.
          </p>
        </>
      )}
    </div>
  );
}
