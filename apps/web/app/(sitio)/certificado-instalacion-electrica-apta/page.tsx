import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import CTAPresupuesto from "@/components/sections/CTAPresupuesto";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { LINK_TELEFONO, LOCALIDADES, NEGOCIO, linkWhatsapp } from "@voltis/shared";
import { SITE_URL } from "@/lib/site";

const URL_PAGINA = "/certificado-instalacion-electrica-apta";

export const metadata: Metadata = {
  title: "Certificado de Instalación Eléctrica Apta (Ley 10.281)",
  description:
    "Emitimos el Certificado de Instalación Eléctrica Apta de la Ley 10.281 de Córdoba para pedir la luz, cambiar la potencia o el tipo de medidor. Carlos Paz y Punilla.",
  alternates: { canonical: URL_PAGINA },
};

const CUANDO = [
  {
    titulo: "Pedir la luz por primera vez",
    texto: "Casa nueva, local o terreno sin medidor: la distribuidora pide el certificado para conectar el suministro.",
  },
  {
    titulo: "Cambiar la potencia contratada",
    texto: "Si sumás equipos (aires, horno eléctrico, bomba) y necesitás más potencia, el trámite puede requerir el certificado.",
  },
  {
    titulo: "Pasar de monofásico a trifásico (o al revés)",
    texto: "Un cambio de titularidad solo no lo requiere, pero si además cambia el tipo de medidor, sí.",
  },
  {
    titulo: "Comercios y locales de acceso público",
    texto: "La ley obliga a que los lugares de acceso público tengan su instalación adecuada a la normativa del ERSeP.",
  },
];

const PASOS = [
  "Revisamos la instalación: tablero, protecciones, puesta a tierra, cableado y materiales.",
  "Si algo no cumple, te pasamos el presupuesto para adecuarlo.",
  "Con la instalación en regla, emitimos y firmamos el certificado.",
  "Lo presentás ante la distribuidora de tu zona (EPEC o la cooperativa local) para tu trámite.",
];

const faq = [
  {
    q: "¿Qué es el Certificado de Instalación Eléctrica Apta?",
    a: "Es el documento que establece la Ley provincial 10.281 de Seguridad Eléctrica de Córdoba. Lo emite y firma un instalador electricista habilitado e indica que la instalación cumple con la normativa técnica del ERSeP en materiales, equipos y ejecución.",
  },
  {
    q: "¿Quién puede emitirlo?",
    a: "Solo un Instalador Electricista Habilitado inscripto en el registro del ERSeP, que es la autoridad de aplicación de la ley. Cada categoría de instalador puede certificar distintos tipos de instalaciones.",
  },
  {
    q: "¿Desde cuándo es obligatorio?",
    a: "La Ley 10.281 entró en plena vigencia el 1 de diciembre de 2017, con la Resolución General 46/2017 del ERSeP.",
  },
  {
    q: "¿Dónde se presenta?",
    a: "Ante la distribuidora de energía que corresponda a tu domicilio: EPEC o la cooperativa eléctrica de tu localidad. Los requisitos exactos del trámite los define cada distribuidora; te ayudamos a saber qué te van a pedir.",
  },
  {
    q: "¿Qué pasa si mi instalación no cumple?",
    a: "No se puede certificar. Te indicamos qué hay que corregir —por ejemplo, agregar el disyuntor diferencial, la puesta a tierra o separar circuitos— y te pasamos el presupuesto para adecuarla.",
  },
  {
    q: "¿Emiten el certificado en toda la región?",
    a: "Sí, en Carlos Paz y todo el Valle de Punilla: Cabalango, San Antonio de Arredondo, Icho Cruz, Tanti, Bialet Massé, Cosquín, Valle Hermoso, La Falda, La Cumbre y alrededores.",
  },
];

export default function CertificadoPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Certificado de instalación eléctrica apta", url: URL_PAGINA }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Certificado de Instalación Eléctrica Apta (Ley 10.281)",
          serviceType: "Certificación de instalaciones eléctricas",
          url: `${SITE_URL}${URL_PAGINA}`,
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: LOCALIDADES.map((l) => ({ "@type": "City", name: l.nombre })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
              Ley 10.281 de Seguridad Eléctrica de Córdoba
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Certificado de Instalación Eléctrica Apta en Carlos Paz
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Revisamos tu instalación, la adecuamos si hace falta y emitimos el certificado que te
              pide la distribuidora para pedir la luz, cambiar la potencia o el tipo de medidor.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={linkWhatsapp("Hola, necesito el certificado de instalación eléctrica apta")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                💬 Consultar por WhatsApp
              </a>
              <a
                href={LINK_TELEFONO}
                className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                ☎ {NEGOCIO.telefonoVisible}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            ¿Cuándo te piden el certificado?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CUANDO.map((c) => (
              <div key={c.titulo} className="p-6 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{c.titulo}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{c.texto}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm text-center mt-6">
            Cada distribuidora define los requisitos de sus trámites. Si no sabés si lo necesitás,
            consultanos y te ayudamos a averiguarlo.
          </p>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Cómo lo hacemos</h2>
          <ol className="space-y-4">
            {PASOS.map((p, i) => (
              <li key={p} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-500 text-slate-900 font-black grid place-items-center">
                  {i + 1}
                </span>
                <span className="text-slate-700 pt-1.5">{p}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <Button href="/presupuesto" variant="primary">
              Pedir presupuesto
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-slate-700 space-y-4 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">
            Qué revisamos para certificar
          </h2>
          <p>
            Para que una instalación sea apta tiene que cumplir con la reglamentación técnica del
            ERSeP. En la práctica revisamos que el tablero tenga sus protecciones (termomagnéticas y
            disyuntor diferencial), que haya puesta a tierra medida, que los cables tengan la sección
            correcta para cada circuito y que los materiales sean normalizados.
          </p>
          <p>
            Si tu tablero todavía tiene fusibles o no tiene diferencial, es muy probable que haya que
            adecuarlo antes. Lo hacemos en la misma visita o en una siguiente:{" "}
            <Link href="/servicios/tableros-electricos" className="text-amber-600 font-semibold hover:underline">
              actualización de tableros eléctricos
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Preguntas frecuentes sobre el certificado
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

      <CTAPresupuesto />
      <ContactBanner />
    </>
  );
}
