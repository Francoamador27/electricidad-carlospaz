import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";
import FotoImg from "@/components/ui/FotoImg";
import { formatoFecha, getPosts } from "@/lib/contenido";

export const metadata: Metadata = metaPagina({
  titulo: "Blog de electricidad — Consejos y tips en Carlos Paz",
  descripcion:
    "Blog sobre electricidad domiciliaria y comercial en Carlos Paz y Punilla, Córdoba. Consejos de seguridad eléctrica, mantenimiento y novedades del sector.",
  ruta: "/blog",
});


export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Electricidad en Carlos Paz — Consejos y novedades
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Artículos sobre seguridad eléctrica, mantenimiento, eficiencia energética e instalaciones
            eléctricas en Carlos Paz y la región de Punilla, Córdoba.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                  {post.portada && (
                    <FotoImg
                      foto={post.portada}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {post.categoria}
                    </span>
                    <time className="text-xs text-slate-400">{formatoFecha(post.publicadoAt)}</time>
                  </div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-amber-600 transition-colors">
                      {post.titulo}
                    </Link>
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{post.extracto}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-amber-600 text-sm font-semibold hover:underline"
                  >
                    Leer artículo →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-slate-700 font-medium mb-1">
              ¿Tenés una pregunta sobre electricidad en Carlos Paz?
            </p>
            <p className="text-slate-600 text-sm mb-4">
              Contactanos y te asesoramos sin cargo sobre tu instalación eléctrica.
            </p>
            <Button href="/contacto" variant="secondary">
              Consultar gratis
            </Button>
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
