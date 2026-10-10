import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import CTAPresupuesto from "@/components/sections/CTAPresupuesto";
import { LINK_TELEFONO } from "@voltis/shared/negocio";
import ServicioJsonLd from "@/components/seo/ServicioJsonLd";

export const metadata: Metadata = metaPagina({
  titulo: "Instalación de cámaras de seguridad en Carlos Paz y Punilla",
  descripcion:
    "Instalación de cámaras de seguridad para casas y comercios en Carlos Paz y Punilla, Córdoba. Cableado prolijo, alimentación segura y acceso desde el celular.",
  ruta: "/servicios/camaras-de-seguridad",
});

const services = [
  {
    title: "Cámaras para viviendas",
    desc: "Cubrimos accesos, portón, cochera y patio. Ideal para casas de fin de semana en Punilla que pasan tiempo vacías: mirás lo que pasa desde el celular estés donde estés.",
  },
  {
    title: "Cámaras para comercios",
    desc: "Vigilancia de caja, salón, depósito y vereda. Grabación continua o por detección de movimiento, con acceso para el dueño y el encargado.",
  },
  {
    title: "Cableado y alimentación",
    desc: "Lo que más falla en un sistema de cámaras es la instalación: cables expuestos, fuentes precarias o empalmes a la intemperie. Hacemos el tendido protegido y la alimentación con su protección eléctrica.",
  },
  {
    title: "Configuración y acceso remoto",
    desc: "Dejamos configurada la grabación, las alertas y la app en tu celular, y te mostramos cómo revisar las grabaciones.",
  },
];

const faq = [
  {
    q: "¿Puedo ver las cámaras desde el celular?",
    a: "Sí. Dejamos configurado el acceso desde una app en tu celular para que veas las cámaras en vivo y revises grabaciones, siempre que la propiedad tenga conexión a internet.",
  },
  {
    q: "¿Las cámaras necesitan una instalación eléctrica especial?",
    a: "Necesitan alimentación estable y protegida. Una fuente mal instalada o un cable expuesto a la lluvia es la causa más común de cámaras que se apagan. Hacemos el cableado y la alimentación como parte del trabajo.",
  },
  {
    q: "¿Sirven para una casa de fin de semana?",
    a: "Es uno de los usos más comunes en Punilla. Podés recibir alertas de movimiento y revisar la casa sin estar ahí. Si la casa no tiene internet fijo, te asesoramos sobre alternativas.",
  },
  {
    q: "¿Cuántas cámaras necesito?",
    a: "Depende de los accesos y de lo que quieras cubrir. En una casa típica alcanza con cubrir el ingreso, el portón o la cochera y el patio. En la visita te recomendamos la cantidad y ubicación justas.",
  },
  {
    q: "¿En qué zonas instalan cámaras?",
    a: "En Carlos Paz y todo el Valle de Punilla: Cabalango, San Antonio de Arredondo, Icho Cruz, Tanti, Cosquín, Valle Hermoso, La Falda, La Cumbre y alrededores.",
  },
];

export default function CamarasSeguridadPage() {
  return (
    <>
      <ServicioJsonLd slug="camaras-de-seguridad" faq={faq} />
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-3">
            <span>Servicios</span> / <span className="text-amber-400">Cámaras de seguridad</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Cámaras de seguridad
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Instalación de cámaras de seguridad en Carlos Paz
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Instalamos cámaras de seguridad para casas y comercios en Carlos Paz y toda la región
              de Punilla, con cableado prolijo, alimentación segura y acceso desde tu celular.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/presupuesto" variant="primary" className="text-base px-6 py-3">
                Solicitar presupuesto
              </Button>
              <a
                href={LINK_TELEFONO}
                className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                ☎ Llamar ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Qué incluye la instalación de cámaras
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

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Cámaras de seguridad en Carlos Paz y Punilla
          </h2>
          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              En el Valle de Punilla hay muchas casas de descanso y cabañas que pasan semanas sin
              nadie. Un sistema de cámaras bien instalado te deja ver tu propiedad desde el celular y
              recibir alertas si hay movimiento.
            </p>
            <p>
              Como electricistas, cuidamos la parte que más falla en estos sistemas: la
              alimentación y el cableado. También podemos combinar las cámaras con{" "}
              <a href="/servicios/iluminacion-automatizacion" className="text-amber-700 font-semibold hover:underline">
                iluminación exterior con sensores y automatización
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes — Cámaras de seguridad
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="bg-white border border-slate-200 rounded-xl p-5 group open:border-amber-400 transition-colors"
              >
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center gap-4">
                  {item.q}
                  <span className="text-amber-700 shrink-0 text-xl font-bold group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTAPresupuesto />
      <ContactBanner />
    </>
  );
}
