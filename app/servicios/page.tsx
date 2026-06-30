import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = {
  title: "Servicios eléctricos en Carlos Paz y Punilla",
  description:
    "Servicios eléctricos profesionales en Carlos Paz y Punilla, Córdoba: instalaciones domiciliarias, comerciales, mantenimiento, reparaciones y tableros eléctricos.",
  alternates: { canonical: "/servicios" },
};

const services = [
  {
    icon: "🏠",
    title: "Instalaciones domiciliarias",
    description:
      "Instalaciones eléctricas completas para viviendas en Carlos Paz y Punilla. Tendido de cables, bocas de luz, tomas corrientes, llaves de paso e interruptores. Trabajamos en obra nueva y remodelaciones.",
    href: "/servicios/instalaciones-domiciliarias",
    keywords: ["instalaciones domiciliarias Carlos Paz", "electricidad domiciliaria Punilla"],
  },
  {
    icon: "🏢",
    title: "Instalaciones para empresas",
    description:
      "Instalaciones eléctricas para comercios, oficinas, locales y plantas industriales en Carlos Paz. Diseño, ejecución y certificación de instalaciones eléctricas comerciales e industriales.",
    href: "/servicios/instalaciones-empresariales",
    keywords: ["instalaciones eléctricas empresas Carlos Paz", "electricidad industrial Punilla"],
  },
  {
    icon: "🔧",
    title: "Mantenimiento eléctrico",
    description:
      "Revisiones preventivas y diagnóstico de instalaciones eléctricas en Carlos Paz. Detectamos fallas antes de que ocurran y mantenemos tu instalación en óptimas condiciones.",
    href: "/servicios/mantenimiento-electricidad",
    keywords: ["mantenimiento eléctrico Carlos Paz", "revisión eléctrica Punilla"],
  },
  {
    icon: "⚡",
    title: "Reparaciones eléctricas",
    description:
      "Reparación urgente de cortocircuitos, enchufes quemados, interruptores defectuosos y fallas eléctricas en Carlos Paz. Atención rápida para emergencias eléctricas.",
    href: "/servicios/reparaciones-electricas",
    keywords: ["reparaciones eléctricas Carlos Paz", "urgencia eléctrica Punilla"],
  },
  {
    icon: "🔌",
    title: "Tableros eléctricos",
    description:
      "Instalación, actualización y mantenimiento de tableros eléctricos en Carlos Paz. Modernizamos tableros obsoletos e instalamos protecciones adecuadas para tu instalación.",
    href: "/servicios/tableros-electricos",
    keywords: ["tableros eléctricos Carlos Paz", "instalación tablero Punilla"],
  },
  {
    icon: "💡",
    title: "Iluminación y automatización",
    description:
      "Diseño e instalación de sistemas de iluminación LED eficiente y automatización eléctrica en Carlos Paz. Ahorrá energía y modernizá tu hogar o empresa.",
    href: "/servicios",
    keywords: ["iluminación LED Carlos Paz", "automatización eléctrica Punilla"],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Servicios eléctricos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Servicios eléctricos en Carlos Paz y Punilla
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Electricistas matriculados que ofrecemos soluciones eléctricas integrales en Carlos Paz,
            Punilla y toda la región de Córdoba. Desde instalaciones domiciliarias hasta proyectos
            industriales.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.href + service.title}
                className="border border-slate-200 rounded-xl p-8 hover:border-amber-400 hover:shadow-md transition-all"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.keywords.map((kw) => (
                    <span key={kw} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
                <Button href={service.href} variant="outline">
                  Ver servicio →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
