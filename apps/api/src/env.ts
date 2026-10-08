export type Env = {
  DATABASE_URL: string;
  TURNSTILE_SECRET?: string;
  ALLOWED_ORIGINS: string;
  AVISO_REMITENTE: string;
  AVISO_DESTINO: string;
  AVISOS?: SendEmail;
  IMAGENES: R2Bucket;
  // Cloudflare Access: dominio del equipo (xxx.cloudflareaccess.com) y AUD de la aplicación.
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  // Solo en .dev.vars: desactiva la autenticación del panel en local.
  ADMIN_SIN_AUTH?: string;
  PAGES_DEPLOY_HOOK_URL?: string;
};
