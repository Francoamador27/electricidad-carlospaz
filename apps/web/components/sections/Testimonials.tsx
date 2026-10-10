import AnimateIn from "@/components/ui/AnimateIn";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { linkWhatsapp } from "@voltis/shared/negocio";
import { getResenas } from "@/lib/contenido";

// Solo reseñas reales cargadas desde el panel. Sin reseñas publicadas, la sección no se muestra.
export default async function Testimonials() {
  const resenas = await getResenas();
  if (!resenas.length) return null;

  return (
    <section className="py-20 md:py-28 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <AnimateIn className="mb-12">
          <span className="font-display text-copper-dark text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
            Clientes
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Más de 500 clientes satisfechos<br className="hidden sm:block" />en Punilla.
          </h2>
        </AnimateIn>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resenas.map((t) => (
            <StaggerItem key={t.id} className="flex flex-col">
              <div className="group flex flex-col flex-1 bg-white border border-warm-border rounded p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
                <div className="flex gap-0.5 mb-4" aria-label={`${t.estrellas} de 5 estrellas`}>
                  {Array.from({ length: t.estrellas }).map((_, i) => (
                    <span key={i} className="text-copper-dark text-base">★</span>
                  ))}
                </div>

                <p className="text-[#5A5450] text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.texto}&rdquo;
                </p>

                <div className="mt-5 pt-4 border-t border-warm-border">
                  <p className="font-display font-semibold text-ink text-sm">{t.nombre}</p>
                  {t.localidad && <p className="text-warm-gray text-xs mt-0.5">{t.localidad}</p>}
                  {t.servicio && (
                    <span className="inline-block mt-2 text-xs border border-warm-border text-warm-gray px-2 py-0.5 rounded-sm font-medium">
                      {t.servicio}
                    </span>
                  )}
                  {t.estado === "borrador" && (
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">BORRADOR</span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <AnimateIn delay={0.1} className="mt-10">
          <p className="text-warm-gray text-sm">
            ¿Trabajaste con nosotros?{" "}
            <a
              href={linkWhatsapp("Hola, quiero dejar mi opinión sobre el servicio")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-copper-dark font-semibold hover:underline"
            >
              Dejanos tu reseña por WhatsApp →
            </a>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
