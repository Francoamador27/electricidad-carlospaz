import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactBanner from "@/components/sections/ContactBanner";
import CTAPresupuesto from "@/components/sections/CTAPresupuesto";
import Contenido from "@/components/ui/Contenido";
import FotoImg from "@/components/ui/FotoImg";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { formatoFecha, getPost, getPosts, getServicios, paramsOVacio } from "@/lib/contenido";
import { srcFoto } from "@/lib/fotos";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return paramsOVacio(await getPosts());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return metaPagina({
    titulo: post.seoTitulo ?? post.titulo,
    descripcion: post.seoDescripcion ?? post.extracto,
    ruta: `/blog/${slug}`,
    imagen: post.portada ? { url: srcFoto(post.portada), alt: post.portada.alt } : undefined,
    articulo: { publicado: post.publicadoAt, modificado: post.updatedAt },
    noIndexar: post.estado === "borrador",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const servicio = (await getServicios()).find((s) => s.id === post.servicioId);

  return (
    <>
      <Breadcrumbs
        items={[
          { nombre: "Blog", url: "/blog" },
          { nombre: post.titulo, url: `/blog/${post.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.titulo,
          description: post.extracto,
          datePublished: post.publicadoAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          image: post.portada ? new URL(srcFoto(post.portada), SITE_URL).toString() : undefined,
          inLanguage: "es-AR",
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          author: { "@id": `${SITE_URL}/#organization` },
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />

      <section className="bg-slate-900 text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {post.estado === "borrador" && (
            <p className="mb-4 inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
              BORRADOR — solo visible en desarrollo
            </p>
          )}
          <div className="text-sm text-slate-400 mb-4">
            <Link href="/blog" className="hover:text-amber-400 transition-colors">
              Blog
            </Link>{" "}
            / <span className="text-amber-400">{post.categoria}</span>
          </div>
          {post.categoria && (
            <span className="text-xs font-semibold bg-amber-500 text-slate-900 px-3 py-1 rounded-full uppercase tracking-wide">
              {post.categoria}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4 leading-tight">{post.titulo}</h1>
          <time
            className="text-slate-400 text-sm"
            dateTime={post.publicadoAt?.toISOString()}
          >
            {formatoFecha(post.publicadoAt)}
          </time>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {post.portada && (
            <FotoImg
              foto={post.portada}
              prioridad
              sizes="(min-width: 896px) 864px, 100vw"
              className="w-full h-auto rounded-xl mb-10"
            />
          )}
          <article>
            <Contenido texto={post.contenido} />
          </article>
          {servicio && (
            <p className="mt-10 text-slate-700">
              ¿Necesitás ayuda con esto?{" "}
              <Link
                href={`/servicios/${servicio.slug}`}
                className="text-amber-600 font-semibold hover:underline"
              >
                Conocé nuestro servicio de {servicio.nombre.toLowerCase()} →
              </Link>
            </p>
          )}
        </div>
      </section>

      <CTAPresupuesto />

      <section className="py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-bold text-slate-900 text-lg mb-4">
            Más artículos sobre electricidad en Carlos Paz
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-600 hover:underline font-medium"
          >
            ← Ver todos los artículos del blog
          </Link>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
