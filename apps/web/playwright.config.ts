import { defineConfig, devices } from "@playwright/test";

// Tests end-to-end sobre el sitio ya generado (out/), servido como en Cloudflare Pages.
// La API se simula en los tests del sitio y del panel; los tests de "api" usan un
// wrangler dev real que no escribe en la base (solo prueban validaciones y seguridad).
const PUERTO_WEB = 4173;
const PUERTO_API = 8788;

export default defineConfig({
  testDir: "./e2e",
  // Varios tests recorren todas las páginas: 30 s no alcanza con la suite en paralelo.
  timeout: 90_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PUERTO_WEB}`,
    trace: "retain-on-failure",
    locale: "es-AR",
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] }, testIgnore: /api\.spec/ },
    { name: "celular", use: { ...devices["Pixel 7"] }, testMatch: /(movil|formularios)\.spec/ },
    { name: "api", testMatch: /api\.spec/, use: { baseURL: `http://localhost:${PUERTO_API}` } },
  ],
  webServer: [
    {
      command: `pnpm exec serve out -l ${PUERTO_WEB} --no-port-switching`,
      port: PUERTO_WEB,
      reuseExistingServer: !process.env.CI,
    },
    {
      // Sin ADMIN_SIN_AUTH: el panel pide login. Turnstile de prueba que siempre rechaza: los tests
      // de login cortan antes de escribir en la base.
      command: `pnpm --filter @voltis/api exec wrangler dev --port ${PUERTO_API} --var ADMIN_SIN_AUTH:0 --var ADMIN_USUARIO:franco --var ADMIN_PASSWORD:clave-de-prueba-larga --var ADMIN_SESSION_SECRET:secreto-de-sesion-de-prueba-32-caracteres --var TURNSTILE_SECRET:2x0000000000000000000000000000000AA`,
      port: PUERTO_API,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
