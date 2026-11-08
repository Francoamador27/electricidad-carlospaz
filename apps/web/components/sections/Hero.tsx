import BotonesContacto from "@/components/ui/BotonesContacto";
import FotoFranco from "@/components/ui/FotoFranco";
import { BENEFICIOS } from "@/components/sections/LandingServicio";
import { MENSAJE_WHATSAPP } from "@voltis/shared/negocio";

// El H1 y los botones se ven con el primer pintado, sin esperar animaciones ni imágenes:
// son el contenido principal en mobile. La foto tiene su tamaño reservado (sin layout shift).
export default function Hero() {
  return (
    <section
      className="relative bg-ink text-white overflow-hidden"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 98.5%, 0 100%)" }}
    >
      {/* PCB dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #C4762A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.035,
        }}
      />

      {/* El blur animado es caro de pintar: solo en desktop. */}
      <div
        className="hidden lg:block absolute left-[10%] top-[30%] w-[520px] h-[520px] rounded-full bg-copper blur-[130px] pointer-events-none"
        style={{ animation: "volt-drift 14s ease-in-out infinite" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-14 md:py-24 grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-center">
        <div>
          <p className="font-display text-copper text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Carlos Paz · Punilla · Córdoba
          </p>

          <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-4">
            Electricista en Carlos Paz para casas y comercios
          </h1>

          <p className="text-muted text-base md:text-lg leading-relaxed mb-6 max-w-[560px]">
            Arreglos, agregados e instalaciones: tomacorrientes, bocas de luz, ventiladores de techo,
            tableros y fallas. Respondo en el día por WhatsApp.
          </p>

          <BotonesContacto mensaje={MENSAJE_WHATSAPP} className="mb-8" />

          <ul className="grid sm:grid-cols-3 gap-3 pt-6 border-t border-dark-border text-sm font-medium">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-copper" aria-hidden="true">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex lg:block items-center gap-4">
          <FotoFranco
            prioridad
            sizes="(min-width: 1024px) 420px, 56px"
            className="w-14 h-14 shrink-0 rounded-full text-xl lg:w-full lg:h-auto lg:aspect-[4/5] lg:rounded lg:text-8xl" />
          <p className="text-sm text-muted lg:mt-3">
            <strong className="text-white">Soy Franco.</strong> Te atiendo yo, de la consulta al trabajo terminado.
          </p>
        </div>
      </div>
    </section>
  );
}
