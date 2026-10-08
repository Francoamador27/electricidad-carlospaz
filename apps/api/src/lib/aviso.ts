import { EmailMessage } from "cloudflare:email";
import type { Consulta } from "@voltis/shared";
import type { Env } from "../env";

function base64Utf8(s: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(s)));
}

function cuerpo(c: Consulta): string {
  const filas: [string, string | undefined][] = [
    ["Nombre", c.nombre],
    ["Teléfono", c.telefono],
    ["Email", c.email],
    ["Localidad", c.localidad],
    ["Servicio", c.servicio],
    ["Propiedad", c.tipoPropiedad],
    ["Urgencia", c.urgencia],
    ["Página", c.paginaOrigen],
    ["Mensaje", c.mensaje],
  ];
  return filas
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

// Aviso por Email Routing. Sin binding configurado (desarrollo) solo se loguea.
export async function enviarAviso(env: Env, c: Consulta): Promise<void> {
  const asunto = `Nueva consulta: ${c.nombre}${c.localidad ? ` (${c.localidad})` : ""}`;
  if (!env.AVISOS || !env.AVISO_DESTINO) {
    console.log(`[aviso] ${asunto}\n${cuerpo(c)}`);
    return;
  }
  const raw = [
    `From: Voltis <${env.AVISO_REMITENTE}>`,
    `To: ${env.AVISO_DESTINO}`,
    `Subject: =?UTF-8?B?${base64Utf8(asunto)}?=`,
    `Message-ID: <${crypto.randomUUID()}@${env.AVISO_REMITENTE.split("@")[1]}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Utf8(cuerpo(c)).replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");
  await env.AVISOS.send(new EmailMessage(env.AVISO_REMITENTE, env.AVISO_DESTINO, raw));
}
