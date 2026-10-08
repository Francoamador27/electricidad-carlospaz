import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Iluminación y automatización en Carlos Paz y Punilla",
  description:
    "Instalación de iluminación LED, sensores de movimiento, automatización eléctrica y cámaras de seguridad en Carlos Paz y Punilla, Córdoba. Electricistas matriculados con garantía.",
  alternates: { canonical: "/servicios/iluminacion-automatizacion" },
};

const services = [
  {
    title: "Iluminación LED interior",
    desc: "Diseño e instalación de sistemas de iluminación LED para ambientes residenciales y comerciales en Carlos Paz. Ahorrá hasta un 70% en consumo energético respecto a las lámparas incandescentes.",
  },
  {
    title: "Iluminación LED exterior",
    desc: "Iluminación de jardines, accesos, cocheras, fachadas y espacios exteriores con tecnología LED resistente a la intemperie. Mayor seguridad y estética para tu propiedad en Punilla.",
  },
  {
    title: "Sensores de movimiento y temporizado",
    desc: "Instalación de sensores de presencia para escaleras, pasillos y exteriores. Activación automática de la luz cuando se necesita y apagado cuando no hay movimiento, reduciendo el consumo al mínimo.",
  },
  {
    title: "Automatización eléctrica",
    desc: "Automatizamos circuitos de iluminación, persianas eléctricas, ventiladores y otros dispositivos. Desde timers básicos hasta sistemas controlados por aplicación móvil.",
  },
  {
    title: "Cámaras de seguridad",
    desc: "Instalación de sistemas de videovigilancia IP y analógico para viviendas, comercios y locales en Carlos Paz y la región. Configuración remota para ver tu propiedad desde el celular.",
  },
  {
    title: "Sistemas de alarma",
    desc: "Instalación de alarmas perimetrales, detectores de movimiento y contactos magnéticos integrados a tu sistema eléctrico. Protección completa para tu hogar o empresa en Punilla.",
  },
];

const faq = [
  {
    q: "¿Vale la pena cambiar a iluminación LED en Carlos Paz?",
    a: "Sí, totalmente. Las lámparas LED consumen entre un 60% y 80% menos que las incandescentes y duran entre 15 y 25 veces más. En Carlos Paz, donde muchas propiedades tienen instalaciones antiguas con muchos puntos de luz, el ahorro en la factura de EPEC puede ser significativo desde el primer mes.",
  },
  {
    q: "¿Puedo instalar luces LED sin cambiar la instalación eléctrica?",
    a: "En la mayoría de los casos sí. Las lámparas LED son compatibles con bocas de luz y circuitos existentes. Sin embargo, si querés instalar tiras LED, iluminación empotrada o sistemas de automatización, puede ser necesario ajustar el circuito. Te evaluamos el caso sin cargo.",
  },
  {
    q: "¿Qué es la automatización eléctrica y para qué sirve?",
    a: "La automatización eléctrica permite controlar dispositivos del hogar o la empresa de forma automática o remota: encender luces a cierta hora, apagar electrodomésticos sin estar presente, activar persianas con un botón. Mejora la comodidad, la seguridad y reduce el consumo energético.",
  },
  {
    q: "¿Las cámaras de seguridad necesitan instalación eléctrica especializada?",
    a: "Sí. Las cámaras de seguridad requieren alimentación eléctrica estable y, en sistemas más complejos, cableado de red estructurado. Realizamos la instalación eléctrica completa del sistema para garantizar que funcione de forma continua y sin interferencias.",
  },
  {
    q: "¿Atienden en toda la región de Punilla?",
    a: "Sí. Instalamos sistemas de iluminación, automatización y seguridad en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre, Tanti, Icho Cruz y todas las localidades de Punilla, Córdoba.",
  },
  {
    q: "¿Ofrecen garantía en los trabajos de iluminación y automatización?",
    a: "Sí. Todos nuestros trabajos tienen garantía. Si después de la instalación presentan fallas vinculadas a nuestro trabajo, volvemos sin costo adicional para resolverlo.",
  },
];

export default function IluminacionAutomatizacionPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> / <span className="text-amber-400">Iluminación y automatización</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Iluminación y automatización
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Iluminación LED y automatización en Carlos Paz
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Instalamos sistemas de iluminación LED, automatización eléctrica, cámaras de seguridad
              y alarmas en Carlos Paz y toda la región de Punilla. Ahorrá energía, mejorá la
              seguridad y el confort de tu hogar o empresa.
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

      {/* Aviso ahorro energético */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 items-center">
          <span className="text-4xl shrink-0">💡</span>
          <div>
            <p className="font-bold text-slate-900">
              La iluminación puede representar hasta el 30% de tu factura eléctrica.
            </p>
            <p className="text-slate-700 text-sm mt-1">
              Cambiar a tecnología LED con automatización reduce ese consumo drásticamente.{" "}
              <a href="/presupuesto" className="text-amber-600 font-semibold hover:underline">
                Pedí un presupuesto sin cargo
              </a>{" "}
              y te calculamos el ahorro estimado para tu propiedad.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Servicios de iluminación y automatización en Carlos Paz
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

      {/* Beneficios LED */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            ¿Por qué pasarse a iluminación LED?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "⚡", beneficio: "Consumo hasta 80% menor que incandescentes" },
              { icon: "⏳", beneficio: "Vida útil de 15.000 a 50.000 horas" },
              { icon: "🌡️", beneficio: "No generan calor — más seguras en el hogar" },
              { icon: "🎨", beneficio: "Mayor calidad de luz y temperatura de color elegible" },
              { icon: "♻️", beneficio: "Sin mercurio — más amigables con el ambiente" },
              { icon: "💰", beneficio: "Recuperás la inversión en la primera factura de EPEC" },
            ].map((item) => (
              <div
                key={item.beneficio}
                className="flex gap-3 items-center p-4 bg-white rounded-xl border border-slate-200"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="text-slate-800 text-sm font-medium">{item.beneficio}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Renová la iluminación de tu hogar o empresa en Carlos Paz
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto mb-4 text-sm">
            Diseñamos e instalamos el sistema de iluminación LED adaptado a tu espacio y presupuesto.
            También integramos sensores, automatización y cámaras de seguridad.
          </p>
          <Button href="/presupuesto" variant="secondary">
            Solicitar presupuesto sin cargo
          </Button>
        </div>
      </section>

      {/* SEO text */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Iluminación LED y automatización en Carlos Paz y Punilla
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              En Carlos Paz y el Valle de Punilla, cada vez más hogares y comercios están migrando
              a sistemas de iluminación LED. Más allá del ahorro energético, la iluminación LED
              permite mayor flexibilidad de diseño, mejor calidad de luz y una vida útil mucho mayor
              que las lámparas tradicionales.
            </p>
            <p>
              La automatización eléctrica complementa la iluminación LED para lograr el máximo
              ahorro y confort: sensores de movimiento que apagan la luz cuando un ambiente está
              vacío, timers para iluminación exterior, o control desde el celular para saber que
              tu propiedad está protegida aunque no estés presente.
            </p>
            <p>
              En Voltis instalamos estos sistemas en Carlos Paz, Cosquín, Valle Hermoso, La Falda,
              La Cumbre, Tanti, Icho Cruz y toda la región de Punilla, Córdoba. Electricistas
              matriculados, materiales certificados y garantía en todos los trabajos.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Iluminación y automatización
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
