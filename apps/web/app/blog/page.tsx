import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = {
  title: "Blog de electricidad — Consejos y tips en Carlos Paz",
  description:
    "Blog sobre electricidad domiciliaria y comercial en Carlos Paz y Punilla, Córdoba. Consejos de seguridad eléctrica, mantenimiento y novedades del sector.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    slug: "como-saber-si-necesito-actualizar-tablero-electrico",
    title: "¿Cómo saber si necesito actualizar mi tablero eléctrico?",
    excerpt:
      "El tablero eléctrico es el corazón de tu instalación. Te contamos las señales que indican que es hora de actualizarlo en tu hogar o empresa de Carlos Paz.",
    category: "Mantenimiento",
    image: "/images/como-saber-si-actualizar-tablero.jpg",
    date: "2025-06-01",
  },
  {
    slug: "seguridad-electrica-hogar-carlos-paz",
    title: "5 consejos de seguridad eléctrica para tu hogar en Carlos Paz",
    excerpt:
      "La seguridad eléctrica en el hogar es fundamental. Seguí estos consejos para prevenir accidentes eléctricos en tu vivienda de Carlos Paz y Punilla.",
    category: "Seguridad",
    image: "/images/camara-seguridad.jpg",
    date: "2025-05-15",
  },
  {
    slug: "iluminacion-led-ahorro-energia-punilla",
    title: "Iluminación LED: ahorrá energía en tu hogar o empresa de Punilla",
    excerpt:
      "La iluminación LED puede reducir tu consumo eléctrico hasta un 80%. Descubrí cómo migrar a LED en Carlos Paz y Punilla con nuestra ayuda.",
    category: "Eficiencia energética",
    image: "/images/iluminacion-led-exterior.jpg",
    date: "2025-04-20",
  },
  {
    slug: "instalacion-electrica-obra-nueva-carlos-paz",
    title: "Guía de instalación eléctrica para obra nueva en Carlos Paz",
    excerpt:
      "Si estás construyendo en Carlos Paz o Punilla, conocé los pasos para planificar la instalación eléctrica de tu vivienda desde cero.",
    category: "Instalaciones",
    image: "/images/nivel-laser-exactitud.jpg",
    date: "2025-03-10",
  },
];

export default function BlogPage() {
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
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <time className="text-xs text-slate-400">{post.date}</time>
                  </div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-amber-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
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
