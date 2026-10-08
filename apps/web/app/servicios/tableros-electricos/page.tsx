import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Tableros eléctricos en Carlos Paz y Punilla",
  description:
    "Instalación, actualización y mantenimiento de tableros eléctricos en Carlos Paz y Punilla, Córdoba. Tableros modernos con disyuntores y protecciones. Electricistas matriculados.",
  alternates: { canonical: "/servicios/tableros-electricos" },
};

const services = [
  {
    title: "Instalación de tablero nuevo",
    desc: "Instalamos tableros eléctricos modernos con disyuntores diferenciales y termomagnéticos en Carlos Paz. Calculamos la carga real y dimensionamos el tablero para tu demanda actual y futura.",
  },
  {
    title: "Actualización de tablero antiguo",
    desc: "Modernizamos tableros obsoletos con fusibles por tableros con protecciones automáticas en Punilla. Un tablero con fusibles es un riesgo eléctrico serio: no ofrecen protección diferencial.",
  },
  {
    title: "Ampliación de tablero",
    desc: "Agregamos circuitos y llaves al tablero existente para nuevas zonas o equipos de alta potencia. Ideal cuando instalás un aire acondicionado, calefactor eléctrico o ampliás tu vivienda.",
  },
  {
    title: "Mantenimiento de tablero",
    desc: "Revisión y ajuste de conexiones, limpieza, medición de aislación y verificación del correcto funcionamiento de todas las protecciones. Recomendado una vez al año.",
  },
];

const faq = [
  {
    q: "¿Cuándo hay que actualizar el tablero eléctrico?",
    a: "Cuando tiene fusibles tipo cuchilla o de vidrio (en lugar de disyuntores), cuando los disyuntores saltan con frecuencia, cuando sentís calor o olor a quemado cerca del tablero, o cuando la instalación tiene más de 20 años sin revisión. También cuando sumás nuevos equipos de alta potencia que la instalación actual no puede manejar.",
  },
  {
    q: "¿Qué diferencia hay entre un disyuntor termomagnético y un diferencial?",
    a: "El termomagnético protege los cables y equipos de sobrecargas y cortocircuitos (si hay demasiada corriente, corta el circuito). El diferencial protege a las personas de electrocución al detectar corrientes de fuga hacia tierra. Un tablero moderno y seguro necesita ambos tipos.",
  },
  {
    q: "¿Por qué salta el diferencial constantemente?",
    a: "Puede deberse a un electrodoméstico defectuoso conectado al circuito, una falla en el cableado, humedad que ingresó en algún punto de la instalación, o un diferencial ya deteriorado. No es normal que salte seguido: es señal de un problema que hay que diagnosticar con un electricista.",
  },
  {
    q: "¿Mi tablero con fusibles es peligroso?",
    a: "Sí. Los tableros con fusibles no ofrecen protección diferencial contra electrocución. Además, los fusibles quemados suelen reemplazarse con elementos incorrectos (papel, monedas), lo que elimina toda protección. Recomendamos actualizarlo a un tablero moderno con disyuntores.",
  },
  {
    q: "¿Puedo cambiar un fusible quemado yo mismo?",
    a: "No. Cualquier intervención en el tablero eléctrico —incluyendo el cambio de un fusible— debe ser realizada por un electricista matriculado. Es peligroso y puede generar responsabilidades legales. Además, un fusible quemado es síntoma de un problema más profundo que hay que diagnosticar.",
  },
  {
    q: "¿Cuánto tarda la instalación o actualización de un tablero en Carlos Paz?",
    a: "Una actualización de tablero domiciliario típica puede realizarse en un día de trabajo. Instalaciones más complejas (tableros trifásicos, edificios o industrias) pueden requerir 2 o más días. Antes de comenzar, te damos un presupuesto y cronograma detallado.",
  },
];

export default function TablerosPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> / <span className="text-amber-400">Tableros eléctricos</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Tableros eléctricos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Tableros eléctricos en Carlos Paz y Punilla
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Instalamos, actualizamos y damos mantenimiento a tableros eléctricos en Carlos Paz y
              toda la región de Punilla. Un tablero eléctrico moderno protege tu instalación y a tu
              familia de sobrecargas, cortocircuitos y riesgos eléctricos graves.
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
          <span className="text-4xl shrink-0">🔒</span>
          <div>
            <p className="font-bold text-slate-900">
              El tablero eléctrico es el sistema de protección de tu hogar o empresa.
            </p>
            <p className="text-slate-700 text-sm mt-1">
              Nunca intervengas en él sin ser electricista habilitado. Un tablero mal intervenido
              puede dejar sin protección toda la instalación.{" "}
              <a href="tel:+5493513873029" className="text-amber-600 font-semibold hover:underline">
                Llamanos al (351) 387-3029
              </a>{" "}
              y lo resolvemos de forma segura.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Servicios de tableros eléctricos en Carlos Paz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="p-6 border border-slate-200 rounded-xl hover:border-amber-400 transition-colors"
              >
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Señales de alerta */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Señales de que tu tablero necesita atención
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🔴", señal: "Tiene fusibles tipo cuchilla o de vidrio" },
              { icon: "🔴", señal: "Los disyuntores saltan con frecuencia" },
              { icon: "🔴", señal: "Sentís calor o olor a quemado en el tablero" },
              { icon: "🔴", señal: "El diferencial no está instalado o no funciona" },
              { icon: "🔴", señal: "La instalación tiene más de 20 años sin revisión" },
              { icon: "🔴", señal: "Chispas al conectar equipos de alta potencia" },
            ].map((item) => (
              <div
                key={item.señal}
                className="flex gap-3 items-center p-4 bg-white rounded-xl border border-red-200"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="text-slate-800 text-sm font-medium">{item.señal}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-700 mb-4">
              Si reconocés alguna de estas señales, no lo dejes para después.
            </p>
            <a
              href="tel:+5493513873029"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors text-base"
            >
              ☎ Llamar ahora — (351) 387-3029
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            ¿Tu tablero eléctrico tiene fusibles? Actualizalo hoy
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto mb-4 text-sm">
            Los tableros con fusibles en Carlos Paz son un riesgo eléctrico. Modernizamos tu
            tablero con disyuntores termomagnéticos y diferenciales para proteger tu hogar o
            empresa.
          </p>
          <Button href="/contacto" variant="secondary">
            Consultar actualización de tablero
          </Button>
        </div>
      </section>

      {/* SEO text */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Tableros eléctricos en Carlos Paz y Punilla — Todo lo que necesitás saber
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              El tablero eléctrico (también llamado tablero de distribución o caja de fusibles en
              instalaciones antiguas) es el elemento central de toda instalación eléctrica. Recibe
              la energía de la red y la distribuye a cada circuito de tu hogar o empresa con
              protecciones adecuadas.
            </p>
            <p>
              En Carlos Paz y el Valle de Punilla, muchas viviendas tienen tableros eléctricos
              instalados hace más de 20 años que ya no cumplen con la normativa vigente (AEA 90364)
              ni tienen la capacidad para la demanda eléctrica actual. Actualizarlos es una
              inversión en seguridad, no un gasto.
            </p>
            <p>
              En Voltis instalamos, actualizamos y mantenemos tableros eléctricos en
              Carlos Paz, Cosquín, La Falda, Valle Hermoso, La Cumbre y toda la región de Punilla,
              Córdoba. Trabajamos con electricistas matriculados y materiales de primera calidad.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Tableros eléctricos
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
