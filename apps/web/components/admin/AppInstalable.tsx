"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Registra el service worker del panel y ofrece instalarlo como app.
// - Android/Chrome: botón "Instalar" (evento beforeinstallprompt).
// - iPhone/iPad: Safari no tiene ese evento; se muestran los pasos "Compartir → Agregar a inicio".

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const CLAVE_DESCARTADO = "voltis-panel-instalar-descartado";

function yaInstalada(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function esIOS(): boolean {
  const ua = navigator.userAgent;
  // iPadOS se presenta como Mac con pantalla táctil.
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

function leerDescartado(): boolean {
  try {
    return localStorage.getItem(CLAVE_DESCARTADO) === "1";
  } catch {
    return false;
  }
}

const sinSuscripcion = () => () => undefined;

export default function AppInstalable() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [descartado, setDescartado] = useState(false);
  // En el HTML generado (servidor) es false; en el navegador se calcula. Sin desajustes al hidratar.
  const iosSinInstalar = useSyncExternalStore(
    sinSuscripcion,
    () => esIOS() && !yaInstalada() && !leerDescartado(),
    () => false,
  );
  const mostrarIOS = iosSinInstalar && !descartado;

  useEffect(() => {
    // En `next dev` no se registra: el service worker interferiría con la recarga en caliente.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" }).catch(() => undefined);
    }
    if (yaInstalada() || leerDescartado()) return;

    const alOfrecer = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalar);
    };
    window.addEventListener("beforeinstallprompt", alOfrecer);
    return () => window.removeEventListener("beforeinstallprompt", alOfrecer);
  }, []);

  function descartar() {
    try {
      localStorage.setItem(CLAVE_DESCARTADO, "1");
    } catch {
      // Sin almacenamiento: el aviso vuelve a aparecer la próxima vez, no pasa nada.
    }
    setEvento(null);
    setDescartado(true);
  }

  async function instalar() {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice.catch(() => undefined);
    setEvento(null);
  }

  if (!evento && !mostrarIOS) return null;

  return (
    <section aria-label="Instalar la app" className="ios-card mb-6 p-4 flex gap-3 items-start">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/admin/iconos/icono-192.png" alt="" width={48} height={48} className="rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">Instalá Voltis en tu celular</p>
        {evento ? (
          <p className="ios-secundario text-sm mt-0.5">Se abre como una app, con su ícono en la pantalla de inicio.</p>
        ) : (
          <p className="ios-secundario text-sm mt-0.5">
            En Safari tocá <strong>Compartir</strong>{" "}
            <span aria-hidden="true" className="inline-block align-[-2px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
              </svg>
            </span>{" "}
            y después <strong>Agregar a inicio</strong>.
          </p>
        )}
        <div className="flex gap-2 mt-3">
          {evento && (
            <button type="button" onClick={instalar} className="ios-boton">
              Instalar
            </button>
          )}
          <button type="button" onClick={descartar} className="ios-boton-texto">
            Ahora no
          </button>
        </div>
      </div>
    </section>
  );
}
