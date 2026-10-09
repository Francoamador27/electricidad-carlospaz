import { expect, test } from "@playwright/test";
import { crearSesion, leerSesion } from "../../api/src/lib/sesion";
import type { Env } from "../../api/src/env";

// Tests de la sesión del panel (corren en Node).
const base = {
  ADMIN_USUARIO: "franco",
  ADMIN_PASSWORD: "clave-de-prueba-larga",
  ADMIN_SESSION_SECRET: "secreto-de-sesion-de-prueba-32-caracteres",
} as Env;

test("una sesión válida se reconoce", async () => {
  const token = await crearSesion(base, "franco");
  expect(await leerSesion(base, token)).toBe("franco");
});

test("cambiar la contraseña invalida las sesiones abiertas", async () => {
  const token = await crearSesion(base, "franco");
  expect(await leerSesion({ ...base, ADMIN_PASSWORD: "otra-clave-nueva-larga" }, token)).toBeNull();
});

test("una sesión de otro usuario o adulterada no sirve", async () => {
  const token = await crearSesion(base, "franco");
  expect(await leerSesion({ ...base, ADMIN_USUARIO: "otro" }, token)).toBeNull();
  expect(await leerSesion(base, token.slice(0, -3) + "abc")).toBeNull();
  expect(await leerSesion(base, undefined)).toBeNull();
});
