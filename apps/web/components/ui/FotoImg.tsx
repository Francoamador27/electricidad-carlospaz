import type { Foto } from "@voltis/db/schema";
import { srcFoto, srcSetFoto } from "@/lib/fotos";

type Props = {
  foto: Foto;
  sizes?: string;
  className?: string;
  prioridad?: boolean;
};

// <img> con srcset desde /img/ del Worker (export estático: sin optimización de next/image).
export default function FotoImg({ foto, sizes = "100vw", className, prioridad }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcFoto(foto)}
      srcSet={srcSetFoto(foto)}
      sizes={srcSetFoto(foto) ? sizes : undefined}
      width={foto.ancho}
      height={foto.alto}
      alt={foto.alt}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
