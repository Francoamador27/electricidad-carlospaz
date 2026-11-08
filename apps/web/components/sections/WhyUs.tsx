import AnimateIn from "@/components/ui/AnimateIn";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";

const reasons = [
  {
    title: "Te atiendo yo",
    description: "Hablás directamente con quien hace el trabajo, sin intermediarios.",
  },
  {
    title: "Respuesta rápida",
    description:
      "Te respondo en el día por WhatsApp y coordinamos en Carlos Paz y todo Punilla.",
  },
  {
    title: "Trabajo con garantía",
    description:
      "Cada trabajo tiene garantía por escrito.",
  },
  {
    title: "Precios claros",
    description:
      "Presupuesto sin cargo por WhatsApp. Sabés cuánto vas a pagar antes de que empiece.",
  },
  {
    title: "Trabajo prolijo",
    description:
      "Dejo todo ordenado y funcionando, y te explico qué hice.",
  },
  {
    title: "Cobertura local",
    description:
      "Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y toda la región de Punilla, Córdoba.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimateIn className="mb-12">
          <span className="font-display text-copper-dark text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
            Por qué conmigo
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Un electricista cerca,<br className="hidden sm:block" />en Carlos Paz.
          </h2>
        </AnimateIn>

        {/* Technical grid — gap-px on colored bg creates hairline dividers */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-warm-border">
          {reasons.map((reason) => (
            <StaggerItem key={reason.title} className="bg-white">
              <div className="group p-8 h-full hover:bg-[#FAFAF8] transition-colors duration-200">
                <div className="w-8 h-[2px] bg-copper mb-5 transition-all duration-300 group-hover:w-14" />
                <h3 className="font-display font-semibold text-ink text-base mb-2">{reason.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{reason.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
