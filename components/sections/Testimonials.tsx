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
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
            Lo que dicen nuestros clientes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Más de 500 clientes satisfechos en Punilla
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            La confianza de nuestros clientes en Carlos Paz y toda la región de Punilla es el
            resultado de 10 años de trabajo honesto, seguro y con garantía.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed flex-1 italic">
                "{t.text}"
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.location}</p>
                <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            ¿Trabajaste con nosotros?{" "}
            <a
              href="https://wa.me/5493513873029?text=Hola%2C+quiero+dejar+mi+opini%C3%B3n+sobre+el+servicio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 font-semibold hover:underline"
            >
              Dejanos tu reseña por WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
