import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Testimonials from "@/components/sections/Testimonials";
import CoverageArea from "@/components/sections/CoverageArea";
import BlogPreview from "@/components/sections/BlogPreview";
import SeoText from "@/components/sections/SeoText";
import CTAPresupuesto from "@/components/sections/CTAPresupuesto";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = metaPagina({
  titulo: "Electricista en Carlos Paz para casas y comercios",
  descripcion:
    "Electricista en Carlos Paz para casas y comercios: arreglos, tomacorrientes, bocas de luz, ventiladores de techo, tableros e instalaciones. Respondo en el día.",
  ruta: "/",
  tituloAbsoluto: true,
});

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — CTA principal + beneficios */}
      <Hero />

      {/* 2. Servicios — Los 5 principales */}
      <ServicesGrid />

      {/* 3. Proyectos destacados con imágenes */}
      <FeaturedProjects />

      {/* 4. Testimonios de clientes */}
      <Testimonials />

      {/* 5. Zona de cobertura + mapa */}
      <CoverageArea />

      {/* 6. Blog — últimos artículos */}
      <BlogPreview />

      {/* 7. Texto SEO rico */}
      <SeoText />

      {/* 8. Banner presupuesto */}
      <CTAPresupuesto />

      {/* 9. CTA contacto */}
      <ContactBanner />
    </>
  );
}
