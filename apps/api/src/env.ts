export type Env = {
  DATABASE_URL: string;
  TURNSTILE_SECRET?: string;
  ALLOWED_ORIGINS: string;
  AVISO_REMITENTE: string;
  AVISO_DESTINO: string;
  AVISOS?: SendEmail;
};
