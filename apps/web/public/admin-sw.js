// Service worker del panel de Voltis. Se registra con alcance "/admin": controla /admin y sus
// subpáginas; el sitio público no lo usa nunca. Está en la raíz (no en /admin/) porque un
// service worker ubicado en /admin/ no puede tomar "/admin" (sin barra), que es la portada del panel.
//
// Estrategias:
// - Páginas del panel (/admin...): red primero; sin señal, la última versión guardada o la
//   pantalla "Sin conexión".
// - Archivos de Next con hash (/_next/static/...): caché primero (nunca cambian).
// - Íconos y manifest del panel: caché primero.
// - API (/admin/api/...), fotos (/img/...) y todo lo demás: directo a la red, nunca se guarda.

const VERSION = "v1";
const CACHE_PAGINAS = `voltis-panel-paginas-${VERSION}`;
const CACHE_ESTATICOS = `voltis-panel-estaticos-${VERSION}`;
const PAGINA_INICIO = "/admin";

const SIN_CONEXION = `<!doctype html><html lang="es-AR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Sin conexión · Voltis</title>
<style>
  :root{color-scheme:light dark}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F2F2F7;color:#1C1C1E;
    font:17px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center;padding:24px}
  @media (prefers-color-scheme:dark){body{background:#000;color:#fff}p{color:#98989F}}
  h1{font-size:22px;margin:0 0 8px} p{color:#6C6C70;margin:0 0 20px}
  button{font:inherit;font-weight:600;border:0;border-radius:12px;padding:12px 22px;background:#A9581A;color:#fff}
</style></head><body><main>
  <h1>Sin conexión</h1>
  <p>No hay internet en este momento.<br>Cuando vuelva la señal, tocá reintentar.</p>
  <button onclick="location.reload()">Reintentar</button>
</main></body></html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_PAGINAS)
      .then((c) => c.add(PAGINA_INICIO))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves
            .filter((k) => k.startsWith("voltis-panel-") && ![CACHE_PAGINAS, CACHE_ESTATICOS].includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function esPaginaDelPanel(url, request) {
  return request.mode === "navigate" && url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/api");
}

async function redPrimero(request) {
  const cache = await caches.open(CACHE_PAGINAS);
  try {
    const respuesta = await fetch(request);
    if (respuesta.ok) cache.put(request, respuesta.clone());
    return respuesta;
  } catch {
    const guardada = (await cache.match(request, { ignoreSearch: true })) ?? (await cache.match(PAGINA_INICIO));
    return (
      guardada ??
      new Response(SIN_CONEXION, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } })
    );
  }
}

async function cachePrimero(request) {
  const cache = await caches.open(CACHE_ESTATICOS);
  const guardada = await cache.match(request);
  if (guardada) return guardada;
  const respuesta = await fetch(request);
  if (respuesta.ok) cache.put(request, respuesta.clone());
  return respuesta;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Datos y fotos: siempre en vivo (no se guardan datos de clientes en el teléfono).
  if (url.pathname.startsWith("/admin/api") || url.pathname.startsWith("/img/")) return;

  if (esPaginaDelPanel(url, request)) {
    event.respondWith(redPrimero(request));
  } else if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/admin/iconos/")) {
    event.respondWith(cachePrimero(request));
  }
});
