// Genera los íconos de la app del panel (PWA) a partir del isotipo de logo-voltis.png.
// Uso: node scripts/generar-iconos-admin.mjs (desde apps/web). Los PNG resultantes se commitean.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const ORIGEN = "public/logo-voltis.png";
const DESTINO = "public/admin/iconos";
// Recorte cuadrado del isotipo (círculo con la V y el rayo), sin el texto.
const ISOTIPO = { left: 282, top: 14, width: 446, height: 446 };
const FONDO = { r: 255, g: 255, b: 255, alpha: 1 };

mkdirSync(DESTINO, { recursive: true });

async function icono(tamano, escala, archivo) {
  const interior = Math.round(tamano * escala);
  const isotipo = await sharp(ORIGEN).extract(ISOTIPO).resize(interior, interior).png().toBuffer();
  await sharp({ create: { width: tamano, height: tamano, channels: 4, background: FONDO } })
    .composite([{ input: isotipo, gravity: "center" }])
    .flatten({ background: FONDO }) // iPhone no admite transparencia en el ícono
    .png({ compressionLevel: 9 })
    .toFile(`${DESTINO}/${archivo}`);
  console.log(`${DESTINO}/${archivo}`);
}

// "any": el isotipo ocupa casi todo el cuadrado.
await icono(192, 0.86, "icono-192.png");
await icono(512, 0.86, "icono-512.png");
// "maskable": Android recorta en círculo/forma; el contenido va dentro de la zona segura (80 %).
await icono(512, 0.66, "icono-maskable-512.png");
// iPhone (pantalla de inicio): 180 px, iOS redondea las esquinas solo.
await icono(180, 0.8, "apple-touch-icon.png");
