"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { FotoInput } from "@voltis/shared";
import {
  ESTADOS_TRABAJO,
  aIso,
  centavosATexto,
  esLinkCortoMaps,
  esLinkMaps,
  fechaLocal,
  horaLocal,
  hoyLocal,
  leerCoordenadasMaps,
  linkMapaEmbebido,
  pesosACentavos,
  sumarDias,
  type EstadoTrabajo,
} from "@voltis/shared/agenda";
import FotosEditor from "@/components/admin/FotosEditor";
import { Interruptor } from "@/components/admin/ios";
import { Boton, Cargando, MensajeError, claseInput, errorDe } from "@/components/admin/ui";
import { useLista, useServicios } from "@/components/admin/useEditor";
import { adminApi, ErrorApi, mensajeError } from "@/lib/admin-api";
import type { TrabajoDetalle } from "@/lib/agenda";

type Form = {
  titulo: string;
  servicioId: number | null;
  estado: EstadoTrabajo;
  clienteNombre: string;
  clienteTelefono: string;
  direccion: string;
  zonaId: number | null;
  localidadOtra: string;
  mapsUrl: string;
  lat: number | null;
  lng: number | null;
  todoElDia: boolean;
  fechaDesde: string;
  horaDesde: string;
  fechaHasta: string;
  horaHasta: string;
  recordatorioMin: number | null;
  precio: string;
  quienVa: string;
  descripcion: string;
  notas: string;
  fotos: FotoInput[];
  consultaId: number | null;
};

const AVISOS = [
  { valor: "", nombre: "Sin aviso" },
  { valor: "15", nombre: "15 minutos antes" },
  { valor: "30", nombre: "30 minutos antes" },
  { valor: "60", nombre: "1 hora antes" },
  { valor: "120", nombre: "2 horas antes" },
  { valor: "1440", nombre: "1 día antes" },
];

// Hora de fin por defecto: dos horas después del inicio (sin pasar de las 23:59).
function dosHorasDespues(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  const fin = Math.min(h * 60 + m + 120, 23 * 60 + 59);
  return `${String(Math.floor(fin / 60)).padStart(2, "0")}:${String(fin % 60).padStart(2, "0")}`;
}

function vacio(fecha: string, hora: string | null = null): Form {
  const desde = hora && /^\d{2}:\d{2}$/.test(hora) ? hora : "09:00";
  return {
    titulo: "",
    servicioId: null,
    estado: "agendado",
    clienteNombre: "",
    clienteTelefono: "",
    direccion: "",
    zonaId: null,
    localidadOtra: "",
    mapsUrl: "",
    lat: null,
    lng: null,
    todoElDia: false,
    fechaDesde: fecha,
    horaDesde: desde,
    fechaHasta: fecha,
    horaHasta: dosHorasDespues(desde),
    recordatorioMin: 60,
    precio: "",
    quienVa: "",
    descripcion: "",
    notas: "",
    fotos: [],
    consultaId: null,
  };
}

function desdeTrabajo(t: TrabajoDetalle): Form {
  const ini = new Date(t.inicio);
  const fin = new Date(t.fin);
  return {
    titulo: t.titulo,
    servicioId: t.servicioId,
    estado: t.estado,
    clienteNombre: t.clienteNombre,
    clienteTelefono: t.clienteTelefono ?? "",
    direccion: t.direccion ?? "",
    zonaId: t.zonaId,
    localidadOtra: t.localidadOtra ?? "",
    mapsUrl: t.mapsUrl ?? "",
    lat: t.lat,
    lng: t.lng,
    todoElDia: t.todoElDia,
    fechaDesde: fechaLocal(ini),
    horaDesde: horaLocal(ini),
    // "Todo el día" se guarda con fin exclusivo: en el formulario se muestra el último día.
    fechaHasta: t.todoElDia ? sumarDias(fechaLocal(fin), -1) : fechaLocal(fin),
    horaHasta: horaLocal(fin),
    recordatorioMin: t.recordatorioMin,
    precio: centavosATexto(t.precioCentavos),
    quienVa: t.quienVa ?? "",
    descripcion: t.descripcion ?? "",
    notas: t.notas ?? "",
    fotos: t.fotos,
    consultaId: t.consultaId,
  };
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo}>
      <h2 className="ios-encabezado-lista">{titulo}</h2>
      <div className="ios-lista">{children}</div>
    </section>
  );
}

// Campo dentro de una lista agrupada: etiqueta arriba, control abajo, sin borde propio.
function Campo({ etiqueta, children, ayuda, error }: { etiqueta: string; children: React.ReactNode; ayuda?: string; error?: string }) {
  return (
    <label className="block px-4 py-2.5">
      <span className="block text-[13px] ios-secundario mb-1">{etiqueta}</span>
      {children}
      {error ? <span className="block text-xs text-[var(--ios-rojo)] mt-1">{error}</span> : ayuda && <span className="block text-xs ios-secundario mt-1">{ayuda}</span>}
    </label>
  );
}

function Editor() {
  const router = useRouter();
  const p = useSearchParams();
  const id = p.get("id");
  const consulta = p.get("consulta");
  const servicios = useServicios();
  const zonas = useLista<{ id: number; nombre: string }>("zonas").filas ?? [];
  const [f, setF] = useState<Form | null>(id || consulta ? null : vacio(p.get("fecha") ?? hoyLocal(), p.get("hora")));
  const [error, setError] = useState<string | null>(null);
  const [errorApi, setErrorApi] = useState<ErrorApi | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [ubicando, setUbicando] = useState<string | null>(null);
  const [otraLocalidad, setOtraLocalidad] = useState(false);

  // Editar un trabajo existente.
  useEffect(() => {
    if (!id) return;
    adminApi<TrabajoDetalle>(`/trabajos/${id}`)
      .then((t) => {
        setF(desdeTrabajo(t));
        setOtraLocalidad(!t.zonaId && Boolean(t.localidadOtra));
      })
      .catch((e) => setError(mensajeError(e)));
  }, [id]);

  // "Agendar" desde una consulta del sitio: se precargan los datos del cliente.
  useEffect(() => {
    if (id || !consulta || !servicios.length || !zonas.length) return;
    type Consulta = { id: number; nombre: string; telefono: string; localidad: string | null; servicio: string | null; mensaje: string | null };
    adminApi<Consulta>(`/consultas/${consulta}`)
      .then((c) => {
        const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
        const zona = zonas.find((z) => c.localidad && norm(z.nombre) === norm(c.localidad));
        const servicio = servicios.find((s) => c.servicio && norm(s.nombre).startsWith(norm(c.servicio).slice(0, 8)));
        setF({
          ...vacio(p.get("fecha") ?? hoyLocal(), p.get("hora")),
          titulo: servicio?.nombre ?? c.servicio ?? "",
          servicioId: servicio?.id ?? null,
          clienteNombre: c.nombre,
          clienteTelefono: c.telefono,
          zonaId: zona?.id ?? null,
          localidadOtra: zona ? "" : (c.localidad ?? ""),
          descripcion: c.mensaje ?? "",
          consultaId: c.id,
        });
        setOtraLocalidad(!zona && Boolean(c.localidad));
      })
      .catch((e) => setError(mensajeError(e)));
    // p es estable; las listas disparan el efecto cuando llegan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, consulta, servicios.length, zonas.length]);

  if (!f) return error ? <MensajeError texto={error} /> : <Cargando />;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => (x ? { ...x, [k]: v } : x));

  async function leerLinkMaps(url: string) {
    const limpio = url.trim();
    if (!limpio) return set("mapsUrl", "");
    if (!esLinkMaps(limpio)) {
      setUbicando("Ese link no parece de Google Maps.");
      return;
    }
    const directo = leerCoordenadasMaps(limpio);
    if (directo) {
      setF((x) => (x ? { ...x, mapsUrl: limpio, ...directo } : x));
      setUbicando(null);
      return;
    }
    if (esLinkCortoMaps(limpio) || /google\./.test(limpio)) {
      setUbicando("Buscando la ubicación del link...");
      try {
        const r = await adminApi<{ lat: number; lng: number }>("/trabajos/maps", { method: "POST", body: JSON.stringify({ url: limpio }) });
        setF((x) => (x ? { ...x, mapsUrl: limpio, lat: r.lat, lng: r.lng } : x));
        setUbicando(null);
      } catch {
        setF((x) => (x ? { ...x, mapsUrl: limpio } : x));
        setUbicando("Guardamos el link, pero no pudimos leer la ubicación exacta. 'Cómo llegar' usará la dirección.");
      }
    }
  }

  function usarMiUbicacion() {
    if (!("geolocation" in navigator)) return setUbicando("Este dispositivo no permite usar la ubicación.");
    setUbicando("Buscando tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setF((x) => (x ? { ...x, lat, lng, mapsUrl: `https://www.google.com/maps?q=${lat},${lng}` } : x));
        setUbicando(null);
      },
      () => setUbicando("No pudimos obtener tu ubicación. Revisá el permiso de ubicación del navegador."),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!f) return;
    setError(null);
    setErrorApi(null);
    const precioCentavos = f.precio.trim() ? pesosACentavos(f.precio) : null;
    if (f.precio.trim() && precioCentavos == null) return setError("El precio no es un número válido.");
    const inicio = f.todoElDia ? aIso(f.fechaDesde) : aIso(f.fechaDesde, f.horaDesde);
    // Fin exclusivo para "todo el día": el día siguiente al último.
    const fin = f.todoElDia ? aIso(sumarDias(f.fechaHasta < f.fechaDesde ? f.fechaDesde : f.fechaHasta, 1)) : aIso(f.fechaHasta, f.horaHasta);
    if (new Date(fin) < new Date(inicio)) return setError("El fin no puede ser antes del inicio.");

    const cuerpo = {
      titulo: f.titulo || servicios.find((s) => s.id === f.servicioId)?.nombre || "Trabajo",
      servicioId: f.servicioId,
      estado: f.estado,
      clienteNombre: f.clienteNombre,
      clienteTelefono: f.clienteTelefono,
      direccion: f.direccion,
      zonaId: otraLocalidad ? null : f.zonaId,
      localidadOtra: otraLocalidad ? f.localidadOtra : "",
      mapsUrl: f.mapsUrl || null,
      lat: f.lat,
      lng: f.lng,
      todoElDia: f.todoElDia,
      inicio,
      fin,
      recordatorioMin: f.todoElDia ? null : f.recordatorioMin,
      precioCentavos,
      quienVa: f.quienVa,
      descripcion: f.descripcion,
      notas: f.notas,
      fotos: f.fotos,
      consultaId: f.consultaId,
    };
    setGuardando(true);
    try {
      const t = await adminApi<{ id: number }>(id ? `/trabajos/${id}` : "/trabajos", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(cuerpo),
      });
      router.push(`/admin/agenda?trabajo=${t.id}`);
    } catch (e) {
      setError(mensajeError(e));
      if (e instanceof ErrorApi) setErrorApi(e);
      setGuardando(false);
    }
  }

  const zonaNombre = zonas.find((z) => z.id === f.zonaId)?.nombre;

  return (
    <form onSubmit={guardar} className="max-w-2xl space-y-6 pb-8">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => router.back()} className="ios-boton-texto -ml-3">
          ‹ Volver
        </button>
        <Boton type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </Boton>
      </div>
      <h1 className="ios-titulo-grande">{id ? "Editar trabajo" : "Nuevo trabajo"}</h1>
      {f.consultaId && !id && <p className="ios-secundario -mt-4">Con los datos de la consulta del sitio.</p>}
      <MensajeError texto={error} />

      <Seccion titulo="Trabajo">
        <Campo etiqueta="Tipo de trabajo">
          <select
            className={claseInput}
            value={f.servicioId ?? ""}
            onChange={(e) => {
              const servicioId = e.target.value ? Number(e.target.value) : null;
              const anterior = servicios.find((s) => s.id === f.servicioId)?.nombre;
              const nuevo = servicios.find((s) => s.id === servicioId)?.nombre ?? "";
              setF((x) => (x ? { ...x, servicioId, titulo: !x.titulo || x.titulo === anterior ? nuevo : x.titulo } : x));
            }}
          >
            <option value="">Elegí un tipo…</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Título" error={errorDe(errorApi, "titulo")} ayuda="Ej.: Cambio de tablero, Cámaras en el local">
          <input className={claseInput} value={f.titulo} onChange={(e) => set("titulo", e.target.value)} />
        </Campo>
        <Campo etiqueta="Estado">
          <select className={claseInput} value={f.estado} onChange={(e) => set("estado", e.target.value as EstadoTrabajo)}>
            {ESTADOS_TRABAJO.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </Seccion>

      <Seccion titulo="Cliente">
        <Campo etiqueta="Nombre" error={errorDe(errorApi, "clienteNombre")}>
          <input className={claseInput} value={f.clienteNombre} onChange={(e) => set("clienteNombre", e.target.value)} autoComplete="off" required />
        </Campo>
        <Campo etiqueta="Teléfono">
          <input className={claseInput} type="tel" inputMode="tel" value={f.clienteTelefono} onChange={(e) => set("clienteTelefono", e.target.value)} placeholder="351 555 1234" />
        </Campo>
      </Seccion>

      <Seccion titulo="Lugar">
        <Campo etiqueta="Dirección">
          <input className={claseInput} value={f.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Calle y número" />
        </Campo>
        <Campo etiqueta="Localidad">
          <select
            className={claseInput}
            value={otraLocalidad ? "otra" : (f.zonaId ?? "")}
            onChange={(e) => {
              if (e.target.value === "otra") return setOtraLocalidad(true);
              setOtraLocalidad(false);
              set("zonaId", e.target.value ? Number(e.target.value) : null);
            }}
          >
            <option value="">Elegí la localidad…</option>
            {zonas.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre}
              </option>
            ))}
            <option value="otra">Otra…</option>
          </select>
        </Campo>
        {otraLocalidad && (
          <Campo etiqueta="¿Cuál?">
            <input className={claseInput} value={f.localidadOtra} onChange={(e) => set("localidadOtra", e.target.value)} />
          </Campo>
        )}
        <Campo etiqueta="Link de Google Maps (opcional)" ayuda="En Maps: Compartir → Copiar vínculo, y pegalo acá.">
          <input
            className={claseInput}
            type="url"
            inputMode="url"
            value={f.mapsUrl}
            onChange={(e) => set("mapsUrl", e.target.value)}
            onBlur={(e) => leerLinkMaps(e.target.value)}
            onPaste={(e) => {
              const pegado = e.clipboardData.getData("text");
              setTimeout(() => leerLinkMaps(pegado), 0);
            }}
            placeholder="https://maps.app.goo.gl/..."
          />
        </Campo>
        <div className="ios-fila">
          <button type="button" onClick={usarMiUbicacion} className="ios-boton-texto -ml-3">
            📍 Usar mi ubicación actual
          </button>
          {f.lat != null && (
            <button type="button" onClick={() => setF((x) => (x ? { ...x, lat: null, lng: null, mapsUrl: "" } : x))} className="ios-boton-texto ml-auto text-[var(--ios-rojo)]">
              Quitar ubicación
            </button>
          )}
        </div>
        {(ubicando || f.lat != null) && (
          <div className="px-4 pb-3">
            {ubicando && (
              <p role="status" className="text-sm ios-secundario mb-2">
                {ubicando}
              </p>
            )}
            {f.lat != null && f.lng != null && (
              <iframe
                title={`Ubicación${zonaNombre ? ` en ${zonaNombre}` : ""}`}
                src={linkMapaEmbebido({ lat: f.lat, lng: f.lng })}
                className="w-full h-40 rounded-xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Cuándo">
        <Interruptor activo={f.todoElDia} onChange={(v) => set("todoElDia", v)} etiqueta="Todo el día" descripcion="Para trabajos de uno o varios días completos" />
        {f.todoElDia ? (
          <div className="grid grid-cols-2">
            <Campo etiqueta="Desde">
              <input
                className={claseInput}
                type="date"
                value={f.fechaDesde}
                onChange={(e) => setF((x) => (x ? { ...x, fechaDesde: e.target.value, fechaHasta: x.fechaHasta < e.target.value ? e.target.value : x.fechaHasta } : x))}
                required
              />
            </Campo>
            <Campo etiqueta="Hasta (incluido)">
              <input className={claseInput} type="date" value={f.fechaHasta} min={f.fechaDesde} onChange={(e) => set("fechaHasta", e.target.value)} required />
            </Campo>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2">
              <Campo etiqueta="Empieza">
                <input
                  className={claseInput}
                  type="date"
                  value={f.fechaDesde}
                  onChange={(e) => setF((x) => (x ? { ...x, fechaDesde: e.target.value, fechaHasta: x.fechaHasta < e.target.value ? e.target.value : x.fechaHasta } : x))}
                  required
                />
              </Campo>
              <Campo etiqueta="Hora">
                <input className={claseInput} type="time" value={f.horaDesde} onChange={(e) => set("horaDesde", e.target.value)} required />
              </Campo>
            </div>
            <div className="grid grid-cols-2">
              <Campo etiqueta="Termina" error={errorDe(errorApi, "fin")}>
                <input className={claseInput} type="date" value={f.fechaHasta} min={f.fechaDesde} onChange={(e) => set("fechaHasta", e.target.value)} required />
              </Campo>
              <Campo etiqueta="Hora">
                <input className={claseInput} type="time" value={f.horaHasta} onChange={(e) => set("horaHasta", e.target.value)} required />
              </Campo>
            </div>
            <Campo etiqueta="Avisarme">
              <select className={claseInput} value={f.recordatorioMin ?? ""} onChange={(e) => set("recordatorioMin", e.target.value ? Number(e.target.value) : null)}>
                {AVISOS.map((a) => (
                  <option key={a.valor} value={a.valor}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </Campo>
          </>
        )}
      </Seccion>

      <Seccion titulo="Plata y equipo">
        <Campo etiqueta="Precio acordado ($)" ayuda="Lo que se le va a cobrar. Los pagos (seña, saldo) se cargan después en el trabajo.">
          <input className={claseInput} inputMode="decimal" value={f.precio} onChange={(e) => set("precio", e.target.value)} placeholder="150000" />
        </Campo>
        <Campo etiqueta="¿Quién va?">
          <input className={claseInput} value={f.quienVa} onChange={(e) => set("quienVa", e.target.value)} placeholder="Franco" />
        </Campo>
      </Seccion>

      <Seccion titulo="Detalle">
        <Campo etiqueta="Trabajo a realizar">
          <textarea className={claseInput} rows={4} value={f.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Qué hay que hacer, materiales, observaciones..." />
        </Campo>
        <Campo etiqueta="Notas privadas">
          <textarea className={claseInput} rows={2} value={f.notas} onChange={(e) => set("notas", e.target.value)} placeholder="No se publican nunca" />
        </Campo>
      </Seccion>

      <section aria-label="Fotos">
        <h2 className="ios-encabezado-lista">Fotos</h2>
        <div className="ios-card p-3">
          <FotosEditor fotos={f.fotos} onChange={(fotos) => set("fotos", fotos)} carpeta="trabajos" altPorDefecto={f.titulo} />
        </div>
      </section>

      <Boton type="submit" disabled={guardando} className="w-full">
        {guardando ? "Guardando..." : "Guardar"}
      </Boton>
    </form>
  );
}

export default function EditarTrabajo() {
  return (
    <Suspense fallback={<Cargando />}>
      <Editor />
    </Suspense>
  );
}
