import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
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
    default: "Electricista en Carlos Paz y Punilla | Voltis",
    template: "%s | Voltis",
  },

  description:
    "Electricistas en Carlos Paz y la región de Punilla, Córdoba. Instalaciones domiciliarias, comerciales e industriales, mantenimiento y reparaciones eléctricas con garantía.",

  keywords: [
    "electricista en Carlos Paz",
    "electricista Carlos Paz",
    "instalaciones domiciliarias Carlos Paz",
    "instalaciones eléctricas en Carlos Paz",
    "electricidad en Carlos Paz",
    "empresa de electricidad Carlos Paz",
    "electricista en Punilla",
    "instalaciones domiciliarias en Punilla",
    "electricidad industrial Carlos Paz",
    "mantenimiento eléctrico Carlos Paz",
    "reparaciones eléctricas Carlos Paz",
    "tableros eléctricos Carlos Paz",
    "servicio eléctrico domiciliario",
    "instalador eléctrico Córdoba",
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
    title: "Electricista en Carlos Paz y Punilla | Voltis",
    description:
      "Electricistas en Carlos Paz y Punilla, Córdoba. Instalaciones, mantenimiento y reparaciones eléctricas con garantía.",
    images: [
      {
        url: "/logo-voltis.png",
        width: 1080,
        height: 1080,
        alt: "Voltis — Instalaciones Eléctricas en Carlos Paz y Punilla",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Electricista en Carlos Paz y Punilla | Voltis",
    description:
      "Electricistas en Carlos Paz y Punilla. Instalaciones, mantenimiento, reparaciones y cámaras de seguridad.",
    images: ["/logo-voltis.png"],
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
        <meta name="geo.position" content="-31.4237;-64.4977" />
        <meta name="ICBM" content="-31.4237, -64.4977" />

        {/* Theme color (barra del navegador en mobile) */}
        <meta name="theme-color" content="#f59e0b" />

      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
