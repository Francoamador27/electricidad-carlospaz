// Redimensiona y recodifica fotos en el navegador antes de subirlas, así el Worker
// no gasta CPU. Recodificar con canvas además elimina el EXIF (incluido el GPS).
import { ANCHOS_FOTO } from "@voltis/shared";

export type ImagenProcesada = {
  versiones: { ancho: number; blob: Blob }[];
  formato: "webp" | "jpeg";
  ancho: number;
  alto: number;
};

const CALIDAD = { webp: 0.82, jpeg: 0.85 } as const;

function aBlob(canvas: HTMLCanvasElement, formato: "webp" | "jpeg"): Promise<Blob> {
  return new Promise((ok, mal) =>
    canvas.toBlob(
      (b) => (b ? ok(b) : mal(new Error("No se pudo procesar la imagen"))),
      `image/${formato}`,
      CALIDAD[formato],
    ),
  );
}

function dibujar(bitmap: ImageBitmap, ancho: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = Math.round((bitmap.height * ancho) / bitmap.width);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("El navegador no permite procesar imágenes");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function procesarImagen(archivo: File): Promise<ImagenProcesada> {
  if (!archivo.type.startsWith("image/")) throw new Error(`"${archivo.name}" no es una imagen`);
  const bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });
  try {
    // Sin agrandar: solo los anchos que entran en la foto original (mínimo uno).
    const anchos: number[] = ANCHOS_FOTO.filter((w) => w <= bitmap.width);
    if (!anchos.length) anchos.push(bitmap.width);

    const canvases = anchos.map((w) => dibujar(bitmap, w));

    // Safari puede devolver PNG cuando se pide WebP: en ese caso todo va en JPEG.
    const prueba = await aBlob(canvases[0], "webp");
    const formato = prueba.type === "image/webp" ? "webp" : "jpeg";

    const versiones = await Promise.all(
      canvases.map(async (c, i) => ({
        ancho: anchos[i],
        blob: i === 0 && formato === "webp" ? prueba : await aBlob(c, formato),
      })),
    );
    const mayor = canvases[canvases.length - 1];
    return { versiones, formato, ancho: mayor.width, alto: mayor.height };
  } finally {
    bitmap.close();
  }
}
