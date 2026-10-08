// Almacenamiento de fotos en Vercel Blob. El sitio nunca usa las URLs de Vercel: pide
// /img/<key> a este Worker, que las lee con el token una vez y las deja en la caché de
// Cloudflare. Por eso el store puede ser privado (recomendado: nadie gasta tu transferencia
// bajando las fotos directo de Vercel). Para cambiar de proveedor alcanza con este archivo.
import { get, put } from "@vercel/blob";
import type { Env } from "../env";

export function blobConfigurado(env: Env): boolean {
  return Boolean(env.BLOB_READ_WRITE_TOKEN);
}

// Tiene que coincidir con cómo se creó el store en Vercel.
function acceso(env: Env): "public" | "private" {
  return env.BLOB_ACCESS === "public" ? "public" : "private";
}

export async function guardarFoto(env: Env, pathname: string, archivo: File): Promise<void> {
  await put(pathname, archivo, {
    access: acceso(env),
    token: env.BLOB_READ_WRITE_TOKEN,
    contentType: archivo.type,
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
  });
}

const UN_ANIO = "public, max-age=31536000, immutable";

export async function servirFoto(
  env: Env,
  ctx: { waitUntil(p: Promise<unknown>): void },
  url: string,
  key: string,
): Promise<Response> {
  const cache = caches.default;
  const pedido = new Request(url);
  const enCache = await cache.match(pedido);
  if (enCache) return enCache;

  if (!blobConfigurado(env)) return new Response("Fotos sin configurar", { status: 404 });
  const blob = await get(key, { access: acceso(env), token: env.BLOB_READ_WRITE_TOKEN }).catch(() => null);
  if (!blob || blob.statusCode !== 200) return new Response("No encontrada", { status: 404 });

  const respuesta = new Response(blob.stream, {
    headers: { "Content-Type": blob.blob.contentType, "Cache-Control": UN_ANIO },
  });
  ctx.waitUntil(cache.put(pedido, respuesta.clone()));
  return respuesta;
}
