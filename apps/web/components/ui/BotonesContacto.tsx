import { LINK_TELEFONO, linkWhatsapp } from "@voltis/shared/negocio";
import { IconoTelefono, IconoWhatsapp } from "@/components/ui/Iconos";

const base =
  "font-display inline-flex items-center justify-center gap-2 font-semibold rounded-sm px-7 py-4 text-base transition hover:scale-[1.03] active:scale-[0.97]";

// WhatsApp (principal) y Llamar. Los clics los mide TrackingListener.
export default function BotonesContacto({
  mensaje,
  className = "",
}: {
  mensaje: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={linkWhatsapp(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-green-700 hover:bg-green-800 text-white`}
      >
        <IconoWhatsapp />
        WhatsApp
      </a>
      <a href={LINK_TELEFONO} className={`${base} bg-copper-dark hover:bg-copper-darker text-white`}>
        <IconoTelefono />
        Llamar
      </a>
    </div>
  );
}
