// Cliente del panel para /admin/api. En producción va con la cookie de Cloudflare Access.
import { API_URL } from "@/lib/tracking";

export class ErrorApi extends Error {
  constructor(
    public estado: number,
    public codigo: string,
    public detalles?: { path: (string | number)[]; message: string }[],
  ) {
    super(codigo);
  }
}

export async function adminApi<T = unknown>(ruta: string, init: RequestInit = {}): Promise<T> {
  const esForm = init.body instanceof FormData;
  const res = await fetch(`${API_URL}/admin/api${ruta}`, {
    ...init,
    credentials: "include",
    headers: esForm ? init.headers : { "Content-Type": "application/json", ...init.headers },
  });
  if (res.status === 204) return undefined as T;
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) throw new ErrorApi(res.status, datos.error ?? "error", datos.detalles);
  return datos as T;
}

const MENSAJES: Record<string, string> = {
  slug_repetido: "Ya existe otro elemento con esa URL (slug). Cambiala.",
  datos_invalidos: "Revisá los campos marcados.",
  en_uso: "No se puede borrar: hay proyectos o posts que lo usan.",
  no_autorizado: "Tu sesión venció. Recargá la página.",
  archivo_grande: "La foto es demasiado grande.",
  formato_invalido: "Formato de imagen no soportado.",
  error_almacenamiento: "No se pudo guardar la foto en Vercel Blob. Revisá el token o el límite del plan.",
  fotos_sin_configurar: "Falta configurar el almacenamiento de fotos (Vercel Blob).",
};

export function mensajeError(e: unknown): string {
  if (e instanceof ErrorApi) return MENSAJES[e.codigo] ?? `Error del servidor (${e.estado}).`;
  return "No se pudo conectar con la API. ¿Está corriendo?";
}

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
