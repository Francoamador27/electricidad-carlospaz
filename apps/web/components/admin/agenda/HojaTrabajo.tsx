"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ESTADOS_TRABAJO,
  MEDIOS_PAGO,
  NOMBRE_COBRO,
  estadoCobro,
  formatoPesos,
  hoyLocal,
  horaLocal,
  linkComoLlegar,
  linkMapaEmbebido,
  linkWaze,
  linkWhatsappCliente,
  nombreDia,
  fechaLocal,
  pesosACentavos,
  sumarDias,
  type EstadoTrabajo,
  type MedioPago,
} from "@voltis/shared/agenda";
import { Hoja, FilaDato, Segmentado } from "@/components/admin/ios";
import { claseInput } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";
import { localidad, type TrabajoDetalle } from "@/lib/agenda";
import { srcFoto } from "@/lib/fotos";

export function textoCuando(t: { inicio: string; fin: string; todoElDia: boolean }): string {
  const ini = new Date(t.inicio);
  const fin = new Date(t.fin);
  if (t.todoElDia) {
    const desde = fechaLocal(ini);
    const hasta = sumarDias(fechaLocal(fin), -1);
    return hasta > desde ? `${nombreDia(desde)} al ${nombreDia(hasta)} · todo el día` : `${nombreDia(desde)} · todo el día`;
  }
  const mismoDia = fechaLocal(ini) === fechaLocal(fin);
  return mismoDia
    ? `${nombreDia(fechaLocal(ini))} · ${horaLocal(ini)} a ${horaLocal(fin)}`
    : `${nombreDia(fechaLocal(ini))} ${horaLocal(ini)} al ${nombreDia(fechaLocal(fin))} ${horaLocal(fin)}`;
}

export const COLOR_ESTADO: Record<EstadoTrabajo, string> = {
  agendado: "var(--ios-acento)",
  en_curso: "#2f80ed",
  terminado: "var(--ios-verde)",
  cancelado: "var(--ios-texto-2)",
};

function Pastilla({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ios-relleno)] px-2.5 py-0.5 text-[13px] font-medium">
      <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

function BotonAccion({ href, icono, children, externo }: { href: string; icono: string; children: React.ReactNode; externo?: boolean }) {
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-xl bg-[var(--ios-tarjeta)] min-h-[64px] px-1 text-[12px] font-medium text-[var(--ios-acento)] text-center leading-tight active:opacity-70"
    >
      <span aria-hidden="true" className="text-xl leading-none">
        {icono}
      </span>
      <span>{children}</span>
    </a>
  );
}

export default function HojaTrabajo({
  id,
  onCerrar,
  onCambio,
}: {
  id: number | null;
  onCerrar: () => void;
  onCambio: () => void;
}) {
  const router = useRouter();
  const [t, setT] = useState<TrabajoDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [pago, setPago] = useState({ fecha: hoyLocal(), monto: "", medio: "transferencia" as MedioPago });
  const [gasto, setGasto] = useState({ fecha: hoyLocal(), monto: "", descripcion: "" });

  useEffect(() => {
    if (id == null) return;
    let vigente = true;
    adminApi<TrabajoDetalle>(`/trabajos/${id}`)
      .then((d) => vigente && (setT(d), setError(null)))
      .catch((e) => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
      setT(null);
    };
  }, [id]);

  async function accion(fn: () => Promise<TrabajoDetalle | void>) {
    setOcupado(true);
    setError(null);
    try {
      const d = await fn();
      if (d) setT(d);
      onCambio();
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setOcupado(false);
    }
  }

  const cambiarEstado = (estado: EstadoTrabajo) =>
    accion(() => adminApi<TrabajoDetalle>(`/trabajos/${id}/estado`, { method: "PATCH", body: JSON.stringify({ estado }) }));

  function agregarPago(ev: React.FormEvent) {
    ev.preventDefault();
    const montoCentavos = pesosACentavos(pago.monto);
    if (!montoCentavos) return setError("Poné un monto válido.");
    accion(async () => {
      const d = await adminApi<TrabajoDetalle>(`/trabajos/${id}/pagos`, {
        method: "POST",
        body: JSON.stringify({ fecha: pago.fecha, montoCentavos, medio: pago.medio }),
      });
      setPago({ ...pago, monto: "" });
      return d;
    });
  }

  function agregarGasto(ev: React.FormEvent) {
    ev.preventDefault();
    const montoCentavos = pesosACentavos(gasto.monto);
    if (!montoCentavos || gasto.descripcion.trim().length < 2) return setError("Completá el detalle y el monto del gasto.");
    accion(async () => {
      const d = await adminApi<TrabajoDetalle>(`/trabajos/${id}/gastos`, {
        method: "POST",
        body: JSON.stringify({ fecha: gasto.fecha, montoCentavos, descripcion: gasto.descripcion }),
      });
      setGasto({ ...gasto, monto: "", descripcion: "" });
      return d;
    });
  }

  function borrar() {
    if (!t || !confirm(`¿Borrar "${t.titulo}"? Se borran también sus pagos y gastos.`)) return;
    accion(async () => {
      await adminApi(`/trabajos/${id}`, { method: "DELETE" });
      onCerrar();
    });
  }

  function publicarProyecto() {
    accion(async () => {
      const r = await adminApi<{ proyectoId: number }>(`/trabajos/${id}/proyecto`, { method: "POST" });
      router.push(`/admin/proyectos/editar?id=${r.proyectoId}`);
    });
  }

  const cobro = t ? estadoCobro(t.precioCentavos, t.pagadoCentavos) : null;
  const saldo = t?.precioCentavos ? Math.max(t.precioCentavos - t.pagadoCentavos, 0) : 0;
  const destino = t ? { lat: t.lat, lng: t.lng, direccion: t.direccion, localidad: localidad(t) } : null;
  const comoLlegar = destino && linkComoLlegar(destino);
  const waze = destino && linkWaze(destino);

  return (
    <Hoja abierta={id != null} onCerrar={onCerrar} titulo={t?.titulo ?? "Trabajo"}>
      {error && (
        <p role="alert" className="mb-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm px-4 py-3">
          {error}
        </p>
      )}
      {!t && !error && <p className="ios-secundario py-6 text-center">Cargando...</p>}
      {t && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Pastilla color={COLOR_ESTADO[t.estado]}>{ESTADOS_TRABAJO.find((e) => e.valor === t.estado)?.nombre}</Pastilla>
            {cobro && cobro !== "sin_precio" && (
              <Pastilla color={cobro === "cobrado" ? "var(--ios-verde)" : cobro === "senado" ? "#f5a623" : "var(--ios-rojo)"}>
                {NOMBRE_COBRO[cobro]}
              </Pastilla>
            )}
          </div>
          <p className="text-[15px]">{textoCuando(t)}</p>

          {/* Acciones rápidas */}
          <div className="flex gap-2">
            {t.clienteTelefono && <BotonAccion href={`tel:${t.clienteTelefono.replace(/[^\d+]/g, "")}`} icono="📞">Llamar</BotonAccion>}
            {t.clienteTelefono && (
              <BotonAccion href={linkWhatsappCliente(t.clienteTelefono, `Hola ${t.clienteNombre.split(" ")[0]}, te escribimos de Voltis.`)} icono="💬" externo>
                WhatsApp
              </BotonAccion>
            )}
            {comoLlegar && (
              <BotonAccion href={comoLlegar} icono="🧭" externo>
                Cómo llegar
              </BotonAccion>
            )}
            {waze && (
              <BotonAccion href={waze} icono="🚗" externo>
                Waze
              </BotonAccion>
            )}
          </div>

          {/* Cliente y lugar */}
          <div className="ios-lista">
            <FilaDato etiqueta="Cliente">{t.clienteNombre}</FilaDato>
            {t.clienteTelefono && <FilaDato etiqueta="Teléfono">{t.clienteTelefono}</FilaDato>}
            {(t.direccion || localidad(t)) && (
              <FilaDato etiqueta="Dirección">{[t.direccion, localidad(t)].filter(Boolean).join(", ")}</FilaDato>
            )}
            {t.quienVa && <FilaDato etiqueta="Va">{t.quienVa}</FilaDato>}
            {t.servicio && <FilaDato etiqueta="Tipo">{t.servicio}</FilaDato>}
          </div>

          {t.lat != null && t.lng != null && (
            <div className="ios-card overflow-hidden">
              <iframe
                title={`Mapa de ${t.direccion ?? t.clienteNombre}`}
                src={linkMapaEmbebido({ lat: t.lat, lng: t.lng })}
                className="w-full h-48 border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {t.mapsUrl && (
                <a href={t.mapsUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm text-[var(--ios-acento)]">
                  Abrir el link de Google Maps ↗
                </a>
              )}
            </div>
          )}

          {(t.descripcion || t.notas) && (
            <div className="ios-card p-4 space-y-3">
              {t.descripcion && (
                <div>
                  <p className="ios-encabezado-lista px-0!">Trabajo a realizar</p>
                  <p className="whitespace-pre-line">{t.descripcion}</p>
                </div>
              )}
              {t.notas && (
                <div>
                  <p className="ios-encabezado-lista px-0!">Notas</p>
                  <p className="whitespace-pre-line">{t.notas}</p>
                </div>
              )}
            </div>
          )}

          {t.fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {t.fotos.map((f) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.key} src={srcFoto(f, f.anchos[0])} alt={f.alt} className="aspect-square w-full object-cover rounded-xl" />
              ))}
            </div>
          )}

          {/* Plata */}
          <section aria-label="Pagos y gastos">
            <p className="ios-encabezado-lista">Plata</p>
            <div className="ios-lista">
              <FilaDato etiqueta="Precio">{formatoPesos(t.precioCentavos)}</FilaDato>
              <FilaDato etiqueta="Cobrado">{formatoPesos(t.pagadoCentavos)}</FilaDato>
              {t.precioCentavos != null && (
                <FilaDato etiqueta="Falta cobrar">
                  <strong className={saldo > 0 ? "text-[var(--ios-rojo)]" : ""}>{formatoPesos(saldo)}</strong>
                </FilaDato>
              )}
              {t.gastadoCentavos > 0 && <FilaDato etiqueta="Gastos">{formatoPesos(t.gastadoCentavos)}</FilaDato>}
              {t.gastadoCentavos > 0 && <FilaDato etiqueta="Ganancia">{formatoPesos(t.pagadoCentavos - t.gastadoCentavos)}</FilaDato>}
            </div>

            <p className="ios-encabezado-lista mt-5">Pagos</p>
            <div className="ios-lista">
              {t.pagos.map((p) => (
                <div key={p.id} className="ios-fila">
                  <span className="flex-1">
                    {formatoPesos(p.montoCentavos)}
                    <span className="block text-[13px] ios-secundario">
                      {nombreDia(p.fecha)} · {MEDIOS_PAGO.find((m) => m.valor === p.medio)?.nombre}
                      {p.nota ? ` · ${p.nota}` : ""}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Borrar pago de ${formatoPesos(p.montoCentavos)}`}
                    onClick={() => confirm("¿Borrar este pago?") && accion(() => adminApi<TrabajoDetalle>(`/trabajos/${id}/pagos/${p.id}`, { method: "DELETE" }))}
                    className="ios-boton-texto text-[var(--ios-rojo)]"
                  >
                    Borrar
                  </button>
                </div>
              ))}
              <form onSubmit={agregarPago} className="p-3 grid grid-cols-2 gap-2">
                <label className="col-span-2 sm:col-span-1">
                  <span className="sr-only">Monto del pago</span>
                  <input className={claseInput} inputMode="decimal" placeholder={saldo ? `Monto (falta ${formatoPesos(saldo)})` : "Monto $"} value={pago.monto} onChange={(e) => setPago({ ...pago, monto: e.target.value })} />
                </label>
                <label>
                  <span className="sr-only">Fecha del pago</span>
                  <input className={claseInput} type="date" value={pago.fecha} onChange={(e) => setPago({ ...pago, fecha: e.target.value })} />
                </label>
                <label>
                  <span className="sr-only">Medio de pago</span>
                  <select className={claseInput} value={pago.medio} onChange={(e) => setPago({ ...pago, medio: e.target.value as MedioPago })}>
                    {MEDIOS_PAGO.map((m) => (
                      <option key={m.valor} value={m.valor}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" disabled={ocupado} className="ios-boton col-span-2 sm:col-span-1 disabled:opacity-50">
                  + Registrar pago
                </button>
              </form>
            </div>

            <p className="ios-encabezado-lista mt-5">Gastos y materiales</p>
            <div className="ios-lista">
              {t.gastos.map((g) => (
                <div key={g.id} className="ios-fila">
                  <span className="flex-1">
                    {g.descripcion}
                    <span className="block text-[13px] ios-secundario">
                      {formatoPesos(g.montoCentavos)} · {nombreDia(g.fecha)}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Borrar gasto ${g.descripcion}`}
                    onClick={() => confirm("¿Borrar este gasto?") && accion(() => adminApi<TrabajoDetalle>(`/trabajos/${id}/gastos/${g.id}`, { method: "DELETE" }))}
                    className="ios-boton-texto text-[var(--ios-rojo)]"
                  >
                    Borrar
                  </button>
                </div>
              ))}
              <form onSubmit={agregarGasto} className="p-3 grid grid-cols-2 gap-2">
                <label className="col-span-2">
                  <span className="sr-only">Detalle del gasto</span>
                  <input className={claseInput} placeholder="Detalle (ej. cables, disyuntor)" value={gasto.descripcion} onChange={(e) => setGasto({ ...gasto, descripcion: e.target.value })} />
                </label>
                <label>
                  <span className="sr-only">Monto del gasto</span>
                  <input className={claseInput} inputMode="decimal" placeholder="Monto $" value={gasto.monto} onChange={(e) => setGasto({ ...gasto, monto: e.target.value })} />
                </label>
                <label>
                  <span className="sr-only">Fecha del gasto</span>
                  <input className={claseInput} type="date" value={gasto.fecha} onChange={(e) => setGasto({ ...gasto, fecha: e.target.value })} />
                </label>
                <button type="submit" disabled={ocupado} className="ios-boton col-span-2 disabled:opacity-50">
                  + Agregar gasto
                </button>
              </form>
            </div>
          </section>

          {/* Estado y acciones */}
          <section aria-label="Estado del trabajo" className="space-y-3">
            <p className="ios-encabezado-lista">Estado</p>
            <Segmentado
              etiqueta="Estado del trabajo"
              opciones={ESTADOS_TRABAJO}
              valor={t.estado}
              onChange={(e) => !ocupado && cambiarEstado(e)}
            />
          </section>

          <div className="ios-lista">
            <Link href={`/admin/agenda/editar?id=${t.id}`} className="ios-fila text-[var(--ios-acento)]">
              Editar trabajo
            </Link>
            {t.estado === "terminado" &&
              (t.proyectoId ? (
                <Link href={`/admin/proyectos/editar?id=${t.proyectoId}`} className="ios-fila text-[var(--ios-acento)]">
                  Ver el proyecto publicado en la web
                </Link>
              ) : (
                <button type="button" onClick={publicarProyecto} disabled={ocupado} className="ios-fila w-full text-left text-[var(--ios-acento)]">
                  Publicar como proyecto en la web (sin datos del cliente)
                </button>
              ))}
            {t.consultaId && (
              <Link href={`/admin/consultas?consulta=${t.consultaId}`} className="ios-fila text-[var(--ios-acento)]">
                Ver la consulta original
              </Link>
            )}
            <button type="button" onClick={borrar} disabled={ocupado} className="ios-fila w-full text-left text-[var(--ios-rojo)]">
              Borrar trabajo
            </button>
          </div>
        </div>
      )}
    </Hoja>
  );
}
