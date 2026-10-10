import type { Foto } from "@voltis/db/schema";
import { anchosPublicos } from "@/lib/anchos-publicos.mjs";

const IMG_BASE = process.env.NEXT_PUBLIC_IMG_URL ?? "";

// Fotos con `anchos` vacío son archivos de /public. El resto se pide a /img/ del Worker como
// `<key>-<ancho>.webp`.
// `srcFoto` sin ancho devuelve el original: es el que se usa para Open Graph.
export function srcFoto(foto: Foto, ancho?: number): string {
  if (!foto.anchos.length) return foto.key;
  const w = ancho ?? foto.anchos[foto.anchos.length - 1];
  return `${IMG_BASE}/${foto.key}-${w}.${foto.formato === "jpeg" ? "jpg" : "webp"}`;
}

// Versiones WebP de /public/images (scripts/optimizar-imagenes.mjs): /images/opt/<nombre>-<ancho>.webp
function srcPublica(key: string, ancho: number): string {
  const nombre = key.slice("/images/".length).replace(/\.[^.]+$/, "");
  return encodeURI(`/images/opt/${nombre}-${ancho}.webp`);
}

// `src` del <img>: la versión WebP más grande (el original de /public puede pesar varios MB).
export function srcMostrar(foto: Foto): string {
  if (foto.anchos.length || !foto.key.startsWith("/images/")) return srcFoto(foto);
  return srcPublica(foto.key, anchosPublicos(foto.ancho).at(-1)!);
}

export function srcSetFoto(foto: Foto): string | undefined {
  if (!foto.anchos.length) {
    if (!foto.key.startsWith("/images/")) return undefined;
    return anchosPublicos(foto.ancho)
      .map((w) => `${srcPublica(foto.key, w)} ${w}w`)
      .join(", ");
  }
  return foto.anchos.map((w) => `${srcFoto(foto, w)} ${w}w`).join(", ");
}
