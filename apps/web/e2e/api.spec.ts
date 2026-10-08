import { expect, test } from "@playwright/test";

// Contra un wrangler dev real. Ningún test llega a escribir en la base: todos cortan antes
// (validación, honeypot, Turnstile o autenticación).

test("health responde", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(await res.json()).toEqual({ ok: true });
});

test("consultas: rechaza datos inválidos", async ({ request }) => {
  const res = await request.post("/api/consultas", { data: { nombre: "x", telefono: "1" } });
  expect(res.status()).toBe(400);
  const cuerpo = await res.json();
  expect(cuerpo.error).toBe("datos_invalidos");
});

test("consultas: el honeypot responde OK sin guardar", async ({ request }) => {
  const res = await request.post("/api/consultas", {
    data: { nombre: "Bot", telefono: "12345678", empresa: "spam" },
  });
  expect(res.status()).toBe(201);
  expect(await res.json()).toEqual({ ok: true });
});

test("consultas: sin token de Turnstile se rechaza", async ({ request }) => {
  const res = await request.post("/api/consultas", { data: { nombre: "Persona", telefono: "12345678" } });
  expect(res.status()).toBe(403);
});

test("consultas: CORS solo para orígenes permitidos", async ({ request }) => {
  const ok = await request.fetch("/api/consultas", {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:3000", "Access-Control-Request-Method": "POST" },
  });
  expect(ok.headers()["access-control-allow-origin"]).toBe("http://localhost:3000");
  const malo = await request.fetch("/api/consultas", {
    method: "OPTIONS",
    headers: { Origin: "https://sitio-malicioso.com", "Access-Control-Request-Method": "POST" },
  });
  expect(malo.headers()["access-control-allow-origin"]).toBeUndefined();
});

test("eventos: rechaza tipos desconocidos y JSON roto", async ({ request }) => {
  expect((await request.post("/api/eventos", { data: '{"tipo":"otro"}' })).status()).toBe(400);
  expect((await request.post("/api/eventos", { data: "no es json" })).status()).toBe(400);
});

test("panel: sin Cloudflare Access configurado queda cerrado (falla cerrado)", async ({ request }) => {
  for (const ruta of ["/admin/api/consultas", "/admin/api/estadisticas", "/admin/api/config"]) {
    const res = await request.get(ruta);
    expect([401, 503], ruta).toContain(res.status());
  }
  const borrar = await request.delete("/admin/api/proyectos/1");
  expect([401, 503]).toContain(borrar.status());
});

test("panel: un JWT falso no entra", async ({ request }) => {
  const res = await request.get("/admin/api/consultas", {
    headers: { "Cf-Access-Jwt-Assertion": "eyJhbGciOiJSUzI1NiJ9.e30.firma-falsa" },
  });
  expect([401, 503]).toContain(res.status());
});
