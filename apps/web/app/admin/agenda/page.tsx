"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  NOMBRE_COBRO,
  diasQueOcupa,
  estadoCobro,
  fechaLocal,
  formatoPesos,
  grillaMes,
  horaLocal,
  hoyLocal,
  inicioSemana,
  nombreDia,
  sumarDias,
} from "@voltis/shared/agenda";
import HojaTrabajo, { COLOR_ESTADO } from "@/components/admin/agenda/HojaTrabajo";
import { Segmentado } from "@/components/admin/ios";
import { Cargando, MensajeError } from "@/components/admin/ui";
import { mensajeError } from "@/lib/admin-api";
import { cargarAgenda, localidad, type Trabajo } from "@/lib/agenda";

type Vista = "mes" | "semana" | "dia" | "lista";
const VISTAS: { valor: Vista; nombre: string }[] = [
  { valor: "mes", nombre: "Mes" },
  { valor: "semana", nombre: "Semana" },
  { valor: "dia", nombre: "Día" },
  { valor: "lista", nombre: "Lista" },
];
const CLAVE_VISTA = "voltis-agenda-vista";
const DIAS_LISTA = 60;

const nombreMes = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", month: "long", year: "numeric" });
const tituloMes = (fecha: string) => {
  const t = nombreMes.format(new Date(`${fecha.slice(0, 7)}-15T12:00:00Z`));
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const linkNuevo = (fecha: string, hora?: string) =>
  `/admin/agenda/editar?fecha=${fecha}${hora ? `&hora=${hora}` : ""}`;

function rango(vista: Vista, fecha: string): { desde: string; hasta: string } {
  if (vista === "dia") return { desde: fecha, hasta: fecha };
  if (vista === "semana") {
    const lunes = inicioSemana(fecha);
    return { desde: lunes, hasta: sumarDias(lunes, 6) };
  }
  if (vista === "lista") return { desde: hoyLocal(), hasta: sumarDias(hoyLocal(), DIAS_LISTA) };
  const semanas = grillaMes(Number(fecha.slice(0, 4)), Number(fecha.slice(5, 7)));
  return { desde: semanas[0][0], hasta: semanas.at(-1)![6] };
}

// Agrupa los trabajos por cada día que ocupan (los de varios días aparecen en todos).
function porDia(trabajos: Trabajo[]): Map<string, Trabajo[]> {
  const mapa = new Map<string, Trabajo[]>();
  for (const t of trabajos) {
    for (const d of diasQueOcupa(new Date(t.inicio), new Date(t.fin), t.todoElDia)) {
      if (!mapa.has(d)) mapa.set(d, []);
      mapa.get(d)!.push(t);
    }
  }
  for (const lista of mapa.values()) {
    lista.sort((a, b) => Number(b.todoElDia) - Number(a.todoElDia) || a.inicio.localeCompare(b.inicio));
  }
  return mapa;
}

function FilaTrabajo({ t, dia, onAbrir }: { t: Trabajo; dia: string; onAbrir: (id: number) => void }) {
  const cobro = estadoCobro(t.precioCentavos, t.pagadoCentavos);
  const ini = new Date(t.inicio);
  const fin = new Date(t.fin);
  const varios = t.todoElDia || fechaLocal(ini) !== fechaLocal(fin);
  const cuando = t.todoElDia
    ? "Todo el día"
    : varios && fechaLocal(ini) !== dia
      ? `hasta ${horaLocal(fin)}`
      : horaLocal(ini);
  return (
    <button
      type="button"
      onClick={() => onAbrir(t.id)}
      className={`ios-fila w-full text-left ${t.estado === "cancelado" ? "opacity-60" : ""}`}
    >
      <span className="w-[62px] shrink-0 text-[13px] tabular-nums">
        <span className="block font-semibold">{cuando}</span>
        {!t.todoElDia && fechaLocal(ini) === dia && <span className="ios-secundario">{horaLocal(fin)}</span>}
      </span>
      <span aria-hidden="true" className="w-1 self-stretch rounded-full" style={{ background: COLOR_ESTADO[t.estado] }} />
      <span className="flex-1 min-w-0">
        <span className={`block font-semibold truncate ${t.estado === "cancelado" ? "line-through" : ""}`}>{t.titulo}</span>
        <span className="block text-[13px] ios-secundario truncate">
          {[t.clienteNombre, localidad(t), t.quienVa && `va ${t.quienVa}`].filter(Boolean).join(" · ")}
        </span>
      </span>
      {t.precioCentavos != null && (
        <span className="text-right text-[13px] shrink-0">
          <span className="block tabular-nums">{formatoPesos(t.precioCentavos)}</span>
          <span className={cobro === "cobrado" ? "text-[var(--ios-verde)]" : cobro === "sin_cobrar" ? "text-[var(--ios-rojo)]" : "ios-secundario"}>
            {NOMBRE_COBRO[cobro]}
          </span>
        </span>
      )}
    </button>
  );
}

function ListaDia({ dia, trabajos, onAbrir, vacio, agregar }: { dia: string; trabajos: Trabajo[]; onAbrir: (id: number) => void; vacio?: string; agregar?: boolean }) {
  return (
    <section aria-label={nombreDia(dia)} className="mb-5">
      <div className="flex items-end justify-between">
        <h2 className="ios-encabezado-lista">{capital(nombreDia(dia))}</h2>
        {agregar && (
          <Link
            href={linkNuevo(dia)}
            aria-label={`Agregar trabajo: ${nombreDia(dia)}`}
            className="ios-boton-texto text-[15px] px-4 pb-1.5"
          >
            + Agregar trabajo
          </Link>
        )}
      </div>
      {trabajos.length ? (
        <div className="ios-lista">
          {trabajos.map((t) => (
            <FilaTrabajo key={`${t.id}-${dia}`} t={t} dia={dia} onAbrir={onAbrir} />
          ))}
        </div>
      ) : (
        vacio &&
        (agregar ? (
          <Link href={linkNuevo(dia)} tabIndex={-1} className="ios-card block px-4 py-3 ios-secundario text-[15px] active:opacity-70">
            {vacio}
          </Link>
        ) : (
          <p className="ios-card px-4 py-3 ios-secundario text-[15px]">{vacio}</p>
        ))
      )}
    </section>
  );
}

function Navegador({ texto, onAnterior, onSiguiente, onHoy }: { texto: string; onAnterior: () => void; onSiguiente: () => void; onHoy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <button type="button" onClick={onAnterior} aria-label="Anterior" className="ios-boton-texto text-2xl leading-none">
        ‹
      </button>
      <h2 className="text-[17px] font-semibold text-center flex-1">{texto}</h2>
      <button type="button" onClick={onHoy} className="ios-boton-texto text-[15px]">
        Hoy
      </button>
      <button type="button" onClick={onSiguiente} aria-label="Siguiente" className="ios-boton-texto text-2xl leading-none">
        ›
      </button>
    </div>
  );
}

function VistaMes({ fecha, setFecha, dias, onAbrir }: { fecha: string; setFecha: (f: string) => void; dias: Map<string, Trabajo[]>; onAbrir: (id: number) => void }) {
  const router = useRouter();
  const hoy = hoyLocal();
  // Día libre → formulario para agendar. Día con trabajos → se muestran abajo, con "+ Agregar trabajo".
  const tocarDia = (d: string, cantidad: number) => {
    if (!cantidad) router.push(linkNuevo(d));
    else setFecha(d);
  };
  const semanas = grillaMes(Number(fecha.slice(0, 4)), Number(fecha.slice(5, 7)));
  const cambiarMes = (delta: number) => {
    const d = new Date(`${fecha.slice(0, 7)}-01T12:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() + delta);
    setFecha(d.toISOString().slice(0, 10));
  };
  return (
    <>
      <Navegador texto={tituloMes(fecha)} onAnterior={() => cambiarMes(-1)} onSiguiente={() => cambiarMes(1)} onHoy={() => setFecha(hoy)} />
      <div className="ios-card p-2 mb-5">
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold ios-secundario mb-1" aria-hidden="true">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div role="grid" aria-label={tituloMes(fecha)}>
          {semanas.map((semana) => (
            <div role="row" key={semana[0]} className="grid grid-cols-7">
              {semana.map((d) => {
                const del = dias.get(d) ?? [];
                const fuera = d.slice(0, 7) !== fecha.slice(0, 7);
                return (
                  <button
                    key={d}
                    type="button"
                    role="gridcell"
                    aria-selected={d === fecha}
                    aria-label={`${nombreDia(d)}${del.length ? `, ${del.length} ${del.length === 1 ? "trabajo" : "trabajos"}` : ""}`}
                    onClick={() => tocarDia(d, del.length)}
                    className={`ios-dia ${d === hoy ? "ios-dia-hoy" : ""} ${fuera ? "opacity-40" : ""}`}
                  >
                    <span className="ios-dia-numero">{Number(d.slice(8))}</span>
                    <span className="flex gap-0.5 h-1.5" aria-hidden="true">
                      {del.slice(0, 3).map((t) => (
                        <span key={t.id} className="w-1.5 h-1.5 rounded-full" style={{ background: COLOR_ESTADO[t.estado] }} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <ListaDia dia={fecha} trabajos={dias.get(fecha) ?? []} onAbrir={onAbrir} vacio="Sin trabajos. Tocá para agendar uno." agregar />
    </>
  );
}

function VistaSemana({ fecha, setFecha, dias, onAbrir }: { fecha: string; setFecha: (f: string) => void; dias: Map<string, Trabajo[]>; onAbrir: (id: number) => void }) {
  const lunes = inicioSemana(fecha);
  const domingo = sumarDias(lunes, 6);
  const corto = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", day: "numeric", month: "short" });
  const texto = `${corto.format(new Date(`${lunes}T12:00:00Z`))} – ${corto.format(new Date(`${domingo}T12:00:00Z`))}`;
  return (
    <>
      <Navegador texto={texto} onAnterior={() => setFecha(sumarDias(fecha, -7))} onSiguiente={() => setFecha(sumarDias(fecha, 7))} onHoy={() => setFecha(hoyLocal())} />
      {Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i)).map((d) => (
        <ListaDia key={d} dia={d} trabajos={dias.get(d) ?? []} onAbrir={onAbrir} vacio="Libre" agregar />
      ))}
    </>
  );
}

const ALTO_HORA = 56;

function VistaDia({ fecha, setFecha, dias, onAbrir }: { fecha: string; setFecha: (f: string) => void; dias: Map<string, Trabajo[]>; onAbrir: (id: number) => void }) {
  const del = dias.get(fecha) ?? [];
  const completos = del.filter((t) => t.todoElDia || fechaLocal(new Date(t.inicio)) !== fecha || fechaLocal(new Date(t.fin)) !== fecha);
  const conHora = del.filter((t) => !completos.includes(t));
  const minutos = (iso: string) => {
    const [h, m] = horaLocal(new Date(iso)).split(":").map(Number);
    return h * 60 + m;
  };
  const desdeHora = Math.min(7, ...conHora.map((t) => Math.floor(minutos(t.inicio) / 60)));
  const hastaHora = Math.max(21, ...conHora.map((t) => Math.ceil(minutos(t.fin) / 60)));
  const horas = Array.from({ length: hastaHora - desdeHora + 1 }, (_, i) => desdeHora + i);
  return (
    <>
      <Navegador texto={capital(nombreDia(fecha))} onAnterior={() => setFecha(sumarDias(fecha, -1))} onSiguiente={() => setFecha(sumarDias(fecha, 1))} onHoy={() => setFecha(hoyLocal())} />
      {completos.length > 0 && <ListaDia dia={fecha} trabajos={completos} onAbrir={onAbrir} agregar />}
      <div className="ios-card relative" style={{ height: (horas.length - 1) * ALTO_HORA + 24 }}>
        {horas.map((h, i) => (
          <div key={h} className="absolute left-0 right-0 flex items-start gap-2 px-3" style={{ top: 12 + i * ALTO_HORA - 8 }}>
            <span className="w-10 text-[11px] ios-secundario tabular-nums">{String(h).padStart(2, "0")}:00</span>
            <span className="flex-1 mt-2 border-t border-[var(--ios-separador)]" />
          </div>
        ))}
        {/* Tocar una franja libre abre el formulario con esa hora. */}
        {horas.slice(0, -1).flatMap((h, i) =>
          ["00", "30"].map((min, j) => (
            <Link
              key={`${h}:${min}`}
              href={linkNuevo(fecha, `${String(h).padStart(2, "0")}:${min}`)}
              aria-label={`Agregar trabajo a las ${String(h).padStart(2, "0")}:${min}`}
              className="absolute left-14 right-3 rounded-md active:bg-[var(--ios-relleno)]"
              style={{ top: 12 + i * ALTO_HORA + (j * ALTO_HORA) / 2, height: ALTO_HORA / 2 }}
            />
          )),
        )}
        {conHora.map((t) => {
          const top = 12 + ((minutos(t.inicio) - desdeHora * 60) / 60) * ALTO_HORA;
          const alto = Math.max(((minutos(t.fin) - minutos(t.inicio)) / 60) * ALTO_HORA, 26);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onAbrir(t.id)}
              className="absolute left-14 right-3 rounded-lg px-2 py-1 text-left text-[13px] overflow-hidden border-l-4"
              style={{ top, height: alto, borderColor: COLOR_ESTADO[t.estado], background: "var(--ios-relleno)" }}
            >
              <span className="font-semibold block truncate">
                {horaLocal(new Date(t.inicio))} {t.titulo}
              </span>
              <span className="ios-secundario block truncate">{[t.clienteNombre, localidad(t)].filter(Boolean).join(" · ")}</span>
            </button>
          );
        })}
        {!del.length && (
          <p className="absolute inset-x-0 top-1/3 text-center ios-secundario pointer-events-none">
            Sin trabajos. Tocá una hora para agendar.
          </p>
        )}
      </div>
    </>
  );
}

function VistaLista({ dias, onAbrir }: { dias: Map<string, Trabajo[]>; onAbrir: (id: number) => void }) {
  const hoy = hoyLocal();
  const fechas = [...dias.keys()].filter((d) => d >= hoy).sort();
  if (!fechas.length) {
    return <p className="ios-card px-4 py-6 text-center ios-secundario">No hay trabajos en los próximos {DIAS_LISTA} días.</p>;
  }
  return (
    <>
      {fechas.map((d) => (
        <ListaDia key={d} dia={d} trabajos={dias.get(d)!} onAbrir={onAbrir} agregar />
      ))}
    </>
  );
}

function leerVista(): Vista {
  try {
    const v = localStorage.getItem(CLAVE_VISTA);
    return VISTAS.some((x) => x.valor === v) ? (v as Vista) : "mes";
  } catch {
    return "mes";
  }
}

function Agenda() {
  const router = useRouter();
  const parametros = useSearchParams();
  const abierto = parametros.get("trabajo");
  // El panel se dibuja solo en el navegador (después de verificar la sesión): se puede leer
  // la vista guardada al iniciar, sin desajustes con el HTML generado.
  const [vista, setVistaEstado] = useState<Vista>(leerVista);
  const [fecha, setFecha] = useState(hoyLocal);
  const [trabajos, setTrabajos] = useState<Trabajo[] | null>(null);
  const [sinConexion, setSinConexion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // La vista elegida se recuerda en este teléfono.
  const setVista = (v: Vista) => {
    setVistaEstado(v);
    try {
      localStorage.setItem(CLAVE_VISTA, v);
    } catch {
      // nada
    }
  };

  const { desde, hasta } = rango(vista, fecha);
  useEffect(() => {
    let vigente = true;
    cargarAgenda(desde, hasta)
      .then((r) => {
        if (!vigente) return;
        setTrabajos(r.trabajos);
        setSinConexion(r.sinConexion ? r.guardada : null);
        setError(null);
      })
      .catch((e) => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, [desde, hasta, version]);

  const dias = useMemo(() => porDia(trabajos ?? []), [trabajos]);
  const abrir = useCallback((id: number) => router.push(`/admin/agenda?trabajo=${id}`, { scroll: false }), [router]);
  const cerrar = useCallback(() => router.replace("/admin/agenda", { scroll: false }), [router]);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="ios-titulo-grande">Agenda</h1>
        <Link
          href={`/admin/agenda/editar?fecha=${vista === "lista" ? hoyLocal() : fecha}`}
          aria-label="Nuevo trabajo"
          className="ios-boton w-11 px-0! text-2xl leading-none"
        >
          +
        </Link>
      </div>

      <div className="mb-4">
        <Segmentado etiqueta="Vista de la agenda" opciones={VISTAS} valor={vista} onChange={setVista} />
      </div>

      {sinConexion && (
        <p role="status" className="mb-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm px-4 py-3">
          Sin conexión. Mostrando la agenda guardada el {nombreDia(fechaLocal(new Date(sinConexion)))} a las{" "}
          {horaLocal(new Date(sinConexion))}.
        </p>
      )}
      <MensajeError texto={error} />
      {!trabajos && !error && <Cargando />}

      {trabajos && vista === "mes" && <VistaMes fecha={fecha} setFecha={setFecha} dias={dias} onAbrir={abrir} />}
      {trabajos && vista === "semana" && <VistaSemana fecha={fecha} setFecha={setFecha} dias={dias} onAbrir={abrir} />}
      {trabajos && vista === "dia" && <VistaDia fecha={fecha} setFecha={setFecha} dias={dias} onAbrir={abrir} />}
      {trabajos && vista === "lista" && <VistaLista dias={dias} onAbrir={abrir} />}

      <HojaTrabajo id={abierto ? Number(abierto) : null} onCerrar={cerrar} onCambio={() => setVersion((v) => v + 1)} />
    </div>
  );
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <Agenda />
    </Suspense>
  );
}
