import Link from "next/link";

const services = [
  {
    icon: "🏠",
    title: "Instalaciones domiciliarias",
    description:
      "Instalaciones eléctricas completas para viviendas en Carlos Paz y Punilla. Tendido de cables, tomas, interruptores y más.",
    href: "/servicios/instalaciones-domiciliarias",
  },
  {
    icon: "🏢",
    title: "Instalaciones para empresas",
    description:
      "Instalaciones eléctricas para comercios, oficinas y plantas industriales en Carlos Paz. Eficiencia y seguridad garantizadas.",
    href: "/servicios/instalaciones-empresariales",
  },
  {
    icon: "🔧",
    title: "Mantenimiento eléctrico",
    description:
      "Revisiones preventivas y diagnóstico de instalaciones eléctricas en Carlos Paz. Evitá fallas antes de que ocurran.",
    href: "/servicios/mantenimiento-electricidad",
  },
  {
    icon: "⚡",
    title: "Reparaciones eléctricas",
    description:
      "Reparación de cortocircuitos, enchufes, interruptores y fallas eléctricas en Carlos Paz. Servicio rápido y seguro.",
    href: "/servicios/reparaciones-electricas",
  },
  {
    icon: "🔌",
    title: "Tableros eléctricos",
    description:
      "Instalación, actualización y mantenimiento de tableros eléctricos modernos en Carlos Paz. Protección para tu hogar o empresa.",
    href: "/servicios/tableros-electricos",
  },
  {
    icon: "💡",
    title: "Iluminación y automatización",
    description:
      "Diseño e instalación de sistemas de iluminación LED y automatización eléctrica en Carlos Paz y Punilla.",
    href: "/servicios",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
            Servicios eléctricos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Todo lo que necesitás en electricidad
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Brindamos servicios eléctricos profesionales en Carlos Paz, Punilla y la región de
            Córdoba. Instalaciones domiciliarias, comerciales e industriales con garantía.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.href + service.title}
              href={service.href}
              className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-amber-400 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-amber-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
              <div className="mt-4 text-amber-500 text-sm font-semibold">
                Ver más →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
