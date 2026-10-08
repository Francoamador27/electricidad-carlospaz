import type { Page, Request } from "@playwright/test";

// La web generada apunta a la API de NEXT_PUBLIC_API_URL (localhost:8787 en local).
export const API = "http://localhost:8787";

export const PAGINAS = [
  "/",
  "/servicios",
  "/servicios/instalaciones-domiciliarias",
  "/servicios/instalaciones-empresariales",
  "/servicios/tableros-electricos",
  "/servicios/reparaciones-electricas",
  "/servicios/mantenimiento-electricidad",
  "/servicios/iluminacion-automatizacion",
  "/servicios/camaras-de-seguridad",
  "/certificado-instalacion-electrica-apta",
  "/zonas",
  "/proyectos",
  "/blog",
  "/blog/como-saber-si-necesito-actualizar-tablero-electrico",
  "/about",
  "/contacto",
  "/presupuesto",
  "/politica-de-privacidad",
];

export type Capturas = { consultas: unknown[]; eventos: unknown[] };

// Simula la API pública: guarda lo que el sitio envía para poder verificarlo.
export async function simularApi(page: Page, opciones: { consultas?: number } = {}): Promise<Capturas> {
  const capturas: Capturas = { consultas: [], eventos: [] };
  await page.route(`${API}/api/consultas`, async (route) => {
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors() });
    capturas.consultas.push(route.request().postDataJSON());
    await route.fulfill({
      status: opciones.consultas ?? 201,
      headers: cors(),
      contentType: "application/json",
      body: JSON.stringify(opciones.consultas && opciones.consultas >= 400 ? { ok: false } : { ok: true, id: 1 }),
    });
  });
  await page.route(`${API}/api/eventos`, async (route) => {
    capturas.eventos.push(JSON.parse(route.request().postData() ?? "{}"));
    await route.fulfill({ status: 204, headers: cors() });
  });
  // Turnstile real no corre en los tests.
  await page.route("https://challenges.cloudflare.com/**", (route) => route.fulfill({ status: 200, body: "" }));
  return capturas;
}

// Con credentials: "include" el navegador exige el origen exacto, no "*".
export function cors() {
  return {
    "Access-Control-Allow-Origin": "http://localhost:4173",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  };
}

export async function dataLayer(page: Page): Promise<Record<string, unknown>[]> {
  return page.evaluate(() => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []);
}

export function esBeacon(req: Request) {
  return req.url().endsWith("/api/eventos");
}
