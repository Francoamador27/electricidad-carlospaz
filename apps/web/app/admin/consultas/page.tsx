"use client";

import { useEffect, useState } from "react";
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

const URGENCIA: Record<string, string> = { normal: "Normal", urgent: "Urgente", emergency: "Emergencia" };

function origen(a: Record<string, string> | null) {
  if (!a) return "Directo / orgánico";
  if (a.gclid || a.gbraid || a.wbraid) return "Google Ads";
  return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ") || "Directo / orgánico";
}

// Número argentino a formato wa.me: 351 1234567 -> 5493511234567.
function linkResponder(c: Consulta) {
  let n = c.telefono.replace(/\D/g, "");
  if (n.startsWith("0")) n = n.slice(1);
  if (!n.startsWith("54")) n = `549${n}`;
  const texto = `Hola ${c.nombre.split(" ")[0]}, te escribimos de Voltis por tu consulta.`;
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}

export default function ConsultasPage() {
  const [filas, setFilas] = useState<Consulta[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<Consulta[]>("/consultas")
      .then(setFilas)
      .catch((e) => setError(mensajeError(e)));
  }, []);

  async function borrar(c: Consulta) {
    if (!confirm(`¿Borrar la consulta de ${c.nombre}? No se puede deshacer.`)) return;
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
      {filas?.length === 0 && <p className="text-slate-600">Todavía no hay consultas.</p>}

      <div className="space-y-3">
        {filas?.map((c) => (
          <article key={c.id} className="bg-white border border-slate-200 rounded-lg p-4">
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
                <p>{new Date(c.createdAt).toLocaleString("es-AR", { timeZone: "America/Argentina/Cordoba" })}</p>
                <p>{origen(c.atribucion)}</p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
              {c.localidad && (
                <div><dt className="inline text-slate-500">Localidad: </dt><dd className="inline">{c.localidad}</dd></div>
              )}
              {c.servicio && (
                <div><dt className="inline text-slate-500">Servicio: </dt><dd className="inline">{c.servicio}</dd></div>
              )}
              {c.paginaOrigen && (
                <div><dt className="inline text-slate-500">Página: </dt><dd className="inline">{c.paginaOrigen}</dd></div>
              )}
            </dl>
            {c.mensaje && <p className="mt-3 text-sm text-slate-800 whitespace-pre-line">{c.mensaje}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={linkResponder(c)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded px-4 py-2"
              >
                Responder por WhatsApp
              </a>
              <a
                href={`tel:${c.telefono.replace(/[^\d+]/g, "")}`}
                className="bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-sm rounded px-4 py-2"
              >
                Llamar
              </a>
              <Boton variante="peligro" onClick={() => borrar(c)} className="ml-auto">
                Borrar
              </Boton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
