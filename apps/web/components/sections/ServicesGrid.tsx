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
    Icon: BoltIcon,
    title: "Arreglos y fallas eléctricas",
    description: "Saltan las térmicas, enchufes que no andan, cortes en una parte de la casa o del local.",
    href: "/servicios/reparaciones-electricas",
  },
  {
    Icon: BulbIcon,
    title: "Tomacorrientes, bocas de luz y ventiladores",
    description: "Agrego lo que te falta sobre la instalación que ya tenés, incluidos ventiladores de techo.",
    href: "/servicios/agregados-electricos",
  },
  {
    Icon: PanelIcon,
    title: "Tableros eléctricos",
    description: "Actualización del tablero, disyuntor diferencial y térmicas.",
    href: "/servicios/tableros-electricos",
  },
  {
    Icon: BuildingIcon,
    title: "Locales comerciales",
    description: "Adecuación eléctrica, iluminación, tablero y certificado para la habilitación municipal.",
    href: "/servicios/locales-comerciales",
  },
  {
    Icon: HomeIcon,
    title: "Instalación completa",
    description: "Toda la instalación para obra nueva o reforma, de las cañerías al tablero.",
    href: "/servicios/instalaciones-domiciliarias",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-20 md:py-28 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimateIn className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-display text-copper-dark text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
              Servicios
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
              Qué puedo hacer<br className="hidden sm:block" />por vos.
            </h2>
          </div>
          <p className="text-warm-gray text-sm leading-relaxed md:max-w-xs">
            Para casas y locales comerciales, con garantía escrita, en Carlos Paz y todo Punilla.
          </p>
        </AnimateIn>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <StaggerItem key={service.href + service.title} className="flex flex-col">
              <Link
                href={service.href}
                className="group flex flex-col flex-1 bg-white border border-warm-border rounded p-6 transition-all duration-300 hover:border-copper hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(196,118,42,0.1)]"
              >
                <div className="text-copper-dark mb-4 transition-transform duration-300 group-hover:scale-110 origin-left">
                  <service.Icon />
                </div>
                <h3 className="font-display font-semibold text-ink text-base mb-2 transition-colors group-hover:text-copper">
                  {service.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed flex-1">{service.description}</p>
                <div className="mt-4 text-copper-dark text-xs font-semibold tracking-wide uppercase flex items-center gap-1 transition-gap">
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
