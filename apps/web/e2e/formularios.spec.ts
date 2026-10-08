import { expect, test } from "@playwright/test";
import { dataLayer, simularApi } from "./utils";

test.describe("formulario de presupuesto", () => {
  test("guarda la consulta, mide el lead y abre WhatsApp con el mensaje", async ({ page, context }) => {
    const capturas = await simularApi(page);
    await page.goto("/presupuesto?utm_source=google&utm_medium=cpc&gclid=prueba123");

    await page.locator('input[name="name"]').fill("Juan Pérez");
    await page.locator('input[name="phone"]').fill("351 555 1234");
    await page.locator('input[name="location"]').fill("Cosquín");
    await page.locator('select[name="serviceType"]').selectOption("Tableros eléctricos");
    await page.locator('textarea[name="message"]').fill("Quiero cambiar el tablero de fusibles.");

    const popup = context.waitForEvent("page");
    await page.getByRole("button", { name: /Solicitar presupuesto/ }).click();
    const wa = await popup;
    await wa.waitForURL(/wa\.me|whatsapp\.com/, { timeout: 15_000 }).catch(() => undefined);

    // 1. La consulta llegó a la API con los datos y la atribución.
    expect(capturas.consultas).toHaveLength(1);
    const enviada = capturas.consultas[0] as Record<string, unknown>;
    expect(enviada).toMatchObject({
      nombre: "Juan Pérez",
      telefono: "351 555 1234",
      localidad: "Cosquín",
      servicio: "Tableros eléctricos",
      paginaOrigen: "/presupuesto",
      atribucion: { utm_source: "google", utm_medium: "cpc", gclid: "prueba123" },
    });
    expect(enviada.empresa ?? "").toBe("");

    // 2. Se abrió WhatsApp con el mensaje armado.
    const urlWa = decodeURIComponent(wa.url()).replace(/\+/g, " ");
    expect(urlWa).toMatch(/5493513873029/);
    expect(urlWa).toContain("Juan Pérez");

    // 3. GTM recibió generate_lead.
    expect((await dataLayer(page)).map((e) => e.event)).toContain("generate_lead");
    await expect(page.getByText("¡Presupuesto solicitado con éxito!")).toBeVisible();
  });

  test("si la API falla, abre WhatsApp igual y no pierde el contacto", async ({ page, context }) => {
    const capturas = await simularApi(page, { consultas: 500 });
    await page.goto("/presupuesto");
    await page.locator('input[name="name"]').fill("Ana");
    await page.locator('input[name="phone"]').fill("3515551234");
    await page.locator('input[name="location"]').fill("Tanti");
    await page.locator('select[name="serviceType"]').selectOption({ index: 1 });
    await page.locator('textarea[name="message"]').fill("Consulta de prueba");

    const popup = context.waitForEvent("page");
    await page.getByRole("button", { name: /Solicitar presupuesto/ }).click();
    const wa = await popup;
    await wa.waitForURL(/wa\.me|whatsapp\.com/, { timeout: 15_000 }).catch(() => undefined);

    expect(decodeURIComponent(wa.url()).replace(/\+/g, " ")).toContain("Ana");
    expect((await dataLayer(page)).map((e) => e.event)).not.toContain("generate_lead");
    await expect.poll(() => capturas.eventos.length).toBeGreaterThan(0);
  });

  test("no ofrece la opción Emergencia", async ({ page }) => {
    await page.goto("/presupuesto");
    await expect(page.getByText("Emergencia")).toHaveCount(0);
  });

  test("el campo trampa para bots está oculto", async ({ page }) => {
    await page.goto("/presupuesto");
    await expect(page.locator('input[name="empresa"]')).not.toBeInViewport();
  });
});

test("el formulario de contacto guarda la consulta", async ({ page, context }) => {
  const capturas = await simularApi(page);
  await page.goto("/contacto");
  await page.locator('input[name="name"]').fill("Lucía");
  await page.locator('input[name="phone"]').fill("3515550000");
  await page.locator('textarea[name="message"]').fill("Necesito revisar la instalación.");
  const popup = context.waitForEvent("page");
  await page.getByRole("button", { name: "Enviar consulta" }).click();
  await popup;
  expect(capturas.consultas).toHaveLength(1);
  expect(capturas.consultas[0]).toMatchObject({ nombre: "Lucía", paginaOrigen: "/contacto" });
});
