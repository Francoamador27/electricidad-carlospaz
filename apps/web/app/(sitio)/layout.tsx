import { GoogleTagManager } from "@next/third-parties/google";
import Gtag from "@/components/tracking/Gtag";
import { LOCALIDADES, NEGOCIO, SERVICIOS } from "@voltis/shared/negocio";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import TrackingListener from "@/components/tracking/TrackingListener";
import { JsonLd } from "@/components/seo/JsonLd";
import { GBP_URL, SITE_URL } from "@/lib/site";
import { getConfig } from "@/lib/contenido";

const BASE_URL = SITE_URL;

// Schema ElectricalContractor — aparece en resultados ricos de Google
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  "@id": `${BASE_URL}/#organization`,
  name: "Voltis",
  description:
    "Electricista en Carlos Paz y Punilla, Córdoba, para casas y comercios. Arreglos, agregados, tableros e instalaciones con garantía escrita.",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo-voltis.png`,
    width: 1080,
    height: 1080,
  },
  image: `${BASE_URL}/logo-voltis.png`,
  telephone: NEGOCIO.telefono,
  // Negocio con zona de servicio: sin dirección física ni coordenadas.
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
    "Puesta a tierra",
  ],
  ...(GBP_URL && { sameAs: [GBP_URL] }),
};

// Schema WebSite — habilita el cuadro de búsqueda en Google (Sitelinks Search Box)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Voltis",
  url: BASE_URL,
  description: "Electricista en Carlos Paz y Punilla, Córdoba, para casas y comercios.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "es-AR",
};

export default async function SitioLayout({ children }: { children: React.ReactNode }) {
  const { gtm_id, google_ads_id } = await getConfig();
  return (
    <>
      {gtm_id && <GoogleTagManager gtmId={gtm_id} />}
      <Gtag ids={[google_ads_id, process.env.NEXT_PUBLIC_GA4_ID].filter((id): id is string => !!id)} />

      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <TrackingListener />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Reserva el alto de la barra fija de mobile para que no tape el footer. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <WhatsAppButton />
    </>
  );
}
