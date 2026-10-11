"use client";

import { useEffect, useState } from "react";
import { Tarjeta } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";

// Calendario suscribible: los trabajos aparecen en la app Calendario del iPhone (o Google
// Calendar), con alarmas y widgets. La dirección es secreta: si se filtra, se regenera.
export default function CalendarioIphone() {
  const [url, setUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<{ url: string }>("/calendario")
      .then((r) => setUrl(r.url))
      .catch((e) => setError(mensajeError(e)));
  }, []);

  async function copiar() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setError("No se pudo copiar. Mantené apretado el link para copiarlo.");
    }
  }

  async function regenerar() {
    if (!confirm("¿Generar un link nuevo? El anterior deja de funcionar y vas a tener que volver a suscribirte en cada calendario.")) return;
    try {
      setUrl((await adminApi<{ url: string }>("/calendario/regenerar", { method: "POST" })).url);
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  const webcal = url?.replace(/^https?:/, "webcal:");

  return (
    <Tarjeta className="space-y-3">
      <h2 className="font-semibold text-[17px]">Agenda en el Calendario del iPhone</h2>
      <p className="text-sm ios-secundario">
        Los trabajos aparecen en la app Calendario, con alarmas, Siri y widgets. Se actualiza solo. Para cargar o
        editar trabajos se usa el panel.
      </p>
      {error && (
        <p role="alert" className="text-sm text-[var(--ios-rojo)]">
          {error}
        </p>
      )}
      {url && webcal && (
        <>
          <a href={webcal} className="ios-boton w-full">
            Suscribirme en el Calendario
          </a>
          <details className="text-sm">
            <summary className="cursor-pointer ios-secundario">Otras opciones (Google Calendar, copiar link)</summary>
            <div className="mt-2 space-y-2">
              <p className="break-all rounded-xl bg-[var(--ios-relleno)] px-3 py-2 font-mono text-[12px]">{url}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copiar} className="ios-boton-texto -ml-3">
                  {copiado ? "¡Copiado!" : "Copiar link"}
                </button>
                <button type="button" onClick={regenerar} className="ios-boton-texto text-[var(--ios-rojo)]">
                  Generar link nuevo
                </button>
              </div>
              <p className="ios-secundario">
                Google Calendar (en la compu): Otros calendarios → Desde URL → pegá el link. El link es privado: no lo
                compartas.
              </p>
            </div>
          </details>
        </>
      )}
    </Tarjeta>
  );
}
