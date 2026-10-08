import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Instalaciones domiciliarias en Carlos Paz y Punilla",
  description:
    "Instalaciones eléctricas domiciliarias en Carlos Paz y Punilla, Córdoba. Tendido de cables, bocas de luz, tomas, interruptores y más. Electricistas matriculados con garantía.",
  alternates: { canonical: "/servicios/instalaciones-domiciliarias" },
};

const benefits = [
  "Instalación eléctrica completa para obra nueva y remodelaciones",
  "Tendido de cables, cañerías y bandejas eléctricas",
  "Bocas de luz, tomas corrientes y llaves de paso",
  "Puesta a tierra y conexiones a tablero",
  "Instalación de artefactos y lámparas",
  "Certificaciones técnicas para gestión de habilitaciones",
];

const faq = [
  {
    q: "¿Puedo hacer la instalación eléctrica yo mismo?",
    a: "No. La normativa eléctrica argentina (AEA 90364 y Resolución SE 1/2020) establece que las instalaciones y reparaciones eléctricas deben ser realizadas únicamente por electricistas matriculados. Más allá de la ley, intentarlo sin conocimiento puede causar incendios, descargas eléctricas o daños graves en tu vivienda. Siempre llamá a un experto.",
  },
  {
    q: "¿Cuánto tiempo tarda una instalación eléctrica domiciliaria completa?",
    a: "Depende del tamaño del hogar. Una vivienda de 2-3 ambientes puede completarse en 2-3 días de trabajo. Una casa más grande puede requerir entre 5 y 7 días. Antes de comenzar, te entregamos un cronograma detallado y un presupuesto sin compromiso.",
  },
  {
    q: "¿Qué es la puesta a tierra y por qué es obligatoria?",
    a: "La puesta a tierra es un sistema de seguridad que conduce las corrientes de falla directamente al suelo, protegiendo a las personas de descargas eléctricas. Es obligatoria por normativa eléctrica argentina desde hace décadas. Sin puesta a tierra, el disyuntor diferencial no puede funcionar correctamente.",
  },
  {
    q: "¿Necesito certificado para tramitar la habilitación municipal en Carlos Paz?",
    a: "Sí. Para habilitar un comercio, tramitar la habilitación de una obra o conectar el servicio ante EPEC en Carlos Paz necesitás un certificado de instalación eléctrica firmado y sellado por un electricista matriculado. Voltis emite este certificado al finalizar cada trabajo.",
  },
  {
    q: "¿Ofrecen garantía sobre los trabajos eléctricos?",
    a: "Sí. Todos nuestros trabajos de instalación eléctrica tienen garantía. Si después de la instalación aparece algún problema vinculado a nuestro trabajo, volvemos sin costo adicional para solucionarlo.",
  },
  {
    q: "¿Atienden en toda la región de Punilla?",
    a: "Sí. Realizamos instalaciones domiciliarias en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y todas las localidades del Valle de Punilla, Córdoba.",
  },
];

export default function InstalacionesDomiciliariasPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> / <span className="text-amber-400">Instalaciones domiciliarias</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Instalaciones domiciliarias
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Instalaciones eléctricas domiciliarias en Carlos Paz
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Realizamos instalaciones eléctricas domiciliarias completas en Carlos Paz, Punilla y
              toda la región de Córdoba. Trabajamos en obra nueva, ampliaciones y remodelaciones con
              electricistas matriculados y materiales de primera calidad.
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

      {/* Por qué llamar a un experto */}
      <section className="py-10 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-5xl shrink-0">⚡</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Los trabajos eléctricos deben hacerlos electricistas matriculados
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Las instalaciones eléctricas mal realizadas son una de las principales causas de
                incendios en hogares argentinos. No arriesgues tu familia ni tu propiedad:
                <strong> siempre llamá a un profesional habilitado</strong>. En Voltis
                somos electricistas matriculados con más de 10 años de experiencia en Carlos Paz y
                Punilla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              ¿Qué incluyen nuestras instalaciones domiciliarias?
            </h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="text-amber-500 font-bold text-lg mt-0.5">✓</span>
                  <span className="text-slate-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">¿Por qué elegirnos?</h3>
            <div className="space-y-4 text-slate-700">
              <p>
                Somos electricistas matriculados con más de 10 años de experiencia en instalaciones
                domiciliarias en Carlos Paz y la región de Punilla. Conocemos las normativas
                eléctricas vigentes en Córdoba y trabajamos con materiales certificados.
              </p>
              <p>
                Nuestro equipo va a tu domicilio, evalúa el trabajo y te presenta un presupuesto
                detallado antes de comenzar. Sin sorpresas ni costos ocultos.
              </p>
              <p>
                Todos nuestros trabajos de instalación eléctrica domiciliaria incluyen
                <strong> garantía</strong> y entrega de <strong>certificado técnico</strong> para
                habilitaciones.
              </p>
            </div>
            <div className="mt-6 p-4 bg-amber-100 rounded-xl border border-amber-200">
              <p className="text-amber-900 font-semibold text-sm">
                ☎ ¿Urgencia eléctrica? Llamanos al{" "}
                <a href="tel:+5493513873029" className="underline">(351) 387-3029</a>
                {" "}— atendemos las 24 horas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ejemplos de problemas que resolvemos */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
            Problemas que resolvemos en instalaciones domiciliarias
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Si reconocés alguna de estas situaciones en tu hogar de Carlos Paz o Punilla, es hora
            de llamar a un electricista matriculado.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔌",
                problema: "Tomacorrientes sin tensión",
                resolucion:
                  "Diagnosticamos la falla en el circuito, reparamos o reemplazamos el tomacorriente y verificamos el ramal completo para asegurarnos de que no haya otros puntos dañados.",
              },
              {
                icon: "💡",
                problema: "Bocas de luz que no funcionan",
                resolucion:
                  "Revisamos el circuito de iluminación, el portabulazo y el estado del cableado. Reemplazamos lo necesario y verificamos que toda la zona quede operativa.",
              },
              {
                icon: "🔧",
                problema: "Instalación eléctrica antigua (más de 20 años)",
                resolucion:
                  "Realizamos una inspección integral, identificamos los puntos de mayor riesgo y proponemos un plan de modernización por etapas adaptado a tu presupuesto.",
              },
              {
                icon: "🏗️",
                problema: "Obra nueva sin instalación eléctrica",
                resolucion:
                  "Diseñamos el proyecto eléctrico, instalamos cañerías y cajas en obra gruesa, tendemos cables y montamos el tablero completo con todas las protecciones.",
              },
              {
                icon: "🌡️",
                problema: "Cables o enchufes calientes",
                resolucion:
                  "El calor en cables y enchufes es señal de sobrecarga o mal contacto. Diagnosticamos el origen, reemplazamos los componentes dañados y rediseñamos el circuito si es necesario.",
              },
              {
                icon: "🏠",
                problema: "Refacción o ampliación de vivienda",
                resolucion:
                  "Extendemos la instalación existente para los nuevos ambientes, agregamos circuitos al tablero y certificamos la ampliación para habilitaciones municipales.",
              },
            ].map((item) => (
              <div
                key={item.problema}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:border-amber-400 transition-colors"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1 text-base">{item.problema}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.resolucion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Instalaciones domiciliarias en Carlos Paz y Punilla
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              Si estás construyendo o renovando tu vivienda en Carlos Paz, Villa Carlos Paz, Cosquín,
              La Falda, Valle Hermoso o cualquier localidad de Punilla, nuestro equipo de
              electricistas matriculados está listo para ejecutar la instalación eléctrica completa.
            </p>
            <p>
              Las instalaciones eléctricas domiciliarias deben cumplir con la normativa eléctrica
              argentina (IRAM y AEA 90364). Trabajamos siguiendo todas las normas de seguridad
              eléctrica para garantizar instalaciones seguras y duraderas. Emitimos certificado
              técnico al finalizar cada trabajo.
            </p>
            <p>
              Recuerda que cualquier trabajo eléctrico —por más pequeño que parezca— debe ser
              realizado por un electricista habilitado. No pongas en riesgo tu hogar ni a tu familia.
              <strong> Llamanos al (351) 387-3029</strong> y coordinamos una visita sin cargo.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Instalaciones domiciliarias
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
