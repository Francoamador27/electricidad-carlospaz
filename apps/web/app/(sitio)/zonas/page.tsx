import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Link from "next/link";
import ContactBanner from "@/components/sections/ContactBanner";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getZonas } from "@/lib/contenido";
import { LOCALIDADES } from "@voltis/shared";

export const metadata: Metadata = metaPagina({
  titulo: "Zonas de cobertura — Electricista en Carlos Paz y Punilla",
  descripcion:
    "Localidades donde trabajamos: Villa Carlos Paz, el valle del río San Antonio, Tanti, Malagueño y todo el valle de Punilla hasta La Cumbre.",
  ruta: "/zonas",
});

export default async function ZonasPage() {
  const zonas = await getZonas();
  const conPagina = new Set(zonas.map((z) => z.slug));

  return (
    <>
      <Breadcrumbs items={[{ nombre: "Zonas", url: "/zonas" }]} />
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Zonas de cobertura
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Electricistas en Carlos Paz y todo Punilla
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Trabajamos desde Villa Carlos Paz en todo el valle de Punilla y alrededores. Elegí tu
            localidad para ver los trabajos que hacemos ahí.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOCALIDADES.map((l) => {
              const zona = zonas.find((z) => z.slug === l.slug);
              return (
                <li key={l.slug}>
                  {conPagina.has(l.slug) ? (
                    <Link
                      href={`/zonas/${l.slug}`}
                      className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-5 py-4 hover:border-amber-400 hover:shadow-sm transition-all"
                    >
                      <span className="font-semibold text-slate-900">
                        📍 {l.nombre}
                        {zona?.estado === "borrador" && (
                          <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                            BORRADOR
                          </span>
                        )}
                      </span>
                      <span className="text-amber-600">→</span>
                    </Link>
                  ) : (
                    <span className="flex items-center border border-slate-200 rounded-xl px-5 py-4 text-slate-700">
                      📍 {l.nombre}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-slate-600 text-sm mt-8 text-center">
            ¿Tu localidad no está en la lista?{" "}
            <Link href="/contacto" className="text-amber-600 font-semibold hover:underline">
              Consultanos
            </Link>{" "}
            y te decimos si llegamos.
          </p>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
