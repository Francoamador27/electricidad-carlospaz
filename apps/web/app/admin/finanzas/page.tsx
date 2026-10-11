"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MEDIOS_PAGO, formatoPesos, hoyLocal, linkWhatsappCliente, nombreDia, fechaLocal, sumarDias } from "@voltis/shared/agenda";
import GraficoMeses, { type Mes } from "@/components/admin/finanzas/GraficoMeses";
import { Segmentado } from "@/components/admin/ios";
import { Cargando, MensajeError, claseInput } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";
import { API_URL } from "@/lib/tracking";

type Finanzas = {
  desde: string;
  hasta: string;
  previo: { desde: string; hasta: string; cobrado: number; ganancia: number };
  cobrado: number;
  gastos: number;
  ganancia: number;
  porCobrar: number;
  terminados: number;
  trabajosCobrados: number;
  ticketPromedio: number;
  porTipo: { tipo: string; cobrado: number; trabajos: number; promedio: number }[];
  porZona: { zona: string; cobrado: number; trabajos: number }[];
  porMes: Mes[];
  medios: { medio: string; cobrado: number; pagos: number }[];
  embudo: { consultas: number; agendados: number; terminados: number };
  pendientes: {
    id: number;
    titulo: string;
    clienteNombre: string;
    clienteTelefono: string | null;
    inicio: string;
    precio: number;
    pagado: number;
    saldo: number;
  }[];
};

type Periodo = "mes" | "anterior" | "trimestre" | "anio" | "elegir";
const PERIODOS: { valor: Periodo; nombre: string }[] = [
  { valor: "mes", nombre: "Este mes" },
  { valor: "anterior", nombre: "Mes ant." },
  { valor: "trimestre", nombre: "3 meses" },
  { valor: "anio", nombre: "Año" },
  { valor: "elegir", nombre: "Elegir" },
];

function primerDiaMes(fecha: string, delta = 0): string {
  const d = new Date(`${fecha.slice(0, 7)}-01T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + delta);
  return d.toISOString().slice(0, 10);
}

function rangoDe(p: Periodo, elegido: { desde: string; hasta: string }) {
  const hoy = hoyLocal();
  switch (p) {
    case "mes":
      return { desde: primerDiaMes(hoy), hasta: sumarDias(primerDiaMes(hoy, 1), -1) };
    case "anterior":
      return { desde: primerDiaMes(hoy, -1), hasta: sumarDias(primerDiaMes(hoy), -1) };
    case "trimestre":
      return { desde: primerDiaMes(hoy, -2), hasta: sumarDias(primerDiaMes(hoy, 1), -1) };
    case "anio":
      return { desde: `${hoy.slice(0, 4)}-01-01`, hasta: `${hoy.slice(0, 4)}-12-31` };
    default:
      return elegido;
  }
}

function variacion(actual: number, previo: number): string | null {
  if (!previo) return null;
  const v = Math.round(((actual - previo) / Math.abs(previo)) * 100);
  return `${v > 0 ? "+" : ""}${v} % vs. período anterior`;
}

function Tarjeta({ titulo, valor, detalle, destacado }: { titulo: string; valor: string; detalle?: string | null; destacado?: boolean }) {
  return (
    <div className="ios-card p-4">
      <p className="text-[13px] ios-secundario">{titulo}</p>
      <p className={`text-[22px] font-bold tabular-nums mt-0.5 ${destacado ? "text-[var(--ios-acento)]" : ""}`}>{valor}</p>
      {detalle && <p className="text-[12px] ios-secundario mt-0.5">{detalle}</p>}
    </div>
  );
}

// Barras horizontales de una sola serie: el valor va escrito al lado (sin leyenda).
function Ranking({ filas }: { filas: { etiqueta: string; valor: number; texto: string; detalle?: string }[] }) {
  if (!filas.length) return <p className="ios-secundario text-sm px-4 py-3">Sin datos en este período.</p>;
  const max = Math.max(1, ...filas.map((f) => f.valor));
  return (
    <ul className="px-4 py-3 space-y-3">
      {filas.map((f) => (
        <li key={f.etiqueta}>
          <div className="flex justify-between gap-3 text-[15px]">
            <span className="truncate">{f.etiqueta}</span>
            <span className="font-semibold tabular-nums shrink-0">{f.texto}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--ios-relleno)] mt-1.5" aria-hidden="true">
            <div className="h-2 rounded-full bg-[var(--ios-acento)]" style={{ width: `${Math.max((f.valor / max) * 100, 2)}%` }} />
          </div>
          {f.detalle && <p className="text-[12px] ios-secundario mt-1">{f.detalle}</p>}
        </li>
      ))}
    </ul>
  );
}

function Bloque({ titulo, children, accion }: { titulo: string; children: React.ReactNode; accion?: React.ReactNode }) {
  return (
    <section aria-label={titulo}>
      <div className="flex items-end justify-between">
        <h2 className="ios-encabezado-lista">{titulo}</h2>
        {accion}
      </div>
      <div className="ios-card mb-6">{children}</div>
    </section>
  );
}

export default function FinanzasPage() {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [elegido, setElegido] = useState({ desde: primerDiaMes(hoyLocal()), hasta: hoyLocal() });
  const [datos, setDatos] = useState<Finanzas | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verTipo, setVerTipo] = useState<"plata" | "cantidad">("plata");
  const [bajando, setBajando] = useState(false);

  const { desde, hasta } = rangoDe(periodo, elegido);

  useEffect(() => {
    let vigente = true;
    adminApi<Finanzas>(`/finanzas?desde=${desde}&hasta=${hasta}`)
      .then((d) => vigente && (setDatos(d), setError(null)))
      .catch((e) => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, [desde, hasta]);

  async function exportar() {
    setBajando(true);
    try {
      const res = await fetch(`${API_URL}/admin/api/finanzas/csv?desde=${desde}&hasta=${hasta}`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `voltis-finanzas-${desde}-a-${hasta}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo exportar. Probá de nuevo.");
    } finally {
      setBajando(false);
    }
  }

  const tipos = datos
    ? [...datos.porTipo].sort((a, b) => (verTipo === "plata" ? b.cobrado - a.cobrado : b.trabajos - a.trabajos))
    : [];

  return (
    <div className="max-w-3xl">
      <h1 className="ios-titulo-grande mb-4">Finanzas</h1>
      <div className="mb-3">
        <Segmentado etiqueta="Período" opciones={PERIODOS} valor={periodo} onChange={setPeriodo} />
      </div>
      {periodo === "elegir" && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <label>
            <span className="block text-[13px] ios-secundario mb-1 px-1">Desde</span>
            <input className={claseInput} type="date" value={elegido.desde} max={elegido.hasta} onChange={(e) => setElegido({ ...elegido, desde: e.target.value })} />
          </label>
          <label>
            <span className="block text-[13px] ios-secundario mb-1 px-1">Hasta</span>
            <input className={claseInput} type="date" value={elegido.hasta} min={elegido.desde} onChange={(e) => setElegido({ ...elegido, hasta: e.target.value })} />
          </label>
        </div>
      )}
      <p className="text-[13px] ios-secundario mb-5">
        Del {nombreDia(desde)} al {nombreDia(hasta)}. Los ingresos se cuentan por la fecha en que se cobraron.
      </p>

      <MensajeError texto={error} />
      {!datos && !error && <Cargando />}

      {datos && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Tarjeta titulo="Cobrado" valor={formatoPesos(datos.cobrado)} detalle={variacion(datos.cobrado, datos.previo.cobrado)} destacado />
            <Tarjeta titulo="Por cobrar (hoy)" valor={formatoPesos(datos.porCobrar)} detalle={`${datos.pendientes.length} ${datos.pendientes.length === 1 ? "trabajo" : "trabajos"} con saldo`} />
            <Tarjeta
              titulo="Ganancia"
              valor={formatoPesos(datos.ganancia)}
              detalle={datos.gastos ? `Gastos: ${formatoPesos(datos.gastos)}` : "Sin gastos cargados"}
            />
            <Tarjeta
              titulo="Ticket promedio"
              valor={formatoPesos(datos.ticketPromedio)}
              detalle={`${datos.trabajosCobrados} cobrados · ${datos.terminados} terminados`}
            />
          </div>

          <Bloque titulo="Ingresos por mes (últimos 12)">
            <div className="p-3">
              <GraficoMeses meses={datos.porMes} />
            </div>
          </Bloque>

          <Bloque
            titulo="¿Qué trabajo me genera más?"
            accion={
              <div className="w-44 mb-1.5">
                <Segmentado
                  etiqueta="Ordenar por"
                  opciones={[
                    { valor: "plata", nombre: "Plata" },
                    { valor: "cantidad", nombre: "Cantidad" },
                  ]}
                  valor={verTipo}
                  onChange={setVerTipo}
                />
              </div>
            }
          >
            <Ranking
              filas={tipos.map((t) => ({
                etiqueta: t.tipo,
                valor: verTipo === "plata" ? t.cobrado : t.trabajos,
                texto: verTipo === "plata" ? formatoPesos(t.cobrado) : `${t.trabajos} ${t.trabajos === 1 ? "trabajo" : "trabajos"}`,
                detalle:
                  verTipo === "plata"
                    ? `${t.trabajos} ${t.trabajos === 1 ? "trabajo" : "trabajos"} · promedio ${formatoPesos(t.promedio)}`
                    : `${formatoPesos(t.cobrado)} · promedio ${formatoPesos(t.promedio)}`,
              }))}
            />
          </Bloque>

          <Bloque titulo="Por localidad">
            <Ranking
              filas={datos.porZona.map((z) => ({
                etiqueta: z.zona,
                valor: z.cobrado,
                texto: formatoPesos(z.cobrado),
                detalle: `${z.trabajos} ${z.trabajos === 1 ? "trabajo" : "trabajos"}`,
              }))}
            />
          </Bloque>

          <Bloque titulo="Medios de pago">
            <Ranking
              filas={datos.medios.map((m) => ({
                etiqueta: MEDIOS_PAGO.find((x) => x.valor === m.medio)?.nombre ?? m.medio,
                valor: m.cobrado,
                texto: formatoPesos(m.cobrado),
                detalle: `${m.pagos} ${m.pagos === 1 ? "pago" : "pagos"}`,
              }))}
            />
          </Bloque>

          <Bloque titulo="De la consulta al trabajo">
            <div className="grid grid-cols-3 text-center py-4">
              {[
                { n: datos.embudo.consultas, t: "Consultas del sitio" },
                { n: datos.embudo.agendados, t: "Agendadas" },
                { n: datos.embudo.terminados, t: "Terminadas" },
              ].map((e) => (
                <div key={e.t}>
                  <p className="text-[22px] font-bold tabular-nums">{e.n}</p>
                  <p className="text-[12px] ios-secundario">{e.t}</p>
                </div>
              ))}
            </div>
            <p className="text-[12px] ios-secundario px-4 pb-3">
              Cuenta los trabajos creados con &quot;Agendar&quot; desde una consulta.
            </p>
          </Bloque>

          <Bloque titulo="Pendientes de cobro">
            {datos.pendientes.length ? (
              <div className="ios-lista rounded-none">
                {datos.pendientes.map((p) => (
                  <div key={p.id} className="ios-fila">
                    <Link href={`/admin/agenda?trabajo=${p.id}`} className="flex-1 min-w-0">
                      <span className="block font-semibold truncate">{p.clienteNombre}</span>
                      <span className="block text-[13px] ios-secundario truncate">
                        {p.titulo} · {nombreDia(fechaLocal(new Date(p.inicio)))}
                      </span>
                    </Link>
                    <span className="text-right shrink-0">
                      <span className="block font-semibold tabular-nums text-[var(--ios-rojo)]">{formatoPesos(p.saldo)}</span>
                      <span className="block text-[12px] ios-secundario tabular-nums">de {formatoPesos(p.precio)}</span>
                    </span>
                    {p.clienteTelefono && (
                      <a
                        href={linkWhatsappCliente(
                          p.clienteTelefono,
                          `Hola ${p.clienteNombre.split(" ")[0]}, te escribimos de Voltis por el saldo pendiente de ${formatoPesos(p.saldo)} del trabajo "${p.titulo}". ¡Gracias!`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Recordar el pago a ${p.clienteNombre} por WhatsApp`}
                        className="ios-boton-texto -mr-3"
                      >
                        💬
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="ios-secundario text-sm px-4 py-3">No hay saldos pendientes. 🎉</p>
            )}
          </Bloque>

          <button type="button" onClick={exportar} disabled={bajando} className="ios-boton w-full mb-8 disabled:opacity-50">
            {bajando ? "Preparando..." : "Exportar a Excel (CSV)"}
          </button>
        </>
      )}
    </div>
  );
}
