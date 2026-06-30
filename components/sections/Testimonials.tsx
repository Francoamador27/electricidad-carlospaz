import AnimateIn from "@/components/ui/AnimateIn";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";

const testimonials = [
  {
    name: "Marcela R.",
    location: "Villa Carlos Paz",
    stars: 5,
    text: "Excelente servicio. Llamé a Voltis por una urgencia eléctrica un domingo a la noche y llegaron en menos de una hora. Resolvieron el problema rápido y el precio fue muy razonable. Los recomiendo sin dudarlo.",
    service: "Reparación eléctrica urgente",
  },
  {
    name: "Diego F.",
    location: "Valle Hermoso",
    stars: 5,
    text: "Hicimos la instalación eléctrica completa de nuestra casa nueva con ellos. Muy prolijos, puntuales y el precio cerrado que dieron al principio fue exactamente lo que cobraron. Entregaron el certificado para la habilitación sin problemas.",
    service: "Instalación eléctrica domiciliaria",
  },
  {
    name: "Laura M.",
    location: "Cosquín",
    stars: 5,
    text: "Actualizaron el tablero de mi local gastronómico. Trabajaron un fin de semana para no interrumpir el negocio. Muy profesionales y el tablero quedó impecable con todas las protecciones en regla.",
    service: "Actualización de tablero eléctrico",
  },
  {
    name: "Roberto G.",
    location: "La Falda",
    stars: 5,
    text: "Solicité revisión preventiva de toda la instalación de mi casa de Punilla. Encontraron varios puntos de riesgo que yo no veía. Me dieron un informe detallado y resolvieron todo el mismo día. Muy recomendables.",
    service: "Mantenimiento eléctrico preventivo",
  },
  {
    name: "Sofía T.",
    location: "Carlos Paz",
    stars: 5,
    text: "Llamé porque se me quemaron tres enchufes en la misma semana. Diagnosticaron que el circuito estaba sobrecargado y le hicieron un circuito nuevo. Desde entonces sin problemas. Atención muy buena.",
    service: "Reparación de circuito",
  },
  {
    name: "Hernán B.",
    location: "La Cumbre",
    stars: 5,
    text: "Instalación completa de iluminación LED exterior en mi casa de campo. Quedó perfecta. Trabajo muy cuidado, respetaron los tiempos y el presupuesto. Son los electricistas de confianza de la zona.",
    service: "Iluminación LED exterior",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimateIn className="mb-12">
          <span className="font-display text-copper text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
            Clientes
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Más de 500 clientes satisfechos<br className="hidden sm:block" />en Punilla.
          </h2>
        </AnimateIn>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <StaggerItem key={t.name} className="flex flex-col">
              <div className="group flex flex-col flex-1 bg-white border border-warm-border rounded p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-copper text-base">★</span>
                  ))}
                </div>

                <p className="text-[#5A5450] text-sm leading-relaxed flex-1 italic">
                  "{t.text}"
                </p>

                <div className="mt-5 pt-4 border-t border-warm-border">
                  <p className="font-display font-semibold text-ink text-sm">{t.name}</p>
                  <p className="text-warm-gray text-xs mt-0.5">{t.location}</p>
                  <span className="inline-block mt-2 text-xs border border-warm-border text-warm-gray px-2 py-0.5 rounded-sm font-medium">
                    {t.service}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <AnimateIn delay={0.1} className="mt-10">
          <p className="text-warm-gray text-sm">
            ¿Trabajaste con nosotros?{" "}
            <a
              href="https://wa.me/5493513873029?text=Hola%2C+quiero+dejar+mi+opini%C3%B3n+sobre+el+servicio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-copper font-semibold hover:underline"
            >
              Dejanos tu reseña por WhatsApp →
            </a>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
