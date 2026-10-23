import { expect, test } from "@playwright/test";
import { PAGINAS } from "./utils";

test("ninguna página tiene scroll horizontal en el celular", async ({ page }) => {
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sobra, ruta).toBeLessThanOrEqual(1);
  }
});

test("el botón flotante de WhatsApp está visible en el celular", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Contactar por WhatsApp" })).toBeVisible();
});

test("arriba del botón de WhatsApp hay uno para llamar directo", async ({ page }) => {
  await page.goto("/");
  const llamar = page.getByRole("link", { name: "Llamar al (351) 387-3029" });
  await expect(llamar).toBeVisible();
  await expect(llamar).toHaveAttribute("href", "tel:+5493513873029");
  const cajaLlamar = (await llamar.boundingBox())!;
  const cajaWa = (await page.getByRole("link", { name: "Contactar por WhatsApp" }).boundingBox())!;
  expect(cajaLlamar.y + cajaLlamar.height).toBeLessThan(cajaWa.y);
});

test("el inicio arranca con WhatsApp y Llamar", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section").first();
  await expect(hero.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /wa\.me\/5493513873029/);
  await expect(hero.getByRole("link", { name: "Llamar" })).toHaveAttribute("href", "tel:+5493513873029");
  await expect(hero.getByRole("link", { name: "Solicitar presupuesto" })).toHaveCount(0);
});
