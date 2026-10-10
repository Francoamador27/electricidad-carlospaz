import Link from "next/link";
import FotoImg from "@/components/ui/FotoImg";
import { formatoFecha, getPosts } from "@/lib/contenido";


const categoryColors: Record<string, string> = {
  Mantenimiento: "bg-blue-100 text-blue-700",
  Seguridad: "bg-red-100 text-red-700",
  Instalaciones: "bg-amber-100 text-amber-700",
  "Eficiencia energética": "bg-green-100 text-green-700",
};

export default async function BlogPreview() {
  const posts = (await getPosts()).slice(0, 3);
  if (!posts.length) return null;

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-700 font-semibold text-sm uppercase tracking-wide">
            Blog eléctrico
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Consejos de electricidad para Carlos Paz
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Información útil sobre seguridad eléctrica, mantenimiento e instalaciones para hogares
            y empresas de la región de Punilla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                {post.portada && (
                  <FotoImg
                    foto={post.portada}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                )}
              </Link>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.categoria ?? ""] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {post.categoria}
                  </span>
                  <time className="text-xs text-slate-500">{formatoFecha(post.publicadoAt)}</time>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-amber-700 transition-colors"
                  >
                    {post.titulo}
                  </Link>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{post.extracto}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-amber-700 text-sm font-semibold hover:underline"
                >
                  Leer artículo →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Ver todos los artículos →
          </Link>
        </div>
      </div>
    </section>
  );
}
