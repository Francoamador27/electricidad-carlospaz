import { expect, test } from "@playwright/test";
import { PAGINAS } from "./utils";

test.describe("SEO de cada página", () => {
  for (const ruta of PAGINAS) {
    test(`${ruta} tiene title, description, canonical, un h1 y JSON-LD válido`, async ({ page }) => {
      const res = await page.goto(ruta);
      expect(res?.status()).toBe(200);

      await expect(page.locator("html")).toHaveAttribute("lang", "es-AR");

      const titulo = await page.title();
      expect(titulo.length).toBeGreaterThan(10);
      expect(titulo.length).toBeLessThanOrEqual(75);

      const descripcion = await page.locator('meta[name="description"]').getAttribute("content");
      expect(descripcion?.length ?? 0).toBeGreaterThan(50);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBeTruthy();
      expect(new URL(canonical!).pathname.replace(/\/$/, "") || "/").toBe(ruta);

      await expect(page.locator("h1")).toHaveCount(1);

      // Todos los bloques JSON-LD tienen que ser JSON válido con @context.
      const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(bloques.length).toBeGreaterThan(0);
      for (const b of bloques) {
        const data = JSON.parse(b);
        expect(data["@context"]).toBe("https://schema.org");
      }
    });
  }

  test("las páginas internas tienen BreadcrumbList", async ({ page }) => {
    for (const ruta of ["/servicios/tableros-electricos", "/blog/seguridad-electrica-hogar-carlos-paz", "/zonas"]) {
      await page.goto(ruta);
      const tipos = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
        (b) => JSON.parse(b)["@type"],
      );
      expect(tipos, ruta).toContain("BreadcrumbList");
    }
  });

  test("los servicios publican Service y FAQPage", async ({ page }) => {
    await page.goto("/servicios/camaras-de-seguridad");
    const tipos = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
      (b) => JSON.parse(b)["@type"],
    );
    expect(tipos).toEqual(expect.arrayContaining(["Service", "FAQPage", "ElectricalContractor"]));
  });

  test("el negocio publica horario hasta las 19 h y las 15 localidades", async ({ page }) => {
    await page.goto("/");
    const org = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .map((b) => JSON.parse(b))
      .find((d) => d["@type"] === "ElectricalContractor");
    expect(org.telephone).toBe("+5493513873029");
    expect(org.openingHoursSpecification[0].closes).toBe("19:00");
    const ciudades = org.areaServed.filter((a: { "@type": string }) => a["@type"] === "City");
    expect(ciudades).toHaveLength(15);
    expect(ciudades.map((c: { name: string }) => c.name)).toContain("Cabalango");
  });
});

test.describe("contenido", () => {
  test("no se ofrecen urgencias ni atención 24/7", async ({ page }) => {
    for (const ruta of PAGINAS) {
      await page.goto(ruta);
      const texto = (await page.locator("body").innerText()).toLowerCase();
      expect(texto, ruta).not.toContain("24/7");
      expect(texto, ruta).not.toContain("24 horas");
      expect(texto, ruta).not.toMatch(/urgencias? el[eé]ctricas?/);
    }
  });

  test("no se repite la palabra matriculado", async ({ page }) => {
    for (const ruta of PAGINAS) {
      await page.goto(ruta);
      const texto = (await page.locator("body").innerText()).toLowerCase();
      expect(texto, ruta).not.toContain("matriculad");
    }
  });

  test("el blog no cita normas dudosas", async ({ page }) => {
    for (const ruta of ["/blog/seguridad-electrica-hogar-carlos-paz", "/blog/instalacion-electrica-obra-nueva-carlos-paz"]) {
      await page.goto(ruta);
      const texto = await page.locator("body").innerText();
      expect(texto, ruta).not.toContain("Resolución SE 1/2020");
      expect(texto, ruta).not.toContain("ante el municipio");
    }
  });

  test("los borradores no se publican", async ({ page }) => {
    for (const ruta of ["/", "/zonas", "/proyectos", "/blog"]) {
      await page.goto(ruta);
      await expect(page.getByText("BORRADOR"), ruta).toHaveCount(0);
    }
  });
});

test.describe("archivos para buscadores e IA", () => {
  test("sitemap.xml lista las páginas y todas responden 200", async ({ page, request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(urls).toEqual(expect.arrayContaining(["/servicios/camaras-de-seguridad", "/certificado-instalacion-electrica-apta"]));
    for (const ruta of urls) {
      const r = await page.request.get(ruta || "/");
      expect(r.status(), ruta).toBe(200);
    }
  });

  test("robots.txt bloquea /admin, permite IA y apunta al sitemap", async ({ request }) => {
    const texto = await (await request.get("/robots.txt")).text();
    expect(texto).toContain("Disallow: /admin");
    expect(texto).toContain("User-Agent: GPTBot");
    expect(texto).toContain("User-Agent: ClaudeBot");
    expect(texto).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  });

  test("llms.txt sigue el formato y tiene servicios, horario y certificado", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    const texto = await res.text();
    expect(texto.startsWith("# Voltis")).toBe(true);
    expect(texto).toMatch(/^> .+/m);
    expect(texto).toContain("## Servicios");
    expect(texto).toContain("8 a 19 h");
    expect(texto).toContain("Certificado de Instalación Eléctrica Apta");
    expect(texto).toContain("/servicios/camaras-de-seguridad");
    expect(texto).not.toContain("24 horas");
  });

  test("llms-full.txt incluye el contenido completo del blog", async ({ request }) => {
    const texto = await (await request.get("/llms-full.txt")).text();
    expect(texto).toContain("7 señales de que tu tablero necesita ser actualizado");
    expect(texto.length).toBeGreaterThan(10_000);
  });

  test("el panel no se indexa", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
