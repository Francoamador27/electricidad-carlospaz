const steps = [
  {
    number: "01",
    icon: "📞",
    title: "Contactanos",
    description:
      "Llamanos, escribinos por WhatsApp o completá el formulario. Te respondemos a la brevedad para entender qué necesitás y coordinar una visita sin cargo.",
  },
  {
    number: "02",
    icon: "🔍",
    title: "Visita y diagnóstico",
    description:
      "Un electricista matriculado va a tu domicilio o empresa en Carlos Paz y Punilla, evalúa el trabajo y te entrega un presupuesto detallado antes de comenzar.",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Ejecutamos el trabajo",
    description:
      "Realizamos la instalación, reparación o mantenimiento con materiales de primera calidad. Al terminar, entregamos garantía y certificado técnico si corresponde.",
  },
];

export default function Process() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
            Cómo trabajamos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Simple, rápido y seguro
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            En Voltis el proceso es claro: sin sorpresas, sin costos ocultos y con un electricista
            matriculado en cada paso.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-amber-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-amber-400 font-black text-xs w-7 h-7 rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="tel:+5493513873029"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors text-base shadow-md"
          >
            ☎ Empezar — Llamar al (351) 387-3029
          </a>
        </div>
      </div>
    </section>
  );
}
