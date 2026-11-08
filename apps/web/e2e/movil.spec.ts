import { expect, test } from "@playwright/test";
import { PAGINAS } from "./utils";

test("ninguna página tiene scroll horizontal en el celular", async ({ page }) => {
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sobra, ruta).toBeLessThanOrEqual(1);
  }
});

test("la barra fija tiene WhatsApp y Llamar, con el mensaje de la página", async ({ page }) => {
  await page.goto("/comercios");
  const whatsapp = page.getByRole("link", { name: "Contactar por WhatsApp" });
  await expect(whatsapp).toBeVisible();
  await expect(whatsapp).toHaveAttribute("href", /tengo%20un%20local/);
  await expect(page.getByRole("link", { name: "Llamar al (351) 387-3029" })).toHaveAttribute(
    "href",
    "tel:+5493513873029",
  );
});

test("en las landings el WhatsApp se ve sin hacer scroll", async ({ page }) => {
  for (const ruta of ["/comercios", "/servicios/instalacion-ventilador-de-techo"]) {
    await page.goto(ruta);
    const caja = (await page.locator("main").getByRole("link", { name: "WhatsApp" }).first().boundingBox())!;
    expect(caja.y + caja.height, ruta).toBeLessThan(page.viewportSize()!.height - 64);
  }
});

test("el inicio arranca con WhatsApp y Llamar", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section").first();
  await expect(hero.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /wa\.me\/5493513873029/);
  await expect(hero.getByRole("link", { name: "Llamar" })).toHaveAttribute("href", "tel:+5493513873029");
  await expect(hero.getByRole("link", { name: "Solicitar presupuesto" })).toHaveCount(0);
});
