// Genera versiones WebP livianas de las imágenes de /public (las fotos subidas desde el panel
// ya se procesan al subirlas). Correr después de agregar o cambiar una imagen en public/images:
//   pnpm --filter @voltis/web optimizar-imagenes
// Los originales quedan para Open Graph (WhatsApp/Facebook prefieren JPEG/PNG).
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { anchosPublicos } from "../lib/anchos-publicos.mjs";

const PUBLIC = path.join(import.meta.dirname, "..", "public");
const ORIGEN = path.join(PUBLIC, "images");
const DESTINO = path.join(ORIGEN, "opt");

await mkdir(DESTINO, { recursive: true });

for (const archivo of await readdir(ORIGEN)) {
  if (!/\.(jpe?g|png)$/i.test(archivo)) continue;
  const base = archivo.replace(/\.[^.]+$/, "");
  const { width } = await sharp(path.join(ORIGEN, archivo)).metadata();
  for (const ancho of anchosPublicos(width)) {
    await sharp(path.join(ORIGEN, archivo))
      .resize({ width: ancho })
      .webp({ quality: 72 })
      .toFile(path.join(DESTINO, `${base}-${ancho}.webp`));
  }
  console.log("ok", archivo, anchosPublicos(width).join(", "));
}

// Logo del header (100 px) y footer (40 px): 200 px de alto alcanza para pantallas 2x.
await sharp(path.join(PUBLIC, "logo-voltis.png"))
  .resize({ height: 200 })
  .webp({ quality: 85 })
  .toFile(path.join(PUBLIC, "logo-voltis-200.webp"));
console.log("ok logo-voltis-200.webp");
