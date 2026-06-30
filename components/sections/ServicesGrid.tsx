import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 2L21 10.5V21H15V15H9V21H3V10.5Z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" />
    <path d="M8 3v18M16 3v18M3 8h5M16 8h5M3 13h5M16 13h5" />
  </svg>
);

const WrenchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);

const BoltIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const PanelIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="1" />
    <path d="M7 2v20M11 7h8M11 12h8M11 17h5M4 7h1M4 12h1M4 17h1" />
  </svg>
);

const BulbIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21h6M10.5 17.5C7.5 16.6 5 14.3 5 12a7 7 0 1114 0c0 2.3-2.5 4.6-5.5 5.5M10.5 17.5h3" />
    <path d="M10.5 17.5v-3a1.5 1.5 0 013 0v3" />
  </svg>
);

const services = [
  {
    Icon: HomeIcon,
    title: "Instalaciones domiciliarias",
    description:
      "Instalaciones eléctricas completas para viviendas en Carlos Paz y Punilla. Tendido de cables, tomas, interruptores y más.",
    href: "/servicios/instalaciones-domiciliarias",
  },
  {
    Icon: BuildingIcon,
    title: "Instalaciones para empresas",
    description:
      "Instalaciones eléctricas para comercios, oficinas y plantas industriales en Carlos Paz. Eficiencia y seguridad garantizadas.",
    href: "/servicios/instalaciones-empresariales",
  },
  {
    Icon: WrenchIcon,
    title: "Mantenimiento eléctrico",
    description:
      "Revisiones preventivas y diagnóstico de instalaciones eléctricas en Carlos Paz. Evitá fallas antes de que ocurran.",
    href: "/servicios/mantenimiento-electricidad",
  },
  {
    Icon: BoltIcon,
    title: "Reparaciones eléctricas",
    description:
      "Reparación de cortocircuitos, enchufes, interruptores y fallas eléctricas en Carlos Paz. Servicio rápido y seguro.",
    href: "/servicios/reparaciones-electricas",
  },
  {
    Icon: PanelIcon,
    title: "Tableros eléctricos",
    description:
      "Instalación, actualización y mantenimiento de tableros eléctricos modernos en Carlos Paz. Protección para tu hogar o empresa.",
    href: "/servicios/tableros-electricos",
  },
  {
    Icon: BulbIcon,
    title: "Iluminación y automatización",
    description:
      "Diseño e instalación de sistemas de iluminación LED y automatización eléctrica en Carlos Paz y Punilla.",
    href: "/servicios",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-20 md:py-28 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimateIn className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-display text-copper text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
              Servicios
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
              Todo lo que necesitás<br className="hidden sm:block" />en electricidad.
            </h2>
          </div>
          <p className="text-warm-gray text-sm leading-relaxed md:max-w-xs">
            Instalaciones domiciliarias, comerciales e industriales con garantía, en Carlos Paz y toda la región de Punilla.
          </p>
        </AnimateIn>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <StaggerItem key={service.href + service.title} className="flex flex-col">
              <Link
                href={service.href}
                className="group flex flex-col flex-1 bg-white border border-warm-border rounded p-6 transition-all duration-300 hover:border-copper hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(196,118,42,0.1)]"
              >
                <div className="text-copper mb-4 transition-transform duration-300 group-hover:scale-110 origin-left">
                  <service.Icon />
                </div>
                <h3 className="font-display font-semibold text-ink text-base mb-2 transition-colors group-hover:text-copper">
                  {service.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed flex-1">{service.description}</p>
                <div className="mt-4 text-copper text-xs font-semibold tracking-wide uppercase flex items-center gap-1 transition-gap">
                  <span>Ver más</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
