import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

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

const BASE_URL = "https://www.voltis.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Electricista en Carlos Paz y Punilla | Voltis",
    template: "%s | Voltis",
  },

  description:
    "Electricistas matriculados en Carlos Paz y la región de Punilla, Córdoba. Instalaciones domiciliarias, comerciales e industriales, mantenimiento y reparaciones eléctricas con garantía.",

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
    "urgencias eléctricas Carlos Paz",
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
      "Electricistas matriculados en Carlos Paz y Punilla, Córdoba. Instalaciones, mantenimiento y reparaciones eléctricas con garantía. Urgencias 24/7.",
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
      "Electricistas matriculados en Carlos Paz y Punilla. Instalaciones, mantenimiento, reparaciones y urgencias 24/7.",
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

  // Descomentar y completar cuando tengas Search Console verificado:
  // verification: {
  //   google: "TU_CODIGO_DE_VERIFICACION_GOOGLE",
  //   yandex: "TU_CODIGO_YANDEX",
  // },
};

// Schema ElectricalContractor — aparece en resultados ricos de Google
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  "@id": `${BASE_URL}/#organization`,
  name: "Voltis",
  legalName: "Voltis Instalaciones Eléctricas",
  description:
    "Electricistas matriculados en Carlos Paz y Punilla, Córdoba. Instalaciones domiciliarias, mantenimiento y reparaciones eléctricas con garantía. Urgencias 24/7.",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo-voltis.png`,
    width: 1080,
    height: 1080,
  },
  image: `${BASE_URL}/logo-voltis.png`,
  telephone: "+5493513873029",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Villa Carlos Paz",
    addressRegion: "Córdoba",
    postalCode: "5152",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -31.4237,
    longitude: -64.4977,
  },
  hasMap: "https://maps.google.com/maps?q=Villa+Carlos+Paz,+Córdoba,+Argentina",
  areaServed: [
    { "@type": "City", name: "Villa Carlos Paz" },
    { "@type": "City", name: "Valle Hermoso" },
    { "@type": "City", name: "Cosquín" },
    { "@type": "City", name: "La Falda" },
    { "@type": "City", name: "La Cumbre" },
    { "@type": "AdministrativeArea", name: "Punilla" },
    { "@type": "State", name: "Córdoba" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "ARS",
  paymentAccepted: "Efectivo, transferencia bancaria, Mercado Pago",
  // sameAs: [
  //   "https://www.facebook.com/voltis.electricidad",
  //   "https://www.instagram.com/voltis.electricidad",
  // ],
};

// Schema WebSite — habilita el cuadro de búsqueda en Google (Sitelinks Search Box)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Voltis",
  url: BASE_URL,
  description: "Electricistas matriculados en Carlos Paz y Punilla, Córdoba.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "es-AR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full ${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        {/* Geo tags — SEO local */}
        <meta name="geo.region" content="AR-X" />
        <meta name="geo.placename" content="Villa Carlos Paz, Córdoba, Argentina" />
        <meta name="geo.position" content="-31.4237;-64.4977" />
        <meta name="ICBM" content="-31.4237, -64.4977" />

        {/* Theme color (barra del navegador en mobile) */}
        <meta name="theme-color" content="#f59e0b" />

        {/* JSON-LD estructurado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
