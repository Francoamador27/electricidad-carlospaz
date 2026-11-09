import FotoImg from "@/components/ui/FotoImg";
import { getFotoFranco } from "@/lib/contenido";

// La foto se cambia desde el panel: Más → Fotos de la portada.
// Si no hay ninguna cargada, se usa la foto real de Franco que viene con el sitio.
// El tamaño lo define `className`, así que al cambiarla no se mueve el diseño.
export default async function FotoFranco({
  className = "",
  sizes = "320px",
  prioridad,
}: {
  className?: string;
  sizes?: string;
  prioridad?: boolean;
}) {
  const foto = await getFotoFranco();
  if (foto) return <FotoImg foto={foto} sizes={sizes} prioridad={prioridad} className={`object-cover ${className}`} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/opt/reparando-espalda-768.webp"
      srcSet="/images/opt/reparando-espalda-480.webp 480w, /images/opt/reparando-espalda-768.webp 768w"
      sizes={sizes}
      alt="Franco trabajando en una instalación eléctrica en Carlos Paz"
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : undefined}
      decoding="async"
      className={`object-cover object-top ${className}`}
    />
  );
}
