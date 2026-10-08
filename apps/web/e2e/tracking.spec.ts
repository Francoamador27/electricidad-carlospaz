import { expect, test } from "@playwright/test";
import { dataLayer, simularApi } from "./utils";

test("un clic en WhatsApp se mide en GTM y se registra en la base con su página", async ({ page, context }) => {
  const capturas = await simularApi(page);
  // No abrimos WhatsApp de verdad.
  await context.route(/wa\.me|whatsapp\.com/, (r) => r.fulfill({ status: 200, body: "ok" }));
  await page.goto("/servicios/tableros-electricos?utm_source=facebook");

  await page.locator('a[href^="https://wa.me/"]').first().click();

  await expect.poll(() => capturas.eventos.length).toBe(1);
  expect(capturas.eventos[0]).toMatchObject({
    tipo: "click_whatsapp",
    pagina: "/servicios/tableros-electricos",
    servicio: "tableros-electricos",
    atribucion: { utm_source: "facebook" },
  });
  const eventos = (await dataLayer(page)).map((e) => e.event);
  expect(eventos).toContain("click_whatsapp");
});

test("un clic en el teléfono se registra como click_telefono", async ({ page }) => {
  const capturas = await simularApi(page);
  await page.goto("/zonas");
  await page.evaluate(() => {
    // Evita que el navegador intente abrir el marcador.
    document.querySelectorAll('a[href^="tel:"]').forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
  });
  await page.locator('a[href^="tel:"]').first().click();
  await expect.poll(() => capturas.eventos.length).toBe(1);
  expect(capturas.eventos[0]).toMatchObject({ tipo: "click_telefono", pagina: "/zonas" });
});

test("ver un proyecto dispara ver_proyecto", async ({ page }) => {
  await simularApi(page);
  await page.goto("/proyectos/actualizacion-tablero-electrico-domiciliario");
  await expect.poll(async () => (await dataLayer(page)).map((e) => e.event)).toContain("ver_proyecto");
});
