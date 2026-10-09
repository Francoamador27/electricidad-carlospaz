// Aviso por email de cada consulta, por SMTP (casilla de Hostinger). Sin SMTP configurado
// (desarrollo) solo se loguea en la consola.
import { enviarCorreo, smtpListo } from "./correo";
import type { Consulta } from "@voltis/shared";
import type { Env } from "../env";

const ETIQUETAS: Record<string, string> = {
  residential: "Vivienda / Casa",
  commercial: "Local / Comercio",
  industrial: "Industria / Empresa",
  normal: "Normal",
  urgent: "Lo antes posible",
  emergency: "Lo antes posible",
};

function filas(c: Consulta): [string, string][] {
  const todas: [string, string | undefined][] = [
    ["Nombre", c.nombre],
    ["Teléfono", c.telefono],
    ["Email", c.email || undefined],
    ["Localidad", c.localidad],
    ["Servicio", c.servicio],
    ["Propiedad", c.tipoPropiedad && ETIQUETAS[c.tipoPropiedad]],
    ["Para cuándo", c.urgencia && ETIQUETAS[c.urgencia]],
    ["Página", c.paginaOrigen],
    ["Origen", origen(c)],
  ];
  return todas.filter((f): f is [string, string] => Boolean(f[1]));
}

function origen(c: Consulta): string | undefined {
  const a = c.atribucion;
  if (!a) return undefined;
  if (a.gclid || a.gbraid || a.wbraid) return "Google Ads";
  return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ") || undefined;
}

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

// Número argentino a wa.me: 351 1234567 -> 5493511234567.
function linkWhatsapp(c: Consulta): string {
  let n = c.telefono.replace(/\D/g, "");
  if (n.startsWith("0")) n = n.slice(1);
  if (!n.startsWith("54")) n = `549${n}`;
  const texto = `Hola ${c.nombre.split(" ")[0]}, te escribimos de Voltis por tu consulta.`;
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}

function cuerpoTexto(c: Consulta): string {
  return [...filas(c).map(([k, v]) => `${k}: ${v}`), "", c.mensaje ?? "", "", `Responder por WhatsApp: ${linkWhatsapp(c)}`]
    .join("\n")
    .trim();
}

function cuerpoHtml(c: Consulta): string {
  const tabla = filas(c)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${escapar(k)}</td><td style="padding:4px 0;color:#0f172a"><strong>${escapar(v)}</strong></td></tr>`,
    )
    .join("");
  const mensaje = c.mensaje
    ? `<p style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;white-space:pre-line">${escapar(c.mensaje)}</p>`
    : "";
  return `<div style="font-family:Arial,sans-serif;font-size:15px;max-width:560px">
<h2 style="margin:0 0 12px;color:#0f172a">Nueva consulta desde el sitio</h2>
<table style="border-collapse:collapse">${tabla}</table>
${mensaje}
<p><a href="${linkWhatsapp(c)}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:6px">Responder por WhatsApp</a></p>
<p style="color:#94a3b8;font-size:12px">También la ves en el panel: Consultas.</p>
</div>`;
}


export async function enviarAviso(env: Env, c: Consulta): Promise<void> {
  const asunto = `Nueva consulta: ${c.nombre}${c.localidad ? ` (${c.localidad})` : ""}`;
  if (!smtpListo(env) || !env.AVISO_DESTINO) {
    console.log(`[aviso] ${asunto}\n${cuerpoTexto(c)}`);
    return;
  }
  await enviarCorreo(env, {
    para: env.AVISO_DESTINO.split(",").map((e) => e.trim()),
    // "Responder" en el mail le contesta directo al cliente, si dejó su email.
    responderA: c.email ? { nombre: c.nombre, email: c.email } : undefined,
    asunto,
    texto: cuerpoTexto(c),
    html: cuerpoHtml(c),
  });
}
