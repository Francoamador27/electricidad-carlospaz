// Envío de emails por SMTP (casilla de Hostinger). Lo usan los avisos de consultas y el
// código de acceso al panel.
import { WorkerMailer } from "worker-mailer";
import type { Env } from "../env";

export function smtpListo(env: Env): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

type Correo = {
  para: string[];
  asunto: string;
  texto: string;
  html?: string;
  responderA?: { nombre: string; email: string };
};

export async function enviarCorreo(env: Env, c: Correo): Promise<void> {
  const puerto = Number(env.SMTP_PORT ?? 465);
  await WorkerMailer.send(
    {
      host: env.SMTP_HOST!,
      port: puerto,
      // 465 = SSL directo (Hostinger). 587 = STARTTLS.
      secure: puerto === 465,
      startTls: puerto !== 465,
      credentials: { username: env.SMTP_USER!, password: env.SMTP_PASS! },
      authType: ["plain", "login"],
    },
    {
      from: { name: "Voltis — sitio web", email: env.SMTP_USER! },
      to: c.para,
      reply: c.responderA ? { name: c.responderA.nombre, email: c.responderA.email } : undefined,
      subject: c.asunto,
      text: c.texto,
      html: c.html,
    },
  );
}
