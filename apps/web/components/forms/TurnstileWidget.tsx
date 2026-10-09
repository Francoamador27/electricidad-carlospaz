"use client";

import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (el: HTMLElement, opciones: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let cargando: Promise<void> | null = null;
function cargarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  cargando ??= new Promise((ok, mal) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => ok();
    s.onerror = () => mal(new Error("No cargó Turnstile"));
    document.head.appendChild(s);
  });
  return cargando;
}

// Widget de Cloudflare Turnstile en modo explícito: funciona aunque se llegue a la página
// navegando (el modo automático solo detecta los widgets en la primera carga).
// Deja el token en un input oculto "cf-turnstile-response" para los formularios.
export default function TurnstileWidget({ onToken, reiniciar }: { onToken?: (t: string) => void; reiniciar?: number }) {
  const caja = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const callback = useRef(onToken);
  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!SITE_KEY || !caja.current) return;
    let vivo = true;
    cargarScript()
      .then(() => {
        if (!vivo || !caja.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(caja.current, {
          sitekey: SITE_KEY,
          language: "es",
          size: "flexible",
          callback: (t: string) => (setToken(t), callback.current?.(t)),
          "expired-callback": () => (setToken(""), callback.current?.("")),
        });
      })
      .catch(() => undefined);
    return () => {
      vivo = false;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  // Un token sirve una sola vez: después de cada envío se pide uno nuevo.
  useEffect(() => {
    if (reiniciar && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      setToken("");
    }
  }, [reiniciar]);

  if (!SITE_KEY) return null;
  return (
    <>
      <div ref={caja} />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
    </>
  );
}
