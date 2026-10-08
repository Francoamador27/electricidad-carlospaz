import type { Metadata } from "next";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Reparaciones eléctricas urgentes en Carlos Paz y Punilla",
  description:
    "Reparaciones eléctricas en Carlos Paz y Punilla, Córdoba. Cortocircuitos, enchufes quemados, interruptores defectuosos. Servicio rápido 24/7. Electricistas matriculados.",
  alternates: { canonical: "/servicios/reparaciones-electricas" },
};

const repairs = [
  {
    icon: "⚡",
    title: "Cortocircuitos",
    desc: "Diagnosticamos y reparamos cortocircuitos en Carlos Paz. Identificamos el origen de la falla con equipos de medición y la resolvemos de forma segura, sin improvisación.",
  },
  {
    icon: "🔌",
    title: "Enchufes y tomacorrientes quemados",
    desc: "Reemplazamos enchufes quemados y tomacorrientes sin tensión. Un enchufe que muestra signos de quemado es una situación de riesgo de incendio que requiere atención inmediata.",
  },
  {
    icon: "💡",
    title: "Llaves e interruptores defectuosos",
    desc: "Reparamos y reemplazamos llaves de paso, interruptores y placas eléctricas en Carlos Paz. Solo personal matriculado puede intervenir en la instalación.",
  },
  {
    icon: "🛑",
    title: "Corte de energía parcial",
    desc: "Diagnosticamos zonas sin luz o circuitos caídos. Restablecemos el servicio eléctrico con rapidez y seguridad, identificando la causa raíz para evitar que se repita.",
  },
  {
    icon: "🛡",
    title: "Disyuntores y térmicas que saltan",
    desc: "Reemplazamos disyuntores que saltan constantemente y térmicas defectuosas. Un disyuntor que no funciona bien deja sin protección toda tu instalación.",
  },
  {
    icon: "🔧",
    title: "Fallas en circuitos y artefactos",
    desc: "Diagnosticamos fallas eléctricas en circuitos y equipos. Revisamos conexiones, medimos tensión y aislación, e identificamos el componente que falló.",
  },
];

const faq = [
  {
    q: "¿Qué hago si salta el disyuntor y no puedo volver a subirlo?",
    a: "Primero, desconectá todos los aparatos del circuito afectado. Si el disyuntor vuelve a saltar al intentar subirlo, o si está visiblemente dañado o caliente, no insistas: hay un cortocircuito activo o una falla grave. Llamá a un electricista de inmediato. No intentes repararlo vos mismo.",
  },
  {
    q: "¿Por qué se queman los enchufes?",
    a: "Los enchufes quemados son síntoma de exceso de carga en el circuito, conexiones flojas o un enchufe de baja calidad que no soportó la corriente. Es una situación de riesgo real: un enchufe quemado puede originar un incendio eléctrico. Llamanos para reemplazarlo correctamente.",
  },
  {
    q: "¿Cuánto tiempo tarda una reparación eléctrica urgente en Carlos Paz?",
    a: "Para urgencias eléctricas en Carlos Paz y Punilla, intentamos llegar en menos de 2 horas. Llamanos al (351) 387-3029 y te informamos el tiempo estimado de llegada según la zona.",
  },
  {
    q: "¿Puedo cambiar yo mismo un enchufe quemado o un interruptor?",
    a: "No. Aunque parezca sencillo, intervenir en la instalación eléctrica —incluso cambiar un enchufe— requiere conocimientos de electricidad y herramientas adecuadas. Un error puede ser fatal. En Argentina, solo los electricistas matriculados pueden realizar este tipo de trabajo legalmente.",
  },
  {
    q: "¿Por qué salta el diferencial cuando llueve o hay humedad?",
    a: "El diferencial está detectando una corriente de fuga, probablemente causada por humedad que ingresó en algún punto de la instalación (caja, enchufe exterior, luminaria). Hay que diagnosticar el circuito afectado y resolverlo antes de volver a dar tensión. Llamanos.",
  },
  {
    q: "¿Atienden urgencias eléctricas los fines de semana en Punilla?",
    a: "Sí. Atendemos urgencias eléctricas los 7 días de la semana, las 24 horas, en Carlos Paz y toda la región de Punilla: Valle Hermoso, Cosquín, La Falda, La Cumbre y alrededores.",
  },
];

export default function ReparacionesPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> / <span className="text-amber-400">Reparaciones eléctricas</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Reparaciones eléctricas urgentes
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Reparaciones eléctricas en Carlos Paz y Punilla
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Servicio de reparaciones eléctricas rápido y seguro en Carlos Paz y Punilla.
              Atendemos urgencias 24/7: cortocircuitos, enchufes quemados, interruptores y
              cualquier falla eléctrica en hogares y empresas. Solo electricistas matriculados.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:+5493513873029"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors text-base"
              >
                ☎ Llamar ahora — 24/7
              </a>
              <a
                href="https://wa.me/5493513873029?text=Hola%2C+tengo+una+urgencia+el%C3%A9ctrica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                💬 WhatsApp urgente
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Aviso experto */}
      <section className="py-8 bg-red-950 text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <p className="font-bold text-lg">
              Ante cualquier falla eléctrica, no la intentes resolver vos mismo.
            </p>
            <p className="text-red-200 text-sm mt-1">
              Trabajar con electricidad sin capacitación puede causar electrocución o incendio. Siempre llamá a un
              electricista matriculado. Estamos disponibles las 24 horas en Carlos Paz y Punilla —{" "}
              <a href="tel:+5493513873029" className="underline font-semibold text-white">
                (351) 387-3029
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Tipos de reparaciones eléctricas que resolvemos en Carlos Paz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairs.map((r) => (
              <div
                key={r.title}
                className="p-6 border border-slate-200 rounded-xl hover:border-amber-400 transition-colors"
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{r.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ejemplos reales */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Ejemplos de problemas que resolvemos a diario en Punilla
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                situacion: "El disyuntor salta cada vez que uso el aire acondicionado",
                causa: "El circuito no tiene capacidad para la potencia del equipo o el disyuntor está desgastado.",
                solucion: "Instalamos un circuito dedicado con el cable y el disyuntor del calibre correcto para el aire. El trabajo se completa en el mismo día.",
              },
              {
                situacion: "Un enchufe chispeó y dejó de funcionar",
                causa: "Contacto flojo, sobrecarga o mala calidad del material. Es una situación de riesgo.",
                solucion: "Cortamos la energía del circuito, reemplazamos el tomacorriente por uno de calidad certificada y verificamos todo el ramal.",
              },
              {
                situacion: "Se fue la luz solo en una parte de la casa",
                causa: "Un disyuntor saltó, un fusible se fundió (en tableros viejos) o hay un corte en el cable.",
                solucion: "Diagnosticamos el circuito afectado, identificamos el origen de la falla y restablecemos el servicio con las protecciones adecuadas.",
              },
              {
                situacion: "Siento olor a quemado cerca del tablero eléctrico",
                causa: "Conexión floja que genera calor, disyuntor sobrecalentado o cable con el aislamiento dañado.",
                solucion: "Es una emergencia. Cortamos el suministro, inspeccionamos el tablero y la instalación, y reparamos el origen del problema antes de reponer tensión.",
              },
            ].map((item) => (
              <div
                key={item.situacion}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <p className="font-bold text-slate-900 mb-2">"{item.situacion}"</p>
                <p className="text-sm text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">Causa probable:</span>{" "}
                  {item.causa}
                </p>
                <p className="text-sm text-amber-700 font-medium">
                  <span className="font-semibold text-slate-700">Cómo lo resolvemos:</span>{" "}
                  {item.solucion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Reparaciones eléctricas en Carlos Paz — Urgencias 24/7
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              En Voltis somos electricistas matriculados especializados en reparaciones
              eléctricas en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y todo el
              Valle de Punilla, Córdoba.
            </p>
            <p>
              Las reparaciones eléctricas en Argentina deben ser realizadas por profesionales
              habilitados. Un problema eléctrico mal resuelto puede generar un nuevo cortocircuito,
              un incendio o una electrocución. No pongas en riesgo tu hogar ni tu familia.
            </p>
            <p>
              Para urgencias eléctricas en Carlos Paz y Punilla, llamanos directamente al{" "}
              <a href="tel:+5493513873029" className="text-amber-600 font-semibold hover:underline">
                (351) 387-3029
              </a>
              . Atendemos las 24 horas los 7 días de la semana.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Reparaciones eléctricas
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
