import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    slug: "como-saber-si-necesito-actualizar-tablero-electrico",
    title: "¿Cómo saber si necesito actualizar mi tablero eléctrico?",
    excerpt:
      "El tablero es el corazón de tu instalación. Te contamos las 7 señales que indican que es hora de actualizarlo antes de que sea un problema serio.",
    category: "Mantenimiento",
    date: "2025-06-01",
    image: "/images/como-saber-si-actualizar-tablero.jpg",
  },
  {
    slug: "seguridad-electrica-hogar-carlos-paz",
    title: "5 consejos de seguridad eléctrica para tu hogar en Carlos Paz",
    excerpt:
      "Los accidentes eléctricos son prevenibles. Seguí estos consejos clave para mantener tu hogar seguro y saber cuándo llamar a un electricista.",
    category: "Seguridad",
    date: "2025-05-15",
    image: "/images/camara-seguridad.jpg",
  },
  {
    slug: "instalacion-electrica-obra-nueva-carlos-paz",
    title: "Guía de instalación eléctrica para obra nueva en Carlos Paz",
    excerpt:
      "Si estás construyendo, esta guía es para vos. Los 7 pasos de la instalación eléctrica desde cero: proyecto, cañerías, tablero y certificado.",
    category: "Instalaciones",
    date: "2025-03-10",
    image: "/images/electricidad-interior.jpg",
  },
];

const categoryColors: Record<string, string> = {
  Mantenimiento: "bg-blue-100 text-blue-700",
  Seguridad: "bg-red-100 text-red-700",
  Instalaciones: "bg-amber-100 text-amber-700",
  "Eficiencia energética": "bg-green-100 text-green-700",
};

export default function BlogPreview() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
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
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                />
              </Link>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {post.category}
                  </span>
                  <time className="text-xs text-slate-400">{post.date}</time>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{post.excerpt}</p>
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
