"use client";

import { usePathname } from "next/navigation";
import { LINK_TELEFONO, NEGOCIO, linkWhatsapp, mensajeWhatsappDeRuta } from "@voltis/shared/negocio";
import { IconoTelefono, IconoWhatsapp } from "@/components/ui/Iconos";

// Barra fija en mobile y botones flotantes en desktop. Link directo, sin formulario previo.
// El clic lo mide TrackingListener.
export default function WhatsAppButton() {
  const whatsapp = linkWhatsapp(mensajeWhatsappDeRuta(usePathname()));

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 pb-[env(safe-area-inset-bottom)] bg-ink shadow-[0_-2px_12px_rgba(0,0,0,0.2)]">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="font-display h-16 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold"
        >
          <IconoWhatsapp />
          WhatsApp
        </a>
        <a
          href={LINK_TELEFONO}
          aria-label={`Llamar al ${NEGOCIO.telefonoVisible}`}
          className="font-display h-16 flex items-center justify-center gap-2 bg-copper-dark text-white font-semibold"
        >
          <IconoTelefono />
          Llamar
        </a>
      </div>

      <div className="hidden md:flex flex-col gap-3 fixed bottom-6 right-6 z-50">
        <a
          href={LINK_TELEFONO}
          aria-label={`Llamar al ${NEGOCIO.telefonoVisible}`}
          className="bg-copper-dark hover:bg-copper-darker text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-110"
        >
          <IconoTelefono className="w-6 h-6" />
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="bg-green-700 hover:bg-green-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-110"
        >
          <IconoWhatsapp className="w-7 h-7" />
        </a>
      </div>
    </>
  );
}
