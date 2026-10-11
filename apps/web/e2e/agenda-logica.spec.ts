import { expect, test } from "@playwright/test";
import {
  aIso,
  diasQueOcupa,
  esLinkCortoMaps,
  estadoCobro,
  formatoPesos,
  grillaMes,
  inicioSemana,
  leerCoordenadasMaps,
  linkComoLlegar,
  linkWaze,
  linkWhatsappCliente,
  pesosACentavos,
  sumarDias,
} from "@voltis/shared/agenda";
import { generarIcs, type TrabajoIcs } from "../../api/src/lib/ics";

// Lógica de la agenda y finanzas (corre en Node, sin navegador).

test("pesos a centavos acepta los formatos que se escriben en Argentina", () => {
  expect(pesosACentavos("15000")).toBe(1_500_000);
  expect(pesosACentavos("15.000")).toBe(1_500_000);
  expect(pesosACentavos("$ 15.000,50")).toBe(1_500_050);
  expect(pesosACentavos("1.250.000")).toBe(125_000_000);
  expect(pesosACentavos("150,5")).toBe(15_050);
  expect(pesosACentavos("abc")).toBeNull();
  expect(formatoPesos(1_500_000).replace(/\s/g, " ")).toMatch(/\$ ?15\.000$/);
});

test("estado de cobro: sin cobrar, señado y cobrado", () => {
  expect(estadoCobro(100_00, 0)).toBe("sin_cobrar");
  expect(estadoCobro(100_00, 30_00)).toBe("senado");
  expect(estadoCobro(100_00, 100_00)).toBe("cobrado");
  expect(estadoCobro(null, 0)).toBe("sin_precio");
});

test("un trabajo de todo el día del 16 al 18 ocupa 3 días (fin exclusivo)", () => {
  const dias = diasQueOcupa(new Date(aIso("2026-10-16")), new Date(aIso("2026-10-19")), true);
  expect(dias).toEqual(["2026-10-16", "2026-10-17", "2026-10-18"]);
});

test("un trabajo de horas a las 23:30 cae en el día correcto de Córdoba", () => {
  const dias = diasQueOcupa(new Date(aIso("2026-10-16", "23:30")), new Date(aIso("2026-10-17", "01:00")), false);
  expect(dias).toEqual(["2026-10-16", "2026-10-17"]);
  expect(diasQueOcupa(new Date(aIso("2026-10-16", "09:00")), new Date(aIso("2026-10-16", "11:00")), false)).toEqual(["2026-10-16"]);
});

test("grilla del mes: semanas de lunes a domingo que cubren todo el mes", () => {
  const semanas = grillaMes(2026, 10);
  expect(semanas[0][0]).toBe("2026-09-28"); // lunes
  expect(semanas.flat()).toContain("2026-10-31");
  expect(semanas.every((s) => s.length === 7)).toBe(true);
  expect(inicioSemana("2026-10-18")).toBe("2026-10-12"); // domingo → lunes anterior
  expect(sumarDias("2026-12-31", 1)).toBe("2027-01-01");
});

test("lee coordenadas de los distintos links de Google Maps", () => {
  expect(leerCoordenadasMaps("https://www.google.com/maps/@-31.4237,-64.4977,15z")).toEqual({ lat: -31.4237, lng: -64.4977 });
  expect(leerCoordenadasMaps("https://maps.google.com/?q=-31.24,-64.46")).toEqual({ lat: -31.24, lng: -64.46 });
  expect(
    leerCoordenadasMaps("https://www.google.com/maps/place/X/@-31.1,-64.1,15z/data=!3m1!4b1!8m2!3d-31.2452!4d-64.4661"),
  ).toEqual({ lat: -31.2452, lng: -64.4661 });
  expect(leerCoordenadasMaps("https://maps.app.goo.gl/abc123")).toBeNull();
  expect(esLinkCortoMaps("https://maps.app.goo.gl/abc123")).toBe(true);
});

test("Cómo llegar y Waze se arman sin API ni clave", () => {
  expect(linkComoLlegar({ lat: -31.2, lng: -64.4 })).toBe("https://www.google.com/maps/dir/?api=1&destination=-31.2%2C-64.4");
  expect(linkComoLlegar({ direccion: "San Martín 123", localidad: "Cosquín" })).toContain(
    encodeURIComponent("San Martín 123, Cosquín, Córdoba, Argentina"),
  );
  expect(linkWaze({ lat: -31.2, lng: -64.4 })).toBe("https://waze.com/ul?ll=-31.2,-64.4&navigate=yes");
  expect(linkComoLlegar({})).toBeNull();
});

test("WhatsApp al cliente con número argentino", () => {
  expect(linkWhatsappCliente("351 555-1234")).toBe("https://wa.me/5493515551234");
  expect(linkWhatsappCliente("0351 15 5551234")).toBe("https://wa.me/5493515551234");
  expect(linkWhatsappCliente("11 15 4444 5555")).toBe("https://wa.me/5491144445555");
  expect(linkWhatsappCliente("+54 9 351 555 1234")).toBe("https://wa.me/5493515551234");
});

test("calendario .ics: eventos de horas y de varios días, con alarma", () => {
  const base: TrabajoIcs = {
    id: 7,
    titulo: "Cambio de tablero",
    clienteNombre: "Juan Pérez",
    clienteTelefono: "351 555 1234",
    direccion: "San Martín 123",
    localidad: "Cosquín",
    descripcion: "Tablero con diferencial; 3 circuitos",
    quienVa: "Franco",
    servicio: "Tableros eléctricos",
    inicio: new Date(aIso("2026-10-20", "09:00")),
    fin: new Date(aIso("2026-10-20", "11:00")),
    todoElDia: false,
    estado: "agendado",
    recordatorioMin: 60,
    lat: -31.24,
    lng: -64.46,
    actualizado: new Date("2026-10-11T12:00:00Z"),
  };
  const ics = generarIcs(
    [base, { ...base, id: 8, todoElDia: true, inicio: new Date(aIso("2026-10-21")), fin: new Date(aIso("2026-10-24")), recordatorioMin: null }],
    { dominio: "voltis.test", urlPanel: "https://voltis.test" },
  );
  expect(ics).toContain("BEGIN:VCALENDAR");
  expect(ics).toContain("UID:trabajo-7@voltis.test");
  expect(ics).toContain("DTSTART:20261020T120000Z"); // 9:00 de Córdoba = 12:00 UTC
  expect(ics).toContain("DTSTART;VALUE=DATE:20261021");
  expect(ics).toContain("DTEND;VALUE=DATE:20261024");
  expect(ics).toContain("LOCATION:San Martín 123\\, Cosquín");
  expect(ics).toContain("TRIGGER:-PT60M");
  // Ninguna línea pasa de 75 bytes (RFC 5545).
  for (const linea of ics.split("\r\n")) expect(new TextEncoder().encode(linea).length).toBeLessThanOrEqual(75);
});
