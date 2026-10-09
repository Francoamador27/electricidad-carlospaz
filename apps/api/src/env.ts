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
  // Login del panel (secretos). La contraseña necesita 12+ caracteres y el secreto de sesión 32+.
  ADMIN_USUARIO?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  // Solo en .dev.vars: desactiva la autenticación del panel en local.
  ADMIN_SIN_AUTH?: string;
  PAGES_DEPLOY_HOOK_URL?: string;
};
