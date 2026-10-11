// Lógica pura de la agenda y las finanzas (sin dependencias: se usa en el navegador y en la API).

export const ZONA_HORARIA = "America/Argentina/Cordoba";
// Argentina no tiene horario de verano: el desfase es fijo.
export const DESFASE = "-03:00";

export type EstadoTrabajo = "agendado" | "en_curso" | "terminado" | "cancelado";
export type MedioPago = "efectivo" | "transferencia" | "mercadopago" | "otro";
export type EstadoCobro = "sin_precio" | "sin_cobrar" | "senado" | "cobrado";

export const ESTADOS_TRABAJO: { valor: EstadoTrabajo; nombre: string }[] = [
  { valor: "agendado", nombre: "Agendado" },
  { valor: "en_curso", nombre: "En curso" },
  { valor: "terminado", nombre: "Terminado" },
  { valor: "cancelado", nombre: "Cancelado" },
];

export const MEDIOS_PAGO: { valor: MedioPago; nombre: string }[] = [
  { valor: "efectivo", nombre: "Efectivo" },
  { valor: "transferencia", nombre: "Transferencia" },
  { valor: "mercadopago", nombre: "Mercado Pago" },
  { valor: "otro", nombre: "Otro" },
];

// ---------- Plata ----------

// "15.000", "15000,50", "$ 15.000,50", "15000.5" → centavos. null si no es un número válido.
export function pesosACentavos(texto: string): number | null {
  let t = texto.replace(/[^\d.,-]/g, "");
  if (!t) return null;
  if (t.includes(",")) {
    t = t.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, ""); // "15.000" = quince mil
  }
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

const formatoPesosEntero = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const formatoPesosDecimal = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatoPesos(centavos: number | null | undefined): string {
  if (centavos == null) return "—";
  return (centavos % 100 === 0 ? formatoPesosEntero : formatoPesosDecimal).format(centavos / 100);
}

// Para precargar un campo de texto: 1500050 → "15000,50".
export function centavosATexto(centavos: number | null | undefined): string {
  if (centavos == null) return "";
  const pesos = Math.trunc(centavos / 100);
  const resto = Math.abs(centavos % 100);
  return resto ? `${pesos},${String(resto).padStart(2, "0")}` : String(pesos);
}

export function estadoCobro(precioCentavos: number | null | undefined, pagadoCentavos: number): EstadoCobro {
  if (!precioCentavos) return pagadoCentavos > 0 ? "cobrado" : "sin_precio";
  if (pagadoCentavos <= 0) return "sin_cobrar";
  if (pagadoCentavos < precioCentavos) return "senado";
  return "cobrado";
}

export const NOMBRE_COBRO: Record<EstadoCobro, string> = {
  sin_precio: "Sin precio",
  sin_cobrar: "Sin cobrar",
  senado: "Señado",
  cobrado: "Cobrado",
};

// ---------- Fechas (siempre en hora de Córdoba) ----------

const partesFecha = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA_HORARIA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const partesHora = new Intl.DateTimeFormat("en-GB", {
  timeZone: ZONA_HORARIA,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// Date → "AAAA-MM-DD" en Córdoba.
export function fechaLocal(d: Date): string {
  return partesFecha.format(d);
}

// Date → "HH:MM" en Córdoba.
export function horaLocal(d: Date): string {
  return partesHora.format(d);
}

export function hoyLocal(): string {
  return fechaLocal(new Date());
}

// "AAAA-MM-DD" + "HH:MM" (Córdoba) → ISO con desfase, listo para la API.
export function aIso(fecha: string, hora = "00:00"): string {
  return `${fecha}T${hora}:00${DESFASE}`;
}

export function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

// Días (AAAA-MM-DD) que ocupa un trabajo. Con "todo el día", el fin es exclusivo.
export function diasQueOcupa(inicio: Date, fin: Date, todoElDia: boolean): string[] {
  const primero = fechaLocal(inicio);
  // Fin exclusivo: un evento que termina justo a las 00:00 no ocupa ese día.
  const ultimo = todoElDia || horaLocal(fin) === "00:00" ? sumarDias(fechaLocal(fin), -1) : fechaLocal(fin);
  const dias: string[] = [];
  for (let d = primero; d <= ultimo && dias.length < 400; d = sumarDias(d, 1)) dias.push(d);
  return dias.length ? dias : [primero];
}

// Lunes de la semana de una fecha.
export function inicioSemana(fecha: string): string {
  const dia = new Date(`${fecha}T12:00:00Z`).getUTCDay(); // 0 = domingo
  return sumarDias(fecha, -((dia + 6) % 7));
}

// Grilla de un mes: semanas de lunes a domingo que cubren el mes completo.
export function grillaMes(anio: number, mes: number): string[][] {
  const primero = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const desde = inicioSemana(primero);
  const semanas: string[][] = [];
  let d = desde;
  do {
    const semana: string[] = [];
    for (let i = 0; i < 7; i++) {
      semana.push(d);
      d = sumarDias(d, 1);
    }
    semanas.push(semana);
  } while (d.slice(0, 7) === primero.slice(0, 7));
  return semanas;
}

const formatoDiaLargo = new Intl.DateTimeFormat("es-AR", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
});

// "AAAA-MM-DD" → "Hoy", "Mañana", "Ayer" o "jueves 16 de octubre".
export function nombreDia(fecha: string, hoy = hoyLocal()): string {
  if (fecha === hoy) return "Hoy";
  if (fecha === sumarDias(hoy, 1)) return "Mañana";
  if (fecha === sumarDias(hoy, -1)) return "Ayer";
  return formatoDiaLargo.format(new Date(`${fecha}T12:00:00Z`));
}

// ---------- Mapas sin API (links públicos de Google Maps, Waze y OpenStreetMap) ----------

export type Coordenadas = { lat: number; lng: number };

function valida(lat: number, lng: number): Coordenadas | null {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    ? { lat, lng }
    : null;
}

// Lee coordenadas de un link de Google Maps: ".../@-31.42,-64.49,15z", "?q=-31.42,-64.49",
// "!3d-31.42!4d-64.49" (lugar marcado). Los links cortos (maps.app.goo.gl) no las traen:
// los resuelve la API siguiendo la redirección.
export function leerCoordenadasMaps(url: string): Coordenadas | null {
  const lugar = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (lugar) return valida(Number(lugar[1]), Number(lugar[2]));
  const arroba = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (arroba) return valida(Number(arroba[1]), Number(arroba[2]));
  const param = decodeURIComponent(url).match(/[?&](?:q|ll|query|destination)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (param) return valida(Number(param[1]), Number(param[2]));
  return null;
}

export function esLinkCortoMaps(url: string): boolean {
  return /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(url.trim());
}

export function esLinkMaps(url: string): boolean {
  return /^https?:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(
    url.trim(),
  );
}

type Destino = { lat?: number | null; lng?: number | null; direccion?: string | null; localidad?: string | null };

function destinoTexto(d: Destino): string | null {
  if (d.lat != null && d.lng != null) return `${d.lat},${d.lng}`;
  const partes = [d.direccion, d.localidad, "Córdoba, Argentina"].filter(Boolean);
  return d.direccion || d.localidad ? partes.join(", ") : null;
}

// Abre Google Maps con la ruta desde donde estás (app en el celular, web en la compu).
export function linkComoLlegar(d: Destino): string | null {
  const destino = destinoTexto(d);
  return destino ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}` : null;
}

export function linkWaze(d: Destino): string | null {
  if (d.lat != null && d.lng != null) return `https://waze.com/ul?ll=${d.lat},${d.lng}&navigate=yes`;
  const destino = destinoTexto(d);
  return destino ? `https://waze.com/ul?q=${encodeURIComponent(destino)}&navigate=yes` : null;
}

// Mapa embebible de OpenStreetMap (gratuito, sin clave).
export function linkMapaEmbebido(c: Coordenadas): string {
  const m = 0.004;
  const bbox = [c.lng - m, c.lat - m * 0.7, c.lng + m, c.lat + m * 0.7].map((n) => n.toFixed(5)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${c.lat},${c.lng}`;
}

// ---------- WhatsApp a un cliente ----------

// Número argentino a wa.me: "351 555-1234", "0351 15 555-1234" o "+54 9 351…" → 5493515551234.
export function linkWhatsappCliente(telefono: string, texto?: string): string {
  let n = telefono.replace(/\D/g, "");
  if (n.startsWith("549")) n = n.slice(3);
  else if (n.startsWith("54")) n = n.slice(2);
  if (n.startsWith("0")) n = n.slice(1);
  // "351 15 5551234": se saca el 15 que va después del código de área (área de 3, 4 o 2 dígitos).
  if (n.length === 12) {
    for (const area of [3, 4, 2]) {
      if (n.slice(area, area + 2) === "15") {
        n = n.slice(0, area) + n.slice(area + 2);
        break;
      }
    }
  }
  n = `549${n}`;
  return `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}
