import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { IMAGEN_OG } from "@/lib/seo";
import { getConfig } from "@/lib/contenido";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const BASE_URL = SITE_URL;

const metadataBase: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Electricista en Carlos Paz para casas y comercios | Voltis",
    template: "%s | Voltis",
  },

  description:
    "Electricista en Carlos Paz para casas y comercios: arreglos, tomacorrientes, bocas de luz, ventiladores de techo, tableros e instalaciones. Respondo en el día.",

  keywords: [
    "electricista en Carlos Paz",
    "electricista Carlos Paz",
    "electricista para casas Carlos Paz",
    "electricista para comercios Carlos Paz",
    "electricista locales comerciales Carlos Paz",
    "instalaciones eléctricas en Carlos Paz",
    "electricidad en Carlos Paz",
    "electricista en Punilla",
    "arreglos eléctricos Carlos Paz",
    "instalación ventilador de techo Carlos Paz",
    "tomacorrientes y bocas de luz Carlos Paz",
    "tableros eléctricos Carlos Paz",
    "electricista Valle Hermoso",
    "electricista Cosquín",
    "electricista La Falda",
    "electricista La Cumbre",
    "cámaras de seguridad Carlos Paz",
    "certificado de instalación eléctrica apta Carlos Paz",
    "Voltis instalaciones eléctricas",
  ],

  authors: [{ name: "Voltis", url: BASE_URL }],
  creator: "Voltis",
  publisher: "Voltis",
  applicationName: "Voltis",
  category: "Electricidad y servicios eléctricos",
  referrer: "origin-when-cross-origin",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "Voltis",
    title: "Electricista en Carlos Paz para casas y comercios | Voltis",
    description:
      "Arreglos, agregados, tableros e instalaciones para casas y comercios en Carlos Paz y Punilla. Trabajo con garantía escrita.",
    images: [IMAGEN_OG],
  },

  twitter: {
    card: "summary_large_image",
    title: "Electricista en Carlos Paz para casas y comercios | Voltis",
    description:
      "Arreglos, agregados, tableros e instalaciones para casas y comercios en Carlos Paz y Punilla.",
    images: [IMAGEN_OG.url],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  appleWebApp: {
    capable: true,
    title: "Voltis",
    statusBarStyle: "default",
  },

};

// Códigos de verificación (Search Console, Meta, Bing) cargados desde el panel.
export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    ...metadataBase,
    verification: {
      google: config.google_site_verification,
      other: {
        ...(config.bing_site_verification && { "msvalidate.01": config.bing_site_verification }),
        ...(config.meta_domain_verification && {
          "facebook-domain-verification": config.meta_domain_verification,
        }),
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`h-full ${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        {/* Geo tags — SEO local */}
        <meta name="geo.region" content="AR-X" />
        <meta name="geo.placename" content="Villa Carlos Paz, Córdoba, Argentina" />

        {/* Theme color (barra del navegador en mobile) */}
        <meta name="theme-color" content="#f59e0b" />

      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
