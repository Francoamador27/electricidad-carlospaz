import { z } from "zod";

// Valores de configuración que se editan desde el panel y se aplican al publicar.
export const CONFIG_CAMPOS = {
  gtm_id: {
    label: "ID de Google Tag Manager",
    ayuda: "Formato GTM-XXXXXXX. GA4, Google Ads y el Pixel de Meta se configuran dentro de GTM.",
    schema: z.string().regex(/^GTM-[A-Z0-9]{4,12}$/, "Formato: GTM-XXXXXXX"),
  },
  google_site_verification: {
    label: "Verificación de Google Search Console",
    ayuda: 'El valor de content="..." de la etiqueta HTML que te da Search Console.',
    schema: z.string().regex(/^[A-Za-z0-9_-]{20,100}$/, "Pegá solo el código, sin la etiqueta"),
  },
  meta_domain_verification: {
    label: "Verificación de dominio de Meta (Facebook/Instagram)",
    ayuda: 'El valor de content="..." de la etiqueta facebook-domain-verification.',
    schema: z.string().regex(/^[a-z0-9]{20,64}$/, "Pegá solo el código, sin la etiqueta"),
  },
  bing_site_verification: {
    label: "Verificación de Bing Webmaster Tools",
    ayuda: 'El valor de content="..." de la etiqueta msvalidate.01. Bing alimenta a ChatGPT y Copilot.',
    schema: z.string().regex(/^[A-F0-9]{20,64}$/i, "Pegá solo el código, sin la etiqueta"),
  },
} as const;

export type ClaveConfig = keyof typeof CONFIG_CAMPOS;
export const CLAVES_CONFIG = Object.keys(CONFIG_CAMPOS) as ClaveConfig[];

// Vacío = borrar el valor.
export const configInput = z
  .object(
    Object.fromEntries(
      CLAVES_CONFIG.map((k) => [k, z.union([z.literal(""), CONFIG_CAMPOS[k].schema]).optional()]),
    ) as Record<ClaveConfig, z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"">, z.ZodString]>>>,
  )
  .strict();

export type ConfigSitio = Partial<Record<ClaveConfig, string>>;
