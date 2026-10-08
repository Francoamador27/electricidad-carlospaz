import type { Foto } from "@voltis/db/schema";

const IMG_BASE = process.env.NEXT_PUBLIC_IMG_URL ?? "";

// Fotos con `anchos` vacío son archivos de /public. El resto vive en R2 como
// `<key>-<ancho>.webp`.
export function srcFoto(foto: Foto, ancho?: number): string {
  if (!foto.anchos.length) return foto.key;
  const w = ancho ?? foto.anchos[foto.anchos.length - 1];
  return `${IMG_BASE}/${foto.key}-${w}.webp`;
}

export function srcSetFoto(foto: Foto): string | undefined {
  if (!foto.anchos.length) return undefined;
  return foto.anchos.map((w) => `${srcFoto(foto, w)} ${w}w`).join(", ");
}
