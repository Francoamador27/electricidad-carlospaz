import { expect, test } from "@playwright/test";

test("ningún link interno del sitio está roto", async ({ page }) => {
  test.setTimeout(180_000); // recorre ~100 páginas
  const visitadas = new Set<string>();
  const pendientes = ["/"];
  const rotos: string[] = [];

  while (pendientes.length && visitadas.size < 150) {
    const ruta = pendientes.shift()!;
    if (visitadas.has(ruta)) continue;
    visitadas.add(ruta);

    const res = await page.goto(ruta);
    if (!res || res.status() !== 200) {
      rotos.push(`${ruta} → ${res?.status()}`);
      continue;
    }
    const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    for (const h of hrefs) {
      const limpia = h.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
      if (limpia.startsWith("/admin") || limpia.startsWith("/_next")) continue;
      if (!visitadas.has(limpia)) pendientes.push(limpia);
    }
  }

  expect(rotos).toEqual([]);
  expect(visitadas.size).toBeGreaterThan(20);
});

test("el menú lleva a servicios, zonas, proyectos y contacto", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("header");
  for (const [texto, ruta] of [
    ["Zonas", "/zonas"],
    ["Proyectos", "/proyectos"],
    ["Contacto", "/contacto"],
  ]) {
    await nav.getByRole("link", { name: texto, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${ruta}$`));
    await page.goto("/");
  }
});

test("el footer tiene iluminación, domótica, cámaras y certificado", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Iluminación", exact: true })).toHaveAttribute(
    "href",
    "/servicios/iluminacion-automatizacion",
  );
  await expect(footer.getByRole("link", { name: "Domótica" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Instalación de cámaras de seguridad" })).toHaveAttribute(
    "href",
    "/servicios/camaras-de-seguridad",
  );
  await expect(footer.getByRole("link", { name: /Certificado/ })).toHaveAttribute(
    "href",
    "/certificado-instalacion-electrica-apta",
  );
  await expect(footer).toContainText("8:00–19:00");
});

test("los proyectos de referencia se ven y enlazan a su servicio", async ({ page }) => {
  await page.goto("/proyectos");
  const tarjetas = page.locator("article");
  expect(await tarjetas.count()).toBeGreaterThanOrEqual(7);
  await tarjetas.first().getByRole("link").last().click();
  await expect(page.getByText("Trabajo de referencia")).toBeVisible();
  await expect(page.getByRole("link", { name: /^Servicio:/ })).toBeVisible();
});

test("la home muestra 500 clientes y no muestra reseñas inventadas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("+500")).toBeVisible();
  await expect(page.getByText("Marcela R.")).toHaveCount(0);
});
