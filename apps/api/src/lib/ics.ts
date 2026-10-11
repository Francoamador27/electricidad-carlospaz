// Calendario suscribible (.ics, RFC 5545) con los trabajos de la agenda, para verlos en la app
// Calendario del iPhone (o Google Calendar). Función pura: fácil de probar.
import { fechaLocal, sumarDias } from "@voltis/shared/agenda";

export type TrabajoIcs = {
  id: number;
  titulo: string;
  clienteNombre: string;
  clienteTelefono: string | null;
  direccion: string | null;
  localidad: string | null;
  descripcion: string | null;
  quienVa: string | null;
  servicio: string | null;
  inicio: Date;
  fin: Date;
  todoElDia: boolean;
  estado: string;
  recordatorioMin: number | null;
  lat: number | null;
  lng: number | null;
  actualizado: Date;
};

const escapar = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Las líneas no pueden pasar de 75 bytes: se cortan y siguen con un espacio.
function plegar(linea: string): string {
  const bytes = new TextEncoder().encode(linea);
  if (bytes.length <= 75) return linea;
  const partes: string[] = [];
  let actual = "";
  let largo = 0;
  for (const ch of linea) {
    const b = new TextEncoder().encode(ch).length;
    if (largo + b > (partes.length ? 74 : 75)) {
      partes.push(actual);
      actual = "";
      largo = 0;
    }
    actual += ch;
    largo += b;
  }
  partes.push(actual);
  return partes.join("\r\n ");
}

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const soloFecha = (f: string) => f.replace(/-/g, "");

export function generarIcs(trabajos: TrabajoIcs[], opciones: { dominio: string; urlPanel: string }): string {
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Voltis//Agenda//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Voltis — Agenda",
    "X-WR-TIMEZONE:America/Argentina/Cordoba",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];

  for (const t of trabajos) {
    const resumen = [t.titulo, t.clienteNombre].filter(Boolean).join(" — ");
    const lugar = [t.direccion, t.localidad].filter(Boolean).join(", ");
    const detalle = [
      t.servicio && `Trabajo: ${t.servicio}`,
      t.clienteTelefono && `Tel.: ${t.clienteTelefono}`,
      t.quienVa && `Va: ${t.quienVa}`,
      t.descripcion,
      `Panel: ${opciones.urlPanel}/admin/agenda?trabajo=${t.id}`,
    ]
      .filter(Boolean)
      .join("\n");

    lineas.push("BEGIN:VEVENT", `UID:trabajo-${t.id}@${opciones.dominio}`, `DTSTAMP:${utc(t.actualizado)}`);
    if (t.todoElDia) {
      const desde = fechaLocal(t.inicio);
      // Fin exclusivo; si por error coincide con el inicio, ocupa ese día.
      let hasta = fechaLocal(t.fin);
      if (hasta <= desde) hasta = sumarDias(desde, 1);
      lineas.push(`DTSTART;VALUE=DATE:${soloFecha(desde)}`, `DTEND;VALUE=DATE:${soloFecha(hasta)}`);
    } else {
      lineas.push(`DTSTART:${utc(t.inicio)}`, `DTEND:${utc(t.fin)}`);
    }
    lineas.push(`SUMMARY:${escapar(resumen)}`);
    if (lugar) lineas.push(`LOCATION:${escapar(lugar)}`);
    if (t.lat != null && t.lng != null) lineas.push(`GEO:${t.lat};${t.lng}`);
    lineas.push(`DESCRIPTION:${escapar(detalle)}`);
    lineas.push(`STATUS:${t.estado === "cancelado" ? "CANCELLED" : "CONFIRMED"}`);
    if (t.recordatorioMin && !t.todoElDia && t.estado !== "cancelado") {
      lineas.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapar(resumen)}`, `TRIGGER:-PT${t.recordatorioMin}M`, "END:VALARM");
    }
    lineas.push("END:VEVENT");
  }
  lineas.push("END:VCALENDAR");
  return lineas.map(plegar).join("\r\n") + "\r\n";
}
