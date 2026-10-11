import { expect, test, type Page } from "@playwright/test";
import { aIso, hoyLocal, sumarDias } from "@voltis/shared/agenda";
import { API, cors } from "./utils";

// Agenda, Finanzas y configuración de avisos, con la API del panel simulada.

const HOY = hoyLocal();

function trabajoBase(id: number, extra: Record<string, unknown> = {}) {
  return {
    id,
    titulo: "Cambio de tablero",
    servicioId: 3,
    servicio: "Tableros eléctricos",
    clienteNombre: "Juan Pérez",
    clienteTelefono: "351 555 1234",
    direccion: "San Martín 123",
    zonaId: 11,
    zona: "Cosquín",
    localidadOtra: null,
    mapsUrl: null,
    lat: -31.2452,
    lng: -64.4661,
    descripcion: "Tablero nuevo con diferencial",
    notas: null,
    quienVa: "Franco",
    inicio: aIso(HOY, "09:00"),
    fin: aIso(HOY, "11:00"),
    todoElDia: false,
    precioCentavos: 15_000_000,
    estado: "agendado",
    consultaId: null,
    proyectoId: null,
    fotos: [],
    recordatorioMin: 60,
    pagadoCentavos: 0,
    gastadoCentavos: 0,
    ...extra,
  };
}

type Llamada = { metodo: string; ruta: string; cuerpo: Record<string, unknown> | null };

async function simular(page: Page) {
  const llamadas: Llamada[] = [];
  const trabajos = [
    trabajoBase(1),
    trabajoBase(2, {
      titulo: "Obra en Tanti",
      clienteNombre: "María Gómez",
      zona: "Tanti",
      todoElDia: true,
      inicio: aIso(sumarDias(HOY, 1)),
      fin: aIso(sumarDias(HOY, 4)),
      precioCentavos: 40_000_000,
      lat: null,
      lng: null,
    }),
  ];
  await page.route(`${API}/admin/api/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const ruta = url.pathname.replace("/admin/api", "");
    const metodo = req.method();
    if (metodo === "OPTIONS") return route.fulfill({ status: 204, headers: cors() });
    const cuerpo = req.postData() ? (JSON.parse(req.postData()!) as Record<string, unknown>) : null;
    llamadas.push({ metodo, ruta, cuerpo });
    const json = (b: unknown, status = 200) =>
      route.fulfill({ status, headers: cors(), contentType: "application/json", body: JSON.stringify(b) });

    if (ruta === "/yo") return json({ usuario: "franco" });
    if (ruta === "/servicios") return json([{ id: 3, slug: "tableros-electricos", nombre: "Tableros eléctricos", orden: 2 }]);
    if (ruta === "/zonas") return json([{ id: 11, slug: "cosquin", nombre: "Cosquín", estado: "publicado", orden: 1 }]);
    if (ruta === "/trabajos" && metodo === "GET") return json(trabajos);
    if (ruta === "/trabajos" && metodo === "POST") return json({ ...trabajoBase(5), ...cuerpo, id: 5, pagos: [], gastos: [] }, 201);
    if (ruta === "/trabajos/1" && metodo === "GET") return json({ ...trabajos[0], pagos: [], gastos: [] });
    if (ruta === "/trabajos/1/pagos")
      return json(
        {
          ...trabajos[0],
          pagadoCentavos: cuerpo!.montoCentavos,
          pagos: [{ id: 1, fecha: cuerpo!.fecha, montoCentavos: cuerpo!.montoCentavos, medio: cuerpo!.medio, nota: null }],
          gastos: [],
        },
        201,
      );
    if (ruta === "/trabajos/5") return json({ ...trabajoBase(5), pagos: [], gastos: [] });
    if (ruta === "/consultas/9")
      return json({ id: 9, nombre: "Lucía Ruiz", telefono: "351 444 0000", localidad: "Cosquín", servicio: "Tableros eléctricos", mensaje: "Me salta la térmica" });
    if (ruta === "/finanzas")
      return json({
        desde: HOY,
        hasta: HOY,
        previo: { desde: HOY, hasta: HOY, cobrado: 100_000_00, ganancia: 80_000_00 },
        cobrado: 150_000_00,
        gastos: 32_000_00,
        ganancia: 118_000_00,
        porCobrar: 400_000_00,
        terminados: 2,
        trabajosCobrados: 3,
        ticketPromedio: 50_000_00,
        porTipo: [
          { tipo: "Tableros eléctricos", cobrado: 120_000_00, trabajos: 1, promedio: 120_000_00 },
          { tipo: "Reparaciones eléctricas", cobrado: 30_000_00, trabajos: 2, promedio: 15_000_00 },
        ],
        porZona: [{ zona: "Cosquín", cobrado: 150_000_00, trabajos: 3 }],
        porMes: Array.from({ length: 12 }, (_, i) => ({ mes: `2026-${String(i + 1).padStart(2, "0")}`, cobrado: i * 10_000_00, gastos: i * 1_000_00 })),
        medios: [{ medio: "transferencia", cobrado: 150_000_00, pagos: 3 }],
        embudo: { consultas: 10, agendados: 4, terminados: 2 },
        pendientes: [
          { id: 2, titulo: "Obra en Tanti", clienteNombre: "María Gómez", clienteTelefono: "351 444 1111", inicio: aIso(HOY), precio: 400_000_00, pagado: 0, saldo: 400_000_00 },
        ],
      });
    if (ruta === "/push/clave") return json({ configurado: true, clavePublica: "BPfake" });
    if (ruta === "/push/dispositivos") return json([]);
    if (ruta === "/calendario") return json({ url: "https://electricidadcarlospaz.proyectoswebsite.com/api/agenda.ics?t=secreto" });
    if (ruta === "/config") return json({});
    return json({ ok: false, error: "no_simulado" }, 404);
  });
  return llamadas;
}

test("agenda: el mes marca los días con trabajos y lista los de hoy", async ({ page }) => {
  await simular(page);
  await page.goto("/admin/agenda");
  await expect(page.getByRole("heading", { name: "Agenda" })).toBeVisible();
  await page.getByRole("radio", { name: "Mes" }).click();
  await expect(page.getByRole("gridcell", { name: /^Hoy, 1 trabajo$/ })).toBeVisible();
  // El de varios días aparece en cada uno de sus 3 días.
  await expect(page.getByRole("gridcell", { name: /, 1 trabajo$/ })).toHaveCount(4);
  await expect(page.getByRole("button", { name: /Cambio de tablero/ })).toBeVisible();
});

test("agenda: el detalle tiene Cómo llegar, Waze, WhatsApp y registra un pago", async ({ page }) => {
  const llamadas = await simular(page);
  await page.goto("/admin/agenda");
  await page.getByRole("radio", { name: "Mes" }).click();
  await page.getByRole("button", { name: /Cambio de tablero/ }).first().click();

  const hoja = page.getByRole("dialog", { name: "Cambio de tablero" });
  await expect(hoja).toBeVisible();
  await expect(hoja.getByRole("link", { name: /Cómo llegar/ })).toHaveAttribute("href", /google\.com\/maps\/dir\/\?api=1&destination=-31\.2452/);
  await expect(hoja.getByRole("link", { name: /Waze/ })).toHaveAttribute("href", /waze\.com\/ul\?ll=-31\.2452,-64\.4661/);
  await expect(hoja.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", /wa\.me\/5493515551234/);
  await expect(hoja.locator("iframe")).toHaveAttribute("src", /openstreetmap\.org\/export\/embed/);

  await hoja.getByLabel("Monto del pago").fill("50.000");
  await hoja.getByRole("button", { name: "+ Registrar pago" }).click();
  await expect(hoja.getByText("Señado")).toBeVisible();
  const pago = llamadas.find((l) => l.ruta === "/trabajos/1/pagos")!.cuerpo!;
  expect(pago).toMatchObject({ montoCentavos: 5_000_000, medio: "transferencia", fecha: HOY });
});

test("agenda: un trabajo de 2 días 'todo el día' se guarda con fin exclusivo", async ({ page }) => {
  const llamadas = await simular(page);
  await page.goto("/admin/agenda/editar?fecha=2026-11-10");
  await page.getByLabel("Tipo de trabajo").selectOption({ label: "Tableros eléctricos" });
  await expect(page.getByLabel("Título")).toHaveValue("Tableros eléctricos");
  await page.getByLabel("Nombre").fill("Carlos Díaz");
  await page.getByRole("switch", { name: /Todo el día/ }).check({ force: true });
  await page.getByLabel("Hasta (incluido)").fill("2026-11-11");
  await page.getByLabel("Precio acordado ($)").fill("250.000");
  await page.getByRole("button", { name: "Guardar" }).first().click();
  await page.waitForURL(/\/admin\/agenda\?trabajo=5/);

  const cuerpo = llamadas.find((l) => l.ruta === "/trabajos" && l.metodo === "POST")!.cuerpo!;
  expect(cuerpo).toMatchObject({
    titulo: "Tableros eléctricos",
    clienteNombre: "Carlos Díaz",
    todoElDia: true,
    inicio: "2026-11-10T00:00:00-03:00",
    fin: "2026-11-12T00:00:00-03:00",
    precioCentavos: 25_000_000,
    recordatorioMin: null,
  });
});

test("agenda: 'Agendar' desde una consulta precarga los datos del cliente", async ({ page }) => {
  const llamadas = await simular(page);
  await page.goto("/admin/agenda/editar?consulta=9");
  await expect(page.getByLabel("Nombre")).toHaveValue("Lucía Ruiz");
  await expect(page.getByLabel("Teléfono")).toHaveValue("351 444 0000");
  await expect(page.getByLabel("Localidad")).toHaveValue("11");
  await expect(page.getByLabel("Tipo de trabajo")).toHaveValue("3");
  await expect(page.getByLabel("Trabajo a realizar")).toHaveValue("Me salta la térmica");
  await page.getByRole("button", { name: "Guardar" }).first().click();
  await page.waitForURL(/trabajo=5/);
  expect(llamadas.find((l) => l.ruta === "/trabajos" && l.metodo === "POST")!.cuerpo).toMatchObject({ consultaId: 9, zonaId: 11 });
});

test("finanzas: totales, comparación y qué trabajo genera más", async ({ page }) => {
  await simular(page);
  await page.goto("/admin/finanzas");
  await expect(page.getByRole("heading", { name: "Finanzas" })).toBeVisible();
  await expect(page.getByText(/150\.000/).first()).toBeVisible();
  await expect(page.getByText("+50 % vs. período anterior")).toBeVisible();
  await expect(page.getByRole("img", { name: /Ingresos cobrados por mes/ })).toBeVisible();

  const ranking = page.getByRole("region", { name: "¿Qué trabajo me genera más?" });
  await expect(ranking.locator("li").first()).toContainText("Tableros eléctricos");
  await ranking.getByRole("radio", { name: "Cantidad" }).click();
  await expect(ranking.locator("li").first()).toContainText("Reparaciones eléctricas");

  await expect(page.getByRole("link", { name: /Recordar el pago a María Gómez/ })).toHaveAttribute("href", /wa\.me\/5493514441111/);
  await expect(page.getByRole("button", { name: /Exportar a Excel/ })).toBeVisible();
});

test("configuración: calendario del iPhone y notificaciones", async ({ page }) => {
  await simular(page);
  await page.goto("/admin/configuracion");
  await expect(page.getByRole("link", { name: "Suscribirme en el Calendario" })).toHaveAttribute(
    "href",
    "webcal://electricidadcarlospaz.proyectoswebsite.com/api/agenda.ics?t=secreto",
  );
  await expect(page.getByRole("heading", { name: "Notificaciones en el celular" })).toBeVisible();
});

test("consultas: cada consulta tiene el botón Agendar", async ({ page }) => {
  await simular(page);
  await page.route(`${API}/admin/api/consultas`, (route) =>
    route.fulfill({
      status: 200,
      headers: cors(),
      contentType: "application/json",
      body: JSON.stringify([
        { id: 9, nombre: "Lucía Ruiz", telefono: "0351 15 444 0000", email: null, localidad: "Cosquín", servicio: null, tipoPropiedad: null, urgencia: null, mensaje: null, paginaOrigen: "/", atribucion: null, createdAt: new Date().toISOString() },
      ]),
    }),
  );
  await page.goto("/admin/consultas");
  await expect(page.getByRole("link", { name: /Agendar/ })).toHaveAttribute("href", "/admin/agenda/editar?consulta=9");
  // El 15 después del código de área se saca para WhatsApp.
  await expect(page.getByRole("link", { name: "Responder por WhatsApp" })).toHaveAttribute("href", /wa\.me\/5493514440000/);
});
