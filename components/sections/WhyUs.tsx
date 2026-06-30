const reasons = [
  {
    icon: "🎓",
    title: "Electricistas matriculados",
    description:
      "Todo nuestro equipo cuenta con matrícula habilitante. Trabajamos de forma legal y segura en Carlos Paz y Punilla.",
  },
  {
    icon: "⏱",
    title: "Respuesta rápida",
    description:
      "Atendemos urgencias eléctricas en Carlos Paz con respuesta rápida. Llegamos a tu domicilio cuando más lo necesitás.",
  },
  {
    icon: "✅",
    title: "Trabajo con garantía",
    description:
      "Todos nuestros trabajos eléctricos incluyen garantía. Tu seguridad y satisfacción son nuestra prioridad.",
  },
  {
    icon: "💰",
    title: "Precios claros y justos",
    description:
      "Precios transparentes sin sorpresas ni costos ocultos. Sabés cuánto vas a pagar antes de que empecemos a trabajar.",
  },
  {
    icon: "🛡",
    title: "Seguridad eléctrica",
    description:
      "Trabajamos respetando las normas de seguridad eléctrica vigentes en Argentina. Instalaciones que protegen tu familia.",
  },
  {
    icon: "📍",
    title: "Cobertura local",
    description:
      "Atendemos Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y toda la región de Punilla, Córdoba.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
            Por qué elegirnos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Electricistas de confianza en Carlos Paz
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Más de 10 años brindando servicios eléctricos de calidad en Carlos Paz y la región de
            Punilla. Conocemos la zona, conocemos a nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-3xl flex-shrink-0">{reason.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{reason.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
