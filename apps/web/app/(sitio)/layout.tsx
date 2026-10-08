import { GoogleTagManager } from "@next/third-parties/google";
import { LOCALIDADES, NEGOCIO, SERVICIOS } from "@voltis/shared";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import TrackingListener from "@/components/tracking/TrackingListener";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";
import { getConfig } from "@/lib/contenido";

const BASE_URL = SITE_URL;

// Schema ElectricalContractor — aparece en resultados ricos de Google
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  "@id": `${BASE_URL}/#organization`,
  name: "Voltis",
  legalName: "Voltis Instalaciones Eléctricas",
  description:
    "Electricistas en Carlos Paz y Punilla, Córdoba. Instalaciones domiciliarias, mantenimiento y reparaciones eléctricas con garantía.",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo-voltis.png`,
    width: 1080,
    height: 1080,
  },
  image: `${BASE_URL}/logo-voltis.png`,
  telephone: NEGOCIO.telefono,
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
    ...LOCALIDADES.map((l) => ({ "@type": "City", name: l.nombre })),
    { "@type": "AdministrativeArea", name: "Punilla" },
  ],
  openingHoursSpecification: NEGOCIO.horario.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.dias,
    opens: h.abre,
    closes: h.cierra,
  })),
  knowsAbout: [
    ...SERVICIOS.map((s) => s.nombre),
    "Certificado de Instalación Eléctrica Apta (Ley 10.281 de Córdoba)",
    "Puesta a tierra",
    "Domótica",
  ],
  priceRange: "$",
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
  description: "Electricistas en Carlos Paz y Punilla, Córdoba.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "es-AR",
};

export default async function SitioLayout({ children }: { children: React.ReactNode }) {
  const { gtm_id } = await getConfig();
  return (
    <>
      {gtm_id && <GoogleTagManager gtmId={gtm_id} />}
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <TrackingListener />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
