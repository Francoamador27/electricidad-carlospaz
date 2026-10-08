import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Instalaciones eléctricas para empresas en Carlos Paz",
  description:
    "Instalaciones eléctricas comerciales e industriales en Carlos Paz y Punilla. Electricistas matriculados para locales, oficinas, hoteles y empresas. Con garantía y certificaciones.",
  alternates: { canonical: "/servicios/instalaciones-empresariales" },
};

const services = [
  {
    icon: "🏪",
    title: "Locales comerciales",
    desc: "Instalaciones eléctricas para comercios, tiendas y restaurantes en Carlos Paz. Diseñamos circuitos para iluminación comercial, cajas, cocinas industriales y equipos de refrigeración.",
  },
  {
    icon: "🏬",
    title: "Oficinas y administración",
    desc: "Sistemas eléctricos para oficinas con tomas especializadas, circuitos para equipos de cómputo, iluminación eficiente y redes de datos integradas.",
  },
  {
    icon: "🏭",
    title: "Plantas industriales",
    desc: "Instalaciones eléctricas industriales trifásicas, sistemas de alta potencia, tableros de mando y protecciones para maquinaria en Punilla y Córdoba.",
  },
  {
    icon: "🏨",
    title: "Hoteles y hospedajes",
    desc: "Instalaciones eléctricas para la industria hotelera en Carlos Paz y Punilla. Circuitos dedicados por habitación, iluminación de pasillos y áreas comunes, sistemas de emergencia.",
  },
];

const faq = [
  {
    q: "¿Qué certificaciones necesito para habilitar mi local en Carlos Paz?",
    a: "Para habilitar un comercio en Carlos Paz necesitás un certificado de instalación eléctrica emitido por un electricista matriculado. Voltis realiza la instalación y emite el certificado técnico necesario para el trámite ante el municipio de Carlos Paz.",
  },
  {
    q: "¿Cuánto tiempo tarda la instalación eléctrica de un local comercial?",
    a: "Depende del tamaño y tipo de local. Un local comercial pequeño puede estar listo en 2-3 días. Locales más grandes o con requisitos especiales (cocinas industriales, sistemas trifásicos) pueden requerir más tiempo. Antes de comenzar, presentamos un cronograma detallado.",
  },
  {
    q: "¿Cuál es la diferencia entre instalación monofásica y trifásica?",
    a: "La instalación monofásica (220V) es la estándar para la mayoría de comercios y oficinas. La trifásica (380V) es necesaria para equipos industriales de alta potencia: maquinaria, compresores, hornos industriales. Evaluamos la demanda de tu empresa y recomendamos la solución correcta.",
  },
  {
    q: "¿Pueden realizar el mantenimiento eléctrico periódico de mi empresa?",
    a: "Sí. Ofrecemos planes de mantenimiento eléctrico preventivo para empresas en Carlos Paz y Punilla. Una instalación bien mantenida evita cortes imprevistos que afectan la operación y reduce el riesgo de accidentes y multas por habilitación.",
  },
  {
    q: "¿Trabajan fuera del horario comercial para no interrumpir mi negocio?",
    a: "Sí. Podemos coordinar trabajos de mantenimiento o reparación fuera de tu horario comercial (noche, fines de semana) para minimizar el impacto en tu operación. Consultanos y lo coordinamos.",
  },
  {
    q: "¿Un local sin instalación eléctrica certificada puede ser inhabilitado?",
    a: "Sí. Los inspectores municipales pueden inhabilitar un local que no cuente con certificado de instalación eléctrica vigente. Esto también genera responsabilidades civiles ante cualquier accidente eléctrico que ocurra en el establecimiento.",
  },
];

export default function InstalacionesEmpresarialesPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> /{" "}
            <span className="text-amber-400">Instalaciones para empresas</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Instalaciones comerciales e industriales
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Instalaciones eléctricas para empresas en Carlos Paz
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Soluciones eléctricas integrales para comercios, oficinas y empresas en Carlos Paz y
              Punilla. Diseñamos y ejecutamos instalaciones eléctricas comerciales e industriales
              con garantía, certificación y cumplimiento normativo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/presupuesto" variant="primary" className="text-base px-6 py-3">
                Solicitar presupuesto
              </Button>
              <a
                href="tel:+5493513873029"
                className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                ☎ Llamar ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Aviso experto */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 items-center">
          <span className="text-4xl shrink-0">📋</span>
          <div>
            <p className="font-bold text-slate-900">
              Las instalaciones eléctricas comerciales requieren certificación obligatoria.
            </p>
            <p className="text-slate-700 text-sm mt-1">
              Sin un certificado eléctrico emitido por un electricista matriculado, tu local puede
              ser inhabilitado y quedás sin cobertura ante un accidente. Voltis realiza
              el trabajo y emite la documentación necesaria para tus habilitaciones municipales en
              Carlos Paz.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Instalaciones eléctricas para todo tipo de empresas en Carlos Paz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex gap-4 p-6 border border-slate-200 rounded-xl hover:border-amber-400 transition-colors"
              >
                <div className="text-4xl shrink-0">{s.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            ¿Por qué las empresas de Carlos Paz nos eligen?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "Certificados para habilitaciones",
                desc: "Emitimos el certificado técnico de instalación eléctrica necesario para tramitar y renovar habilitaciones municipales en Carlos Paz.",
              },
              {
                icon: "⚡",
                title: "Respuesta rápida ante fallas",
                desc: "Un corte eléctrico en tu negocio es dinero que perdés. Atendemos urgencias comerciales con prioridad y rapidez en toda la región de Punilla.",
              },
              {
                icon: "🔒",
                title: "Cumplimiento normativo total",
                desc: "Trabajamos siguiendo las normas AEA 90364 y IRAM. Tu instalación estará en regla ante cualquier inspección o auditoría.",
              },
              {
                icon: "💡",
                title: "Eficiencia energética",
                desc: "Optimizamos tu instalación para reducir el consumo. LED comercial, circuitos dimensionados correctamente y automatización básica disponibles.",
              },
              {
                icon: "🛡",
                title: "Garantía en todos los trabajos",
                desc: "Todos nuestros trabajos incluyen garantía. Si algo falla vinculado a nuestra instalación, volvemos sin costo.",
              },
              {
                icon: "📞",
                title: "Mantenimiento preventivo programado",
                desc: "Ofrecemos contratos de mantenimiento eléctrico preventivo para empresas que necesitan una instalación siempre revisada y certificada.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-slate-200 p-5 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Electricistas para empresas en Carlos Paz y Punilla
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              En Voltis ofrecemos instalaciones eléctricas para empresas en Carlos Paz y
              toda la región de Punilla. Trabajamos con electricistas matriculados y brindamos
              certificaciones técnicas para la habilitación de comercios e industrias en Córdoba.
            </p>
            <p>
              Las instalaciones eléctricas comerciales e industriales en Argentina deben cumplir
              con normas específicas (AEA 90364, reglamentaciones municipales de Carlos Paz) que
              garantizan la seguridad de los trabajadores y clientes. Una instalación no certificada
              deja al empleador sin cobertura ante un accidente laboral eléctrico.
            </p>
            <p>
              Atendemos empresas en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y todo
              el Valle de Punilla. Para presupuesto de instalación eléctrica comercial, llamanos al{" "}
              <a href="tel:+5493513873029" className="text-amber-600 font-semibold hover:underline">
                (351) 387-3029
              </a>{" "}
              o solicitalo online de forma gratuita.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Instalaciones para empresas
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="bg-white border border-slate-200 rounded-xl p-5 group open:border-amber-400 transition-colors"
              >
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center gap-4">
                  {item.q}
                  <span className="text-amber-500 shrink-0 text-xl font-bold group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <EmergencyCTA />
      <ContactBanner />
    </>
  );
}
