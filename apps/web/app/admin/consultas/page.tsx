"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { linkWhatsappCliente } from "@voltis/shared/agenda";
import { Segmentado } from "@/components/admin/ios";
import { Boton, Cargando, MensajeError, Titulo } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";

type Consulta = {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  localidad: string | null;
  servicio: string | null;
  tipoPropiedad: string | null;
  urgencia: string | null;
  mensaje: string | null;
  paginaOrigen: string | null;
  atribucion: Record<string, string> | null;
  createdAt: string;
};

// Clic en un botón de WhatsApp o teléfono del sitio: no trae nombre ni número.
type Clic = {
  id: number;
  tipo: "click_whatsapp" | "click_telefono";
  pagina: string | null;
  servicio: string | null;
  zona: string | null;
  atribucion: Record<string, string> | null;
  createdAt: string;
};

type Filtro = "todas" | "formulario" | "click_whatsapp" | "click_telefono";
const FILTROS: { valor: Filtro; nombre: string }[] = [
  { valor: "todas", nombre: "Todas" },
  { valor: "formulario", nombre: "Formularios" },
  { valor: "click_whatsapp", nombre: "WhatsApp" },
  { valor: "click_telefono", nombre: "Llamadas" },
];

const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Cordoba",
  });

const URGENCIA: Record<string, string> = {
  normal: "Normal",
  urgent: "Urgente",
  emergency: "Emergencia",
};

function origen(a: Record<string, string> | null) {
  if (!a) return "Directo / orgánico";
  if (a.gclid || a.gbraid || a.wbraid) return "Google Ads";
  return (
    [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ") ||
    "Directo / orgánico"
  );
}

function linkResponder(c: Consulta) {
  return linkWhatsappCliente(
    c.telefono,
    `Hola ${c.nombre.split(" ")[0]}, te escribimos de Voltis por tu consulta.`,
  );
}

export default function ConsultasPage() {
  const [filas, setFilas] = useState<Consulta[] | null>(null);
  const [clics, setClics] = useState<Clic[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<Consulta[]>("/consultas")
      .then(setFilas)
      .catch((e) => setError(mensajeError(e)));
    // Si fallan los clics, las consultas se ven igual.
    adminApi<Clic[]>("/eventos")
      .then((c) => setClics(Array.isArray(c) ? c : []))
      .catch(() => setClics([]));
  }, []);

  // Formularios y clics juntos, del más nuevo al más viejo.
  const items = [
    ...(filas ?? []).map((c) => ({
      clave: `f${c.id}`,
      fecha: c.createdAt,
      tipo: "formulario" as const,
      consulta: c,
    })),
    ...clics.map((c) => ({
      clave: `c${c.id}`,
      fecha: c.createdAt,
      tipo: c.tipo,
      clic: c,
    })),
  ]
    .filter((i) => filtro === "todas" || i.tipo === filtro)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  async function borrar(c: Consulta) {
    if (!confirm(`¿Borrar la consulta de ${c.nombre}? No se puede deshacer.`))
      return;
    try {
      await adminApi(`/consultas/${c.id}`, { method: "DELETE" });
      setFilas((f) => f?.filter((x) => x.id !== c.id) ?? null);
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  return (
    <div className="max-w-6xl">
      <Titulo>Consultas</Titulo>
      <MensajeError texto={error} />
      {!filas && !error && <Cargando />}
      {filas && (
        <div className="mb-4">
          <Segmentado
            etiqueta="Tipo de contacto"
            opciones={FILTROS}
            valor={filtro}
            onChange={setFiltro}
          />
        </div>
      )}
      {filas &&
        (filtro === "click_whatsapp" || filtro === "click_telefono") && (
          <p className="mb-3 text-sm ios-secundario">
            Son personas que tocaron el botón en el sitio. El sitio no ve el
            número: el mensaje o la llamada te llega directo al{" "}
            {filtro === "click_whatsapp" ? "WhatsApp" : "teléfono"}.
          </p>
        )}
      {filas && items.length === 0 && (
        <p className="text-slate-600">Todavía no hay contactos.</p>
      )}

      <div className="space-y-3">
        {filas &&
          items.map((i) =>
            i.tipo === "formulario" ? (
              <TarjetaConsulta
                key={i.clave}
                c={i.consulta!}
                onBorrar={borrar}
              />
            ) : (
              <TarjetaClic key={i.clave} c={i.clic!} />
            ),
          )}
      </div>
    </div>
  );
}

function TarjetaClic({ c }: { c: Clic }) {
  const whatsapp = c.tipo === "click_whatsapp";
  return (
    <article className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-start gap-3">
      <span aria-hidden="true" className="text-xl leading-none mt-0.5">
        {whatsapp ? "💬" : "📞"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">
          {whatsapp ? "Tocó WhatsApp" : "Tocó Llamar"}
        </p>
        <p className="text-sm text-slate-600 truncate">
          {[c.servicio, c.zona, c.pagina && `desde ${c.pagina}`]
            .filter(Boolean)
            .join(" · ") || "Sin página"}
        </p>
      </div>
      <div className="text-right text-xs text-slate-500 shrink-0">
        <p>{fechaHora(c.createdAt)}</p>
        <p>{origen(c.atribucion)}</p>
      </div>
    </article>
  );
}

function TarjetaConsulta({
  c,
  onBorrar,
}: {
  c: Consulta;
  onBorrar: (c: Consulta) => void;
}) {
  return (
    <article
      key={c.id}
      className="bg-white border border-slate-200 rounded-lg p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {c.nombre}
            {c.urgencia && c.urgencia !== "normal" && (
              <span className="ml-2 text-xs font-bold rounded px-2 py-0.5 bg-red-100 text-red-800">
                {URGENCIA[c.urgencia] ?? c.urgencia}
              </span>
            )}
          </p>
          <p className="text-sm text-slate-600">
            {c.telefono}
            {c.email && <> · {c.email}</>}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{fechaHora(c.createdAt)}</p>
          <p>{origen(c.atribucion)}</p>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
        {c.localidad && (
          <div>
            <dt className="inline text-slate-500">Localidad: </dt>
            <dd className="inline">{c.localidad}</dd>
          </div>
        )}
        {c.servicio && (
          <div>
            <dt className="inline text-slate-500">Servicio: </dt>
            <dd className="inline">{c.servicio}</dd>
          </div>
        )}
        {c.paginaOrigen && (
          <div>
            <dt className="inline text-slate-500">Página: </dt>
            <dd className="inline">{c.paginaOrigen}</dd>
          </div>
        )}
      </dl>
      {c.mensaje && (
        <p className="mt-3 text-sm text-slate-800 whitespace-pre-line">
          {c.mensaje}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={linkResponder(c)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center min-h-11 bg-green-700 text-white font-semibold text-[15px] rounded-xl px-4 active:opacity-70"
        >
          Responder por WhatsApp
        </a>
        <Link
          href={`/admin/agenda/editar?consulta=${c.id}`}
          className="inline-flex items-center min-h-11 bg-[var(--ios-acento)] text-[var(--ios-acento-texto)] font-semibold text-[15px] rounded-xl px-4 active:opacity-70"
        >
          📅 Agendar
        </Link>
        <a
          href={`tel:${c.telefono.replace(/[^\d+]/g, "")}`}
          className="inline-flex items-center min-h-11 bg-[var(--ios-relleno)] text-[var(--ios-acento)] font-semibold text-[15px] rounded-xl px-4 active:opacity-70"
        >
          Llamar
        </a>
        <Boton
          variante="peligro"
          onClick={() => onBorrar(c)}
          className="ml-auto"
        >
          Borrar
        </Boton>
      </div>
    </article>
  );
}
