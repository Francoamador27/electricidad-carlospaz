import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { API, cors } from "./utils";

type Llamada = { metodo: string; ruta: string; cuerpo: unknown; esForm: boolean; campos: string[] };

// Simula /admin/api con datos fijos y registra todo lo que el panel envía.
async function simularAdmin(page: Page) {
  const llamadas: Llamada[] = [];
  const servicios = [{ id: 3, slug: "tableros-electricos", nombre: "Tableros eléctricos", orden: 2 }];
  const zonas = [{ id: 11, slug: "cosquin", nombre: "Cosquín", estado: "borrador", orden: 10 }];

  await page.route(`${API}/admin/api/**`, async (route) => {
    const req = route.request();
    const ruta = new URL(req.url()).pathname.replace("/admin/api", "");
    const metodo = req.method();
    if (metodo === "OPTIONS") return route.fulfill({ status: 204, headers: cors() });

    const tipo = req.headers()["content-type"] ?? "";
    const esForm = tipo.startsWith("multipart/form-data");
    // multipart trae binarios (fotos): latin1 no falla con bytes sueltos. JSON va en UTF-8.
    const cuerpoTexto = req.postDataBuffer()?.toString(esForm ? "latin1" : "utf8") ?? "";
    llamadas.push({
      metodo,
      ruta,
      esForm,
      cuerpo: !esForm && cuerpoTexto ? JSON.parse(cuerpoTexto) : null,
      campos: esForm ? [...cuerpoTexto.matchAll(/name="([^"]+)"/g)].map((m) => m[1]) : [],
    });

    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, headers: cors(), contentType: "application/json", body: JSON.stringify(body) });

    if (ruta === "/estadisticas")
      return json({
        dias: 30,
        totales: { formulario: 4, click_whatsapp: 10, click_telefono: 3 },
        porDia: [{ d: new Date().toISOString().slice(0, 10), tipo: "formulario", n: 4 }],
        porPagina: [{ pagina: "/presupuesto", n: 4 }],
        porOrigen: [{ origen: "Google Ads", n: 7 }],
        porZona: [{ zona: "Cosquín", n: 2 }],
      });
    if (ruta === "/servicios") return json(servicios);
    if (ruta === "/zonas") return json(zonas);
    if (ruta === "/proyectos" && metodo === "GET") return json([]);
    if (ruta === "/proyectos" && metodo === "POST") return json({ id: 99 }, 201);
    if (ruta === "/proyectos/99") return json({ id: 99, ...(llamadas.findLast((l) => l.ruta === "/proyectos")?.cuerpo as object) });
    if (ruta === "/uploads") return json({ key: "proyectos/2026/abc", anchos: [480], formato: "webp" }, 201);
    if (ruta === "/publicar") return json({ ok: true, simulado: true });
    if (ruta === "/config" && metodo === "GET") return json({ google_site_verification: "codigo-existente-de-prueba-123" });
    if (ruta === "/config" && metodo === "PUT") return json(llamadas.at(-1)!.cuerpo);
    if (ruta === "/consultas")
      return json([
        {
          id: 1,
          nombre: "Juan Pérez",
          telefono: "351 555 1234",
          email: null,
          localidad: "Cosquín",
          servicio: "Tableros eléctricos",
          tipoPropiedad: "residential",
          urgencia: "normal",
          mensaje: "Cambiar tablero",
          paginaOrigen: "/presupuesto",
          atribucion: { gclid: "x" },
          createdAt: new Date().toISOString(),
        },
      ]);
    return json({ ok: false, error: "no_simulado" }, 404);
  });
  return llamadas;
}

test("conversiones: muestra totales, gráfico y rankings", async ({ page }) => {
  await simularAdmin(page);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Conversiones" })).toBeVisible();
  await expect(page.getByText("17", { exact: true })).toBeVisible(); // total
  await expect(page.getByRole("img", { name: "Conversiones por día" })).toBeVisible();
  await expect(page.getByText("Google Ads")).toBeVisible();
  await page.getByRole("button", { name: "Ver tabla" }).click();
  await expect(page.getByRole("table")).toBeVisible();
});

test("consultas: lista el lead con botón para responder por WhatsApp", async ({ page }) => {
  await simularAdmin(page);
  await page.goto("/admin/consultas");
  await expect(page.getByText("Juan Pérez")).toBeVisible();
  const responder = page.getByRole("link", { name: "Responder por WhatsApp" });
  await expect(responder).toHaveAttribute("href", /wa\.me\/5493515551234/);
  await expect(page.getByText("Google Ads")).toBeVisible();
});

test("proyectos: crear uno con foto lo procesa, lo sube y lo guarda", async ({ page }) => {
  const llamadas = await simularAdmin(page);
  await page.goto("/admin/proyectos/editar");

  await page.getByLabel("Título").fill("Tablero nuevo en casa de Cosquín");
  await expect(page.getByLabel("URL (slug)")).toHaveValue("tablero-nuevo-en-casa-de-cosquin");
  await page.getByLabel("Servicio").selectOption({ label: "Tableros eléctricos" });
  await page.getByLabel("Localidad").selectOption({ label: "Cosquín" });

  const foto = path.resolve(__dirname, "../public/images/tablero-trifasico.jpg");
  await page.locator('input[type="file"]').setInputFiles(foto);
  await expect(page.getByLabel("Texto alternativo")).toHaveValue("Tableros eléctricos en Cosquín");

  const editor = page.getByRole("textbox", { name: "Descripción del trabajo" });
  await editor.click();
  await page.keyboard.type("Reemplazamos el tablero de fusibles.");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText(/Guardado/)).toBeVisible();

  const subida = llamadas.find((l) => l.ruta === "/uploads")!;
  expect(subida.esForm).toBe(true);
  expect(subida.campos).toEqual(expect.arrayContaining(["carpeta", "w480"]));

  const guardado = llamadas.find((l) => l.ruta === "/proyectos" && l.metodo === "POST")!.cuerpo as Record<string, unknown>;
  expect(guardado).toMatchObject({
    titulo: "Tablero nuevo en casa de Cosquín",
    slug: "tablero-nuevo-en-casa-de-cosquin",
    servicioId: 3,
    zonaId: 11,
    estado: "borrador",
  });
  expect(guardado.descripcion).toBe("<p>Reemplazamos el tablero de fusibles.</p>");
  expect((guardado.fotos as unknown[]).length).toBe(1);
});

test("publicar cambios pide confirmación y llama a la API", async ({ page }) => {
  const llamadas = await simularAdmin(page);
  await page.goto("/admin");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Publicar cambios" }).click();
  await expect(page.getByRole("status")).toContainText("Modo local");
  expect(llamadas.some((l) => l.ruta === "/publicar" && l.metodo === "POST")).toBe(true);
});

test("configuración: guarda el ID de GTM", async ({ page }) => {
  const llamadas = await simularAdmin(page);
  await page.goto("/admin/configuracion");
  await expect(page.getByLabel("Verificación de Google Search Console")).toHaveValue("codigo-existente-de-prueba-123");
  await page.getByLabel("ID de Google Tag Manager").fill("GTM-ABC1234");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText(/Guardado/)).toBeVisible();
  expect(llamadas.find((l) => l.metodo === "PUT")!.cuerpo).toMatchObject({ gtm_id: "GTM-ABC1234" });
});

test("el panel no carga GTM ni el header del sitio", async ({ page }) => {
  await simularAdmin(page);
  await page.goto("/admin");
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  await expect(page.getByRole("button", { name: "Contactar por WhatsApp" })).toHaveCount(0);
});

test("editor de texto: negrita, color, tamaño y lista se guardan como HTML", async ({ page }) => {
  const llamadas = await simularAdmin(page);
  await page.goto("/admin/proyectos/editar");
  await page.getByLabel("Título").fill("Prueba del editor de texto");
  const editor = page.getByRole("textbox", { name: "Descripción del trabajo" });
  await editor.click();

  await page.getByRole("button", { name: "Negrita" }).click();
  await page.keyboard.type("Importante");
  await page.getByRole("button", { name: "Negrita" }).click();
  await page.keyboard.type(" y normal.");
  await page.keyboard.press("Enter");

  await page.getByLabel("Tamaño de letra").selectOption({ label: "Grande" });
  await page.getByLabel("Color de texto").click();
  await page.getByRole("button", { name: "Color Rojo" }).click();
  await page.keyboard.type("Texto rojo grande");
  await page.keyboard.press("Enter");

  await page.getByRole("button", { name: "Lista con viñetas" }).click();
  await page.keyboard.type("Primer punto");

  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText(/Guardado/)).toBeVisible();

  const html = (llamadas.find((l) => l.ruta === "/proyectos" && l.metodo === "POST")!.cuerpo as { descripcion: string })
    .descripcion;
  expect(html).toContain("<strong>Importante</strong> y normal.");
  const spanRojo = html.match(/<span style="([^"]*)">Texto rojo grande<\/span>/);
  expect(spanRojo, html).not.toBeNull();
  expect(spanRojo![1]).toContain("font-size: 20px");
  expect(spanRojo![1]).toMatch(/color: (#dc2626|rgb\(220, 38, 38\))/);
  expect(html).toContain("<ul><li><p>Primer punto</p></li></ul>");
});

test("editor de texto: el contenido viejo en Markdown se abre con formato", async ({ page }) => {
  await simularAdmin(page);
  await page.route(`${API}/admin/api/proyectos/7`, (route) =>
    route.fulfill({
      status: 200,
      headers: cors(),
      contentType: "application/json",
      body: JSON.stringify({
        id: 7, slug: "viejo", titulo: "Proyecto viejo", estado: "publicado", destacado: false, fotos: [],
        descripcion: ["## Cómo lo hacemos", "", "- **Paso uno**", "- Paso dos"].join("\n"),
      }),
    }),
  );
  await page.goto("/admin/proyectos/editar?id=7");
  const editor = page.getByRole("textbox", { name: "Descripción del trabajo" });
  await expect(editor.locator("h2")).toHaveText("Cómo lo hacemos");
  await expect(editor.locator("li strong")).toHaveText("Paso uno");
});
