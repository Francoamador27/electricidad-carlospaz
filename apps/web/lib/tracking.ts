// Medición: eventos a GTM (dataLayer) y registro propio de clics en la API.

type Params = Record<string, string | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Conversión que ya funciona en la cuenta: se usa hasta cargar las variables de entorno.
const CONVERSION_ACTUAL = "AW-18521160532/8W6iCNXAlKcdENT2yf9E";

// Conversiones de Google Ads (send_to de cada acción: AW-XXXXXXXXX/etiqueta).
const CONVERSIONES = {
  whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO_WHATSAPP || CONVERSION_ACTUAL,
  llamada: process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO_LLAMADA || undefined,
  formulario: process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO_FORMULARIO || CONVERSION_ACTUAL,
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || undefined;

// Sin gtag (bloqueador o etiqueta desactivada) no se envía nada.
export function reportarConversion(tipo: keyof typeof CONVERSIONES): void {
  const sendTo = CONVERSIONES[tipo];
  if (!sendTo || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: sendTo,
    pagina_origen: window.location.pathname,
    transport_type: "beacon",
  });
}

// Evento de GA4 con nombre propio (click_whatsapp / click_telefono) y la página de origen.
function eventoGa4(evento: string, ctx: ReturnType<typeof contextoPagina>): void {
  if (!GA4_ID || typeof window.gtag !== "function") return;
  window.gtag("event", evento, {
    send_to: GA4_ID,
    pagina_origen: ctx.pagina,
    servicio: ctx.servicio,
    zona: ctx.zona,
    transport_type: "beacon",
  });
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const CLAVE_ATRIBUCION = "voltis_atribucion";
const PARAMS_ATRIBUCION = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

// Guarda UTM y click IDs de Google Ads de la URL de entrada para la sesión.
export function capturarAtribucion(): void {
  const url = new URLSearchParams(window.location.search);
  const datos: Record<string, string> = {};
  for (const p of PARAMS_ATRIBUCION) {
    const v = url.get(p);
    if (v) datos[p] = v.slice(0, 500);
  }
  if (!Object.keys(datos).length) return;
  try {
    sessionStorage.setItem(CLAVE_ATRIBUCION, JSON.stringify(datos));
  } catch {
    // Almacenamiento bloqueado: seguimos sin atribución.
  }
}

export function leerAtribucion(): Record<string, string> | undefined {
  try {
    const raw = sessionStorage.getItem(CLAVE_ATRIBUCION);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

// Servicio y zona según la URL actual (/servicios/<slug>, /zonas/<slug>).
export function contextoPagina(): { pagina: string; servicio?: string; zona?: string } {
  const pagina = window.location.pathname;
  const [, seccion, slug] = pagina.split("/");
  return {
    pagina,
    servicio: seccion === "servicios" && slug ? slug : undefined,
    zona: seccion === "zonas" && slug ? slug : undefined,
  };
}

export function track(evento: string, params: Params = {}): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: evento, ...params });
}

export type TipoClic = "click_whatsapp" | "click_telefono";

// Envía el clic a GTM y lo registra en la base. sendBeacon no bloquea la navegación.
export function registrarClic(tipo: TipoClic): void {
  const ctx = contextoPagina();
  track(tipo, ctx);
  eventoGa4(tipo, ctx);
  reportarConversion(tipo === "click_telefono" ? "llamada" : "whatsapp");
  const cuerpo = JSON.stringify({ tipo, ...ctx, atribucion: leerAtribucion() });
  try {
    navigator.sendBeacon(`${API_URL}/api/eventos`, cuerpo);
  } catch {
    // Sin beacon (navegador viejo o bloqueado): GTM igual recibió el evento.
  }
}

export function tipoDeLink(href: string): TipoClic | undefined {
  if (href.startsWith("https://wa.me/") || href.startsWith("https://api.whatsapp.com/")) {
    return "click_whatsapp";
  }
  if (href.startsWith("tel:")) return "click_telefono";
  return undefined;
}
