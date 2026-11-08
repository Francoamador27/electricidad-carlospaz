import type { Metadata } from "next";
import Link from "next/link";
import { SERVICIOS } from "@voltis/shared/negocio";
import { metaPagina } from "@/lib/seo";
import { CONTENIDO_SERVICIOS } from "@/lib/servicios";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = metaPagina({
  titulo: "Servicios de electricista en Carlos Paz para casas y comercios",
  descripcion:
    "Arreglos y fallas, tomacorrientes, bocas de luz, ventiladores de techo, tableros, locales comerciales e instalaciones completas en Carlos Paz y Punilla.",
  ruta: "/servicios",
});

const principales = SERVICIOS.filter((s) => s.principal);
const secundarios = SERVICIOS.filter((s) => !s.principal);

export default function ServicesPage() {
  return (
    <>
      <section className="bg-ink text-white py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Servicios para casas y comercios en Carlos Paz
          </h1>
          <p className="text-muted text-lg max-w-3xl">
            Decime qué necesitás y te respondo en el día por WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {principales.map((s) => (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="border border-warm-border rounded p-6 hover:border-copper transition-colors"
              >
                <h2 className="font-display text-xl font-bold text-ink mb-2">{s.nombre}</h2>
                <p className="text-warm-gray text-sm leading-relaxed">{CONTENIDO_SERVICIOS[s.slug].intro}</p>
              </Link>
            ))}
          </div>

          <h2 className="font-display text-lg font-semibold text-ink mt-12 mb-3">Otros servicios</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {secundarios.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="text-copper-dark hover:underline">
                  {s.corto}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/certificado-instalacion-electrica-apta" className="text-copper-dark hover:underline">
                Certificado de instalación apta
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
