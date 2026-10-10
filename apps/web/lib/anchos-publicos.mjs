// Anchos de las versiones WebP de /public/images (las genera scripts/optimizar-imagenes.mjs).
// Una imagen más angosta que 960 px tiene como versión mayor su propio ancho.
const ANCHOS = [480, 960];

/** @param {number} ancho ancho del original */
export function anchosPublicos(ancho) {
  const menores = ANCHOS.filter((w) => w < ancho);
  return menores.length < ANCHOS.length ? [...menores, ancho] : menores;
}
