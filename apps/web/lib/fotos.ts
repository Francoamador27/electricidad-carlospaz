import type { Foto } from "@voltis/db/schema";

// Por defecto, el Worker del mismo dominio (/img). En local, .env.local apunta a :8787/img.
const IMG_BASE = (process.env.NEXT_PUBLIC_IMG_URL || "/img").replace(/\/$/, "");

// Fotos con `anchos` vacío son archivos de /public. El resto se pide a /img/ del Worker como
// `<key>-<ancho>.webp`.
export function srcFoto(foto: Foto, ancho?: number): string {
  if (!foto.anchos.length) return foto.key;
  const w = ancho ?? foto.anchos[foto.anchos.length - 1];
  return `${IMG_BASE}/${foto.key}-${w}.${foto.formato === "jpeg" ? "jpg" : "webp"}`;
}

export function srcSetFoto(foto: Foto): string | undefined {
  if (!foto.anchos.length) return undefined;
  return foto.anchos.map((w) => `${srcFoto(foto, w)} ${w}w`).join(", ");
}
