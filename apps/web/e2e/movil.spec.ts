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
  await expect(page.getByRole("button", { name: "Contactar por WhatsApp" })).toBeVisible();
});
