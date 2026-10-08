// Almacenamiento de fotos en Vercel Blob. El sitio nunca usa las URLs de Vercel: pide
// /img/<key> a este Worker, que las trae una vez y las deja en la caché de Cloudflare.
// Para cambiar de proveedor alcanza con cambiar este archivo.
import { put } from "@vercel/blob";
import type { Env } from "../env";

export function blobConfigurado(env: Env): boolean {
  return Boolean(env.BLOB_READ_WRITE_TOKEN);
}

// Token "vercel_blob_rw_<storeId>_<secreto>" → https://<storeid>.public.blob.vercel-storage.com
function baseBlob(env: Env): string {
  if (env.BLOB_BASE_URL) return env.BLOB_BASE_URL.replace(/\/$/, "");
  const storeId = env.BLOB_READ_WRITE_TOKEN?.split("_")[3];
  if (!storeId) throw new Error("BLOB_READ_WRITE_TOKEN inválido");
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
}

export async function guardarFoto(env: Env, pathname: string, archivo: File): Promise<void> {
  await put(pathname, archivo, {
    access: "public",
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

  if (!blobConfigurado(env) && !env.BLOB_BASE_URL) return new Response("Fotos sin configurar", { status: 404 });
  const origen = await fetch(`${baseBlob(env)}/${key}`);
  if (!origen.ok) return new Response("No encontrada", { status: 404 });

  const respuesta = new Response(origen.body, {
    headers: {
      "Content-Type": origen.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": UN_ANIO,
    },
  });
  ctx.waitUntil(cache.put(pedido, respuesta.clone()));
  return respuesta;
}
