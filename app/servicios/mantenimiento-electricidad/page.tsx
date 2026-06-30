import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Mantenimiento eléctrico en Carlos Paz y Punilla",
  description:
    "Mantenimiento eléctrico preventivo y correctivo en Carlos Paz y Punilla, Córdoba. Revisiones, diagnóstico y certificaciones eléctricas. Electricistas matriculados.",
  alternates: { canonical: "/servicios/mantenimiento-electricidad" },
};

const checks = [
  "Revisión del tablero eléctrico y todos sus disyuntores",
  "Verificación y medición del sistema de puesta a tierra",
  "Medición de resistencia de aislación de los cables",
  "Revisión de tomacorrientes y bocas de luz",
  "Detección de sobrecargas y cortocircuitos latentes",
  "Inspección de cables en zonas de riesgo (humedad, sol, roedores)",
  "Verificación del funcionamiento del diferencial",
  "Informe técnico y certificado de revisión",
];

const faq = [
  {
    q: "¿Con qué frecuencia hay que hacer mantenimiento eléctrico?",
    a: "Se recomienda una revisión eléctrica preventiva al menos una vez al año en viviendas. En locales comerciales e industrias, cada 6 meses. Las instalaciones con más de 10 años sin revisión son las más prioritarias: con el tiempo, los aislamientos se deterioran y las conexiones se aflojan.",
  },
  {
    q: "¿Qué pasa si no hago mantenimiento eléctrico en mi hogar?",
    a: "Las instalaciones sin mantenimiento acumulan calor en las conexiones, deterioran sus aislamientos y pueden originar cortocircuitos o incendios eléctricos. El mantenimiento preventivo es siempre más barato que una reparación de emergencia, y puede salvar vidas.",
  },
  {
    q: "¿El mantenimiento eléctrico es obligatorio para comercios en Carlos Paz?",
    a: "Sí. Los comercios e industrias en Córdoba deben presentar certificados de instalación eléctrica vigentes para mantener sus habilitaciones municipales. Voltis emite los certificados técnicos necesarios para tramitar ante el municipio de Carlos Paz.",
  },
  {
    q: "¿Puedo hacer yo mismo la revisión eléctrica de mi hogar?",
    a: "No. La revisión eléctrica requiere instrumentos de medición específicos (megóhmetro, pinza amperimétrica, detector de tensión) y conocimientos técnicos. Un electricista matriculado puede detectar fallas que a simple vista son invisibles. No arriesgues tu seguridad intentando hacerlo vos mismo.",
  },
  {
    q: "¿Cuánto tiempo lleva una revisión eléctrica preventiva?",
    a: "Para una vivienda estándar de Carlos Paz, la revisión eléctrica preventiva lleva entre 2 y 4 horas, según el tamaño y el estado de la instalación. Al finalizar, entregamos un informe técnico y, si la instalación está en condiciones, el certificado de revisión.",
  },
  {
    q: "¿Atienden mantenimiento eléctrico en toda la región de Punilla?",
    a: "Sí. Realizamos mantenimiento eléctrico preventivo en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y todas las localidades del Valle de Punilla, Córdoba.",
  },
];

export default function MantenimientoPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> / <span className="text-amber-400">Mantenimiento eléctrico</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Mantenimiento eléctrico preventivo
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Mantenimiento eléctrico en Carlos Paz y Punilla
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              El mantenimiento eléctrico preventivo en Carlos Paz es fundamental para evitar
              accidentes y cortes inesperados. Revisamos, diagnosticamos y certificamos
              instalaciones eléctricas en hogares y empresas de Punilla. Solo electricistas
              matriculados realizan estos trabajos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/presupuesto" variant="primary" className="text-base px-6 py-3">
                Solicitar revisión preventiva
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

      {/* Llamado experto */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 items-center">
          <span className="text-4xl shrink-0">🔍</span>
          <div>
            <p className="font-bold text-slate-900">
              Las fallas eléctricas peligrosas son invisibles sin los instrumentos adecuados.
            </p>
            <p className="text-slate-700 text-sm mt-1">
              Solo un electricista matriculado con equipos de medición puede detectar aislamientos
              deteriorados, conexiones flojas o corrientes de fuga antes de que causen un accidente.
              No esperes a que pase algo: agendá una revisión preventiva.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              ¿Qué incluye la revisión eléctrica preventiva?
            </h2>
            <ul className="space-y-3">
              {checks.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="text-amber-500 font-bold text-lg mt-0.5">✓</span>
                  <span className="text-slate-700">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              ¿Con qué frecuencia hay que hacer mantenimiento eléctrico?
            </h3>
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p>
                Recomendamos revisión eléctrica preventiva al menos{" "}
                <strong>una vez al año en viviendas</strong> y cada{" "}
                <strong>6 meses en locales comerciales e industrias</strong>.
              </p>
              <p>
                Las instalaciones eléctricas con más de 10 años sin revisión en Carlos Paz son
                especialmente importantes de inspeccionar. Con el tiempo, los aislamientos se
                agrietan, las conexiones se aflojan y la instalación pierde las condiciones de
                seguridad originales.
              </p>
              <div className="mt-4 p-4 bg-white rounded-xl border border-amber-300">
                <p className="font-semibold text-amber-800 text-sm">
                  ☎ Agendá tu revisión preventiva:{" "}
                  <a href="tel:+5493513873029" className="underline">
                    (351) 387-3029
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas que detectamos */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Problemas que detectamos en las revisiones preventivas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🌡️",
                problema: "Conexiones con puntos calientes",
                consecuencia:
                  "Pueden originar incendios eléctricos. Se detectan con cámara termográfica o midiendo la temperatura en el tablero.",
              },
              {
                icon: "💧",
                problema: "Humedad en cajas y cañerías",
                consecuencia:
                  "La humedad deteriora el aislamiento de los cables y puede causar cortocircuitos o corrientes de fuga peligrosas.",
              },
              {
                icon: "🐭",
                problema: "Cables mordidos por roedores",
                consecuencia:
                  "Frecuente en entrepisos y espacios ocultos. Un cable pelado puede causar cortocircuito o electrocución.",
              },
              {
                icon: "⚡",
                problema: "Aislación deteriorada",
                consecuencia:
                  "Los aislamientos plásticos se degradan con el calor y el tiempo. Una medición con megóhmetro detecta el nivel de riesgo.",
              },
              {
                icon: "🔌",
                problema: "Tomacorrientes flojos o sin tensión",
                consecuencia:
                  "Un tomacorriente flojo genera chispas internas que pueden iniciar un incendio. Si no da tensión, hay una falla en el circuito que hay que encontrar.",
              },
              {
                icon: "🛡",
                problema: "Diferencial que no actúa correctamente",
                consecuencia:
                  "Verificamos que el diferencial corte en el tiempo correcto con la corriente de fuga de 30 mA. Un diferencial defectuoso no protege.",
              },
            ].map((item) => (
              <div
                key={item.problema}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1">{item.problema}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.consecuencia}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Mantenimiento eléctrico en Carlos Paz, Cosquín, La Falda y todo Punilla
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              En Voltis realizamos mantenimiento eléctrico preventivo y correctivo en
              toda la región de Punilla, Córdoba. Atendemos hogares, comercios, hoteles,
              industrias y edificios en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y
              alrededores.
            </p>
            <p>
              El mantenimiento eléctrico no es un gasto: es una inversión en seguridad. Una
              instalación revisada periódicamente por electricistas matriculados reduce el riesgo
              de incendios, cortocircuitos y fallas costosas.
            </p>
            <p>
              Para coordinar una revisión preventiva en Carlos Paz o Punilla, llamanos al{" "}
              <a href="tel:+5493513873029" className="text-amber-600 font-semibold hover:underline">
                (351) 387-3029
              </a>{" "}
              o completá el formulario de presupuesto.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Mantenimiento eléctrico
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
