import type { Metadata } from "next";

// Metadatos de cada página: título, descripción, canonical y las tarjetas de Open Graph y
// Twitter que se ven al compartir el link (WhatsApp, Facebook, X, LinkedIn).
// Next reemplaza entero el `openGraph` del layout cuando una página define el suyo, así que
// cada página arma el bloque completo con este helper en vez de heredar el de la home.

const MARCA = "Voltis";

export const IMAGEN_OG = {
  url: "/logo-voltis.png",
  width: 1024,
  height: 700,
  alt: "Voltis — Instalaciones eléctricas en Carlos Paz y Punilla",
  type: "image/png",
};

type Imagen = { url: string; alt?: string; width?: number; height?: number };

type Opciones = {
  titulo: string;
  descripcion: string;
  /** Ruta de la página, ej. "/servicios/tableros-electricos". */
  ruta: string;
  imagen?: Imagen;
  /** El título ya es el definitivo (no se le agrega "| Voltis"). */
  tituloAbsoluto?: boolean;
  articulo?: { publicado?: Date | null; modificado?: Date | null };
  noIndexar?: boolean;
};

const conMarca = (titulo: string) => (titulo.includes(MARCA) ? titulo : `${titulo} | ${MARCA}`);

export function metaPagina({
  titulo,
  descripcion,
  ruta,
  imagen = IMAGEN_OG,
  tituloAbsoluto,
  articulo,
  noIndexar,
}: Opciones): Metadata {
  const tituloCompleto = conMarca(titulo);
  return {
    title: tituloAbsoluto ? { absolute: tituloCompleto } : titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      siteName: MARCA,
      locale: "es_AR",
      url: ruta,
      title: tituloCompleto,
      description: descripcion,
      images: [imagen],
      ...(articulo
        ? {
            type: "article",
            publishedTime: articulo.publicado?.toISOString(),
            modifiedTime: articulo.modificado?.toISOString(),
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: tituloCompleto,
      description: descripcion,
      images: [imagen.url],
    },
    robots: noIndexar ? { index: false } : undefined,
  };
}
