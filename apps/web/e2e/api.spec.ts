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

test("panel: sin sesión no se puede leer ni modificar nada", async ({ request }) => {
  for (const ruta of ["/admin/api/consultas", "/admin/api/estadisticas", "/admin/api/config", "/admin/api/yo"]) {
    expect((await request.get(ruta)).status(), ruta).toBe(401);
  }
  expect((await request.delete("/admin/api/proyectos/1")).status()).toBe(401);
});

test("panel: una cookie de sesión falsa no entra", async ({ request }) => {
  const res = await request.get("/admin/api/consultas", {
    headers: { Cookie: "voltis_sesion=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmcmFuY28ifQ.firma-falsa" },
  });
  expect(res.status()).toBe(401);
});

test("panel: pedidos que modifican desde otro sitio se rechazan (CSRF)", async ({ request }) => {
  const res = await request.post("/admin/api/publicar", { headers: { Origin: "https://sitio-malicioso.com" } });
  expect(res.status()).toBe(403);
  expect((await res.json()).error).toBe("origen_no_permitido");
});

test("login: sin Turnstile válido se rechaza antes de probar la contraseña", async ({ request }) => {
  const res = await request.post("/admin/api/auth/login", {
    data: { usuario: "franco", password: "clave-de-prueba-larga", turnstileToken: "token-invalido" },
  });
  expect(res.status()).toBe(403);
  expect(res.headers()["set-cookie"]).toBeUndefined();
});

test("login: datos incompletos se rechazan", async ({ request }) => {
  expect((await request.post("/admin/api/auth/login", { data: { usuario: "" } })).status()).toBe(400);
});

test("salir borra la cookie de sesión", async ({ request }) => {
  const res = await request.post("/admin/api/auth/salir");
  expect(res.status()).toBe(200);
  expect(res.headers()["set-cookie"]).toContain("voltis_sesion=;");
});
