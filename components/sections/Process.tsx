import AnimateIn from "@/components/ui/AnimateIn";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";

const steps = [
  {
    number: "01",
    title: "Contactanos",
    description:
      "Llamanos, escribinos por WhatsApp o completá el formulario. Te respondemos a la brevedad para entender qué necesitás y coordinar una visita sin cargo.",
  },
  {
    number: "02",
    title: "Visita y diagnóstico",
    description:
      "Un electricista matriculado va a tu domicilio o empresa en Carlos Paz y Punilla, evalúa el trabajo y te entrega un presupuesto detallado antes de comenzar.",
  },
  {
    number: "03",
    title: "Ejecutamos el trabajo",
    description:
      "Realizamos la instalación, reparación o mantenimiento con materiales de primera calidad. Al terminar, entregamos garantía y certificado técnico si corresponde.",
  },
];

export default function Process() {
  return (
    <section className="py-20 md:py-28 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimateIn className="mb-14">
          <span className="font-display text-copper text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
            Cómo trabajamos
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Simple, rápido y seguro.
          </h2>
        </AnimateIn>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="relative group">
                {/* Large background number */}
                <div
                  className="font-display text-[120px] font-bold text-ink opacity-[0.04] leading-none select-none absolute -top-6 -left-3 pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.07]"
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <div className="relative">
                  <div className="font-display text-copper font-bold text-sm tracking-[0.15em] uppercase mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-ink text-xl mb-3">{step.title}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <AnimateIn delay={0.2} className="mt-12 pt-8 border-t border-warm-border">
          <a
            href="tel:+5493513873029"
            className="font-display inline-flex items-center gap-2 bg-copper text-white font-semibold px-7 py-3.5 rounded-sm text-sm tracking-wide hover:bg-copper-light transition-all duration-200 hover:shadow-[0_4px_16px_rgba(196,118,42,0.3)] active:scale-[0.97]"
          >
            Empezar — (351) 387-3029
          </a>
        </AnimateIn>
      </div>
    </section>
  );
}
