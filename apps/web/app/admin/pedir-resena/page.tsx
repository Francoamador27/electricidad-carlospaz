"use client";

import { useEffect, useState } from "react";
import { linkWhatsappCliente } from "@voltis/shared/agenda";
import { LINK_RESENA_GOOGLE, textoPedirResena } from "@voltis/shared/negocio";
import QrResena from "@/components/admin/QrResena";
import { Boton, Campo, Tarjeta, Titulo, claseInput } from "@/components/admin/ui";

export default function PedirResena() {
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [copiado, setCopiado] = useState(false);

  // Con el QR en pantalla completa la pantalla no se apaga mientras el cliente lo escanea.
  useEffect(() => {
    if (!pantallaCompleta) return;
    let bloqueo: WakeLockSentinel | undefined;
    navigator.wakeLock?.request("screen").then((b) => (bloqueo = b)).catch(() => undefined);
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && setPantallaCompleta(false);
    window.addEventListener("keydown", alTeclear);
    return () => {
      bloqueo?.release().catch(() => undefined);
      window.removeEventListener("keydown", alTeclear);
    };
  }, [pantallaCompleta]);

  const texto = textoPedirResena(nombre);
  // Sin teléfono, WhatsApp abre la lista de contactos para elegir a quién mandarlo.
  const linkWhatsapp = telefono.replace(/\D/g, "").length >= 8
    ? linkWhatsappCliente(telefono, texto)
    : `https://wa.me/?text=${encodeURIComponent(texto)}`;

  async function copiar(contenido: string) {
    try {
      await navigator.clipboard.writeText(contenido);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      prompt("Copiá el texto:", contenido);
    }
  }

  // Menú de compartir del sistema (Instagram, mail, SMS...). Sin soporte, copia el mensaje.
  function compartir() {
    if (typeof navigator.share === "function") navigator.share({ title: "Dejanos tu opinión", text: texto }).catch(() => undefined);
    else copiar(texto);
  }

  return (
    <div className="max-w-xl">
      <Titulo>Pedir reseña</Titulo>
      <p className="text-sm ios-secundario mb-6">
        Al terminar un trabajo, mostrale el QR al cliente para que deje su opinión en Google en el momento, o mandale el
        link por WhatsApp.
      </p>

      <Tarjeta className="mb-6">
        <h2 className="font-semibold mb-3">Escanear el QR</h2>
        <button
          type="button"
          onClick={() => setPantallaCompleta(true)}
          className="block mx-auto w-56 max-w-full rounded-xl overflow-hidden active:opacity-70"
          aria-label="Mostrar el QR en pantalla completa"
        >
          <QrResena className="w-full h-auto" />
        </button>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Boton type="button" onClick={() => setPantallaCompleta(true)}>Mostrar en pantalla completa</Boton>
          <a href="/qr-opiniones.png" download="qr-opiniones-voltis.png" className="inline-flex items-center font-semibold text-[15px] rounded-xl px-4 min-h-11 bg-[var(--ios-relleno)] text-[var(--ios-acento)] active:opacity-70">
            Descargar para imprimir
          </a>
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-semibold mb-3">Enviar por WhatsApp</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Campo label="Nombre del cliente (opcional)">
            <input className={claseInput} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="off" />
          </Campo>
          <Campo label="Celular (opcional)" ayuda="Si lo dejás vacío, elegís el contacto en WhatsApp.">
            <input className={claseInput} type="tel" inputMode="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="351 555-1234" />
          </Campo>
        </div>
        <p className="text-sm whitespace-pre-line rounded-xl bg-[var(--ios-relleno)] p-3 mb-4 break-words">{texto}</p>
        <div className="flex flex-wrap gap-2">
          <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-semibold text-[15px] rounded-xl px-4 min-h-11 bg-[#25d366] text-white active:opacity-70">
            Enviar por WhatsApp
          </a>
          <Boton type="button" variante="secundario" onClick={compartir}>Compartir…</Boton>
          <Boton type="button" variante="secundario" onClick={() => copiar(LINK_RESENA_GOOGLE)}>{copiado ? "¡Copiado!" : "Copiar link"}</Boton>
        </div>
      </Tarjeta>

      {pantallaCompleta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR para dejar una reseña"
          onClick={() => setPantallaCompleta(false)}
          className="fixed inset-0 z-[100] bg-white text-black flex flex-col items-center justify-center gap-6 p-6"
        >
          <p className="text-2xl font-bold text-center">¿Nos dejás tu opinión?</p>
          <QrResena className="w-full max-w-[min(85vw,70vh)] h-auto" />
          <p className="text-center text-base text-slate-600">
            Escaneá el código con la cámara del celular
            <br />
            <span className="text-sm">Tocá en cualquier lugar para cerrar</span>
          </p>
        </div>
      )}
    </div>
  );
}
