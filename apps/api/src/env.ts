export type Env = {
  DATABASE_URL: string;
  TURNSTILE_SECRET?: string;
  ALLOWED_ORIGINS: string;
  AVISO_DESTINO?: string;
  // Aviso por email de cada consulta (SMTP de Hostinger).
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  // Vercel Blob (fotos): token del store y tipo de acceso ("private" por defecto).
  BLOB_READ_WRITE_TOKEN?: string;
  BLOB_ACCESS?: "public" | "private";
  // Cloudflare Access: dominio del equipo (xxx.cloudflareaccess.com) y AUD de la aplicación.
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  // Solo en .dev.vars: desactiva la autenticación del panel en local.
  ADMIN_SIN_AUTH?: string;
  PAGES_DEPLOY_HOOK_URL?: string;
};
