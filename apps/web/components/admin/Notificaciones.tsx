"use client";

import { useEffect, useState } from "react";
import { Tarjeta } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";

type Dispositivo = { id: number; endpoint: string; dispositivo: string | null; createdAt: string; ultimoEnvioAt: string | null };

function base64UrlABytes(base64: string): Uint8Array<ArrayBuffer> {
  const relleno = "=".repeat((4 - (base64.length % 4)) % 4);
  const binario = atob((base64 + relleno).replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(new ArrayBuffer(binario.length));
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

function nombreDispositivo(): string {
  const ua = navigator.userAgent;
  const so = /iPhone/.test(ua) ? "iPhone" : /iPad|Macintosh.*Mobile/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "Mac" : "Dispositivo";
  const nav = /CriOS|Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : /Firefox/.test(ua) ? "Firefox" : "";
  return [so, nav].filter(Boolean).join(" · ");
}

function esIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

function instalada(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export default function Notificaciones() {
  const [config, setConfig] = useState<{ configurado: boolean; clavePublica: string | null } | null>(null);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [miEndpoint, setMiEndpoint] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [soporte] = useState(() => typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
  const [iosSinInstalar] = useState(() => typeof window !== "undefined" && esIOS() && !instalada());

  function pedirDatos() {
    return Promise.all([
      adminApi<{ configurado: boolean; clavePublica: string | null }>("/push/clave"),
      adminApi<Dispositivo[]>("/push/dispositivos"),
    ]);
  }

  async function recargar() {
    const [c, d] = await pedirDatos();
    setConfig(c);
    setDispositivos(d);
  }

  useEffect(() => {
    pedirDatos()
      .then(([c, d]) => {
        setConfig(c);
        setDispositivos(d);
      })
      .catch((e) => setError(mensajeError(e)));
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration("/admin").then(async (reg) => {
        const sub = await reg?.pushManager.getSubscription();
        setMiEndpoint(sub?.endpoint ?? null);
      });
    }
  }, []);

  async function activar() {
    if (!config?.clavePublica) return;
    setOcupado(true);
    setError(null);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        setError("No diste permiso para las notificaciones. Podés activarlo desde los ajustes del navegador o del iPhone.");
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration("/admin");
      if (!reg) {
        setError("La app todavía no terminó de instalarse. Recargá la página y probá de nuevo.");
        return;
      }
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlABytes(config.clavePublica) }));
      const json = sub.toJSON();
      await adminApi("/push/suscribir", {
        method: "POST",
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys, dispositivo: nombreDispositivo() }),
      });
      setMiEndpoint(sub.endpoint);
      setEstado("Listo: este dispositivo recibe avisos de consultas nuevas, el resumen de las 7:00 y los recordatorios.");
      await recargar();
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setOcupado(false);
    }
  }

  async function quitar(d: Dispositivo) {
    if (!confirm(`¿Dejar de enviar avisos a "${d.dispositivo ?? "este dispositivo"}"?`)) return;
    try {
      await adminApi(`/push/dispositivos/${d.id}`, { method: "DELETE" });
      if (d.endpoint === miEndpoint) {
        const reg = await navigator.serviceWorker.getRegistration("/admin");
        await (await reg?.pushManager.getSubscription())?.unsubscribe();
        setMiEndpoint(null);
      }
      await recargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  async function probar() {
    setOcupado(true);
    setError(null);
    try {
      const r = await adminApi<{ enviados: number }>("/push/probar", { method: "POST" });
      setEstado(r.enviados ? `Enviada a ${r.enviados} ${r.enviados === 1 ? "dispositivo" : "dispositivos"}.` : "No hay dispositivos con avisos activos.");
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setOcupado(false);
    }
  }

  const activoAca = Boolean(miEndpoint && dispositivos.some((d) => d.endpoint === miEndpoint));

  return (
    <Tarjeta className="space-y-3">
      <h2 className="font-semibold text-[17px]">Notificaciones en el celular</h2>
      <p className="text-sm ios-secundario">
        Avisos de consultas nuevas, resumen de los trabajos del día a las 7:00 y recordatorio antes de cada trabajo.
      </p>

      {config && !config.configurado && (
        <p className="text-sm rounded-xl bg-amber-50 border border-amber-300 text-amber-900 px-3 py-2">
          Falta configurar las claves de notificaciones en el servidor (secretos VAPID del Worker).
        </p>
      )}
      {iosSinInstalar && (
        <p className="text-sm rounded-xl bg-[var(--ios-relleno)] px-3 py-2">
          En iPhone, primero instalá la app: en Safari tocá <strong>Compartir → Agregar a inicio</strong>, abrila desde el
          ícono y volvé a esta pantalla para activar los avisos.
        </p>
      )}
      {!soporte && !iosSinInstalar && (
        <p className="text-sm ios-secundario">Este navegador no permite notificaciones.</p>
      )}

      {soporte && config?.configurado && !iosSinInstalar && (
        <div className="flex flex-wrap gap-2">
          {!activoAca && (
            <button type="button" onClick={activar} disabled={ocupado} className="ios-boton disabled:opacity-50">
              Activar en este dispositivo
            </button>
          )}
          {dispositivos.length > 0 && (
            <button type="button" onClick={probar} disabled={ocupado} className="ios-boton-texto">
              Enviar una prueba
            </button>
          )}
        </div>
      )}

      {estado && (
        <p role="status" className="text-sm text-[var(--ios-verde)]">
          {estado}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-[var(--ios-rojo)]">
          {error}
        </p>
      )}

      {dispositivos.length > 0 && (
        <div className="ios-lista bg-[var(--ios-relleno)]">
          {dispositivos.map((d) => (
            <div key={d.id} className="ios-fila">
              <span className="flex-1">
                {d.dispositivo ?? "Dispositivo"}
                {d.endpoint === miEndpoint && <span className="ios-secundario"> (este)</span>}
                <span className="block text-[12px] ios-secundario">
                  Activado el {new Date(d.createdAt).toLocaleDateString("es-AR")}
                </span>
              </span>
              <button type="button" onClick={() => quitar(d)} className="ios-boton-texto text-[var(--ios-rojo)] -mr-3">
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </Tarjeta>
  );
}
