import { expect, test, type Page } from "@playwright/test";
import { API, cors } from "./utils";

// Panel como app instalable (PWA): manifest, íconos, service worker, sin conexión y diseño iOS.

async function sesionSimulada(page: Page) {
  await page.route(`${API}/admin/api/**`, (route) => {
    const ruta = new URL(route.request().url()).pathname.replace("/admin/api", "");
    const cuerpo =
      ruta === "/yo"
        ? { usuario: "franco" }
        : ruta === "/estadisticas"
          ? { dias: 30, totales: {}, porDia: [], porPagina: [], porOrigen: [], porZona: [] }
          : ruta === "/servicios" || ruta === "/zonas"
            ? []
            : {};
    return route.fulfill({ status: 200, headers: cors(), contentType: "application/json", body: JSON.stringify(cuerpo) });
  });
}

test("el manifest del panel es válido y sus íconos existen", async ({ request }) => {
  const res = await request.get("/admin/manifest.webmanifest");
  expect(res.status()).toBe(200);
  const m = await res.json();
  expect(m).toMatchObject({ short_name: "Voltis", start_url: "/admin/agenda", scope: "/admin", display: "standalone" });
  const tamanos = m.icons.map((i: { sizes: string }) => i.sizes);
  expect(tamanos).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  expect(m.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
  for (const i of m.icons) expect((await request.get(i.src)).status(), i.src).toBe(200);
});

test("el panel enlaza el manifest y el ícono de iPhone; el sitio público no", async ({ page }) => {
  await sesionSimulada(page);
  await page.goto("/admin");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/admin/manifest.webmanifest");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", /apple-touch-icon\.png/);
  await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute("content", "Voltis");

  await page.goto("/");
  await expect(page.locator('link[rel="manifest"][href*="/admin/"]')).toHaveCount(0);
});

test("el service worker se registra solo en /admin y el panel abre sin conexión", async ({ page, context }) => {
  await sesionSimulada(page);
  await page.goto("/admin");
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  expect(new URL(scope).pathname).toBe("/admin");

  // El sitio público no queda controlado por el service worker.
  await page.goto("/");
  expect(await page.evaluate(() => navigator.serviceWorker.controller)).toBeNull();

  // Sin conexión: el panel sigue abriendo (desde la caché) y una pantalla nunca visitada
  // muestra la versión guardada en lugar del error del navegador.
  await page.goto("/admin");
  await page.reload(); // asegura que la página quedó controlada y en caché
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("body")).not.toContainText("ERR_INTERNET_DISCONNECTED");
  await page.goto("/admin/zonas");
  await expect(page.locator("body")).not.toContainText("ERR_INTERNET_DISCONNECTED");

  // La API nunca sale de la caché: sin conexión, falla.
  const apiSinRed = await page.evaluate(() =>
    fetch("/admin/api/yo").then(
      () => "respondio",
      () => "fallo",
    ),
  );
  expect(apiSinRed).toBe("fallo");
  await context.setOffline(false);
});

test("el editor de fotos tiene botón de cámara y de galería", async ({ page }) => {
  await sesionSimulada(page);
  await page.goto("/admin/proyectos/editar");
  await expect(page.getByRole("button", { name: /Sacar foto/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Elegir de la galería/ })).toBeVisible();
  await expect(page.locator('input[type="file"][capture="environment"]')).toHaveCount(1);
});

test.describe("en el celular", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("barra de pestañas inferior y pantalla Más, como en iOS", async ({ page }) => {
    await sesionSimulada(page);
    await page.goto("/admin");
    const pestanas = page.getByRole("navigation", { name: "Pestañas" });
    await expect(pestanas).toBeVisible();
    for (const nombre of ["Agenda", "Consultas", "Finanzas", "Proyectos", "Más"]) {
      await expect(pestanas.getByRole("link", { name: nombre })).toBeVisible();
    }
    // En /admin (Conversiones) la pestaña activa es "Más", donde vive esa sección.
    await expect(pestanas.getByRole("link", { name: "Más" })).toHaveAttribute("aria-current", "page");

    await pestanas.getByRole("link", { name: "Más" }).click();
    await expect(page.getByRole("heading", { name: "Más" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Configuración" })).toBeVisible();
    await expect(pestanas.getByRole("link", { name: "Más" })).toHaveAttribute("aria-current", "page");

    // Sin scroll horizontal.
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
});
