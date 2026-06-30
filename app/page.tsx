import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import Process from "@/components/sections/Process";
import WhyUs from "@/components/sections/WhyUs";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Testimonials from "@/components/sections/Testimonials";
import CoverageArea from "@/components/sections/CoverageArea";
import BlogPreview from "@/components/sections/BlogPreview";
import SeoText from "@/components/sections/SeoText";
import EmergencyCTA from "@/components/sections/EmergencyCTA";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = {
  title: "Electricista en Carlos Paz y Punilla | Voltis",
  description:
    "Electricistas matriculados en Carlos Paz y Punilla, Córdoba. Instalaciones domiciliarias, mantenimiento eléctrico, reparaciones y tableros. Urgencias 24/7. Presupuesto sin cargo.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — CTA principal + stats */}
      <Hero />

      {/* 2. Servicios — Los 6 servicios con links */}
      <ServicesGrid />

      {/* 3. Cómo trabajamos — 3 pasos */}
      <Process />

      {/* 4. Por qué elegirnos */}
      <WhyUs />

      {/* 5. Proyectos destacados con imágenes */}
      <FeaturedProjects />

      {/* 6. Testimonios de clientes */}
      <Testimonials />

      {/* 7. Zona de cobertura + mapa */}
      <CoverageArea />

      {/* 8. Blog — últimos artículos */}
      <BlogPreview />

      {/* 9. Texto SEO rico */}
      <SeoText />

      {/* 10. Banner emergencias */}
      <EmergencyCTA />

      {/* 11. CTA contacto */}
      <ContactBanner />
    </>
  );
}
