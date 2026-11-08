import FotoImg from "@/components/ui/FotoImg";
import { getFotoFranco } from "@/lib/contenido";

// La foto se carga desde el panel: Más → Fotos de la portada.
// Hasta que haya una, se muestra un espacio con la inicial. El tamaño lo define `className`,
// así que al cambiarla no se mueve el diseño.
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
    <div
      role="img"
      aria-label="Espacio para la foto de Franco"
      className={`bg-dark-border text-parchment flex items-center justify-center font-display font-bold ${className}`}
    >
      <span aria-hidden="true">F</span>
    </div>
  );
}
