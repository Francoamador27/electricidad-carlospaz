import type { CSSProperties } from "react";
import Link from "next/link";

// Animaciones de entrada en CSS (globals.css): se ven con el primer pintado, sin esperar a
// que cargue el JS. El título y el párrafo usan `volt-slide` (sin opacidad) porque son el
// elemento LCP en mobile: si arrancan invisibles, el LCP espera a que termine la animación.
const retraso = (s: number) => ({ "--volt-delay": `${s}s` }) as CSSProperties;

const PIXEL_VACIO = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const boton = "transition hover:scale-[1.03] active:scale-[0.97]";

export default function Hero() {
  return (
    <section
      className="relative bg-ink text-white overflow-hidden"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 96.5%, 0 100%)" }}
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

      {/* Ambient copper orb — continuous drift */}
      <div
        className="absolute left-[10%] top-[30%] w-[520px] h-[520px] rounded-full bg-copper blur-[130px] pointer-events-none"
        style={{ animation: "volt-drift 14s ease-in-out infinite" }}
        aria-hidden="true"
      />

      {/* Photo panel — solo en desktop. Con <picture> + media, el celular no descarga la foto
          (un <img> oculto con CSS se descarga igual). */}
      <div className="hidden lg:block absolute right-0 inset-y-0 w-[42%]">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/images/opt/reparando-espalda-768.webp" />
          <img
            src={PIXEL_VACIO}
            alt="Electricista trabajando en Carlos Paz"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-ink to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32 lg:py-40 pb-32 md:pb-40 lg:pb-48">
        <div className="max-w-[660px]">
          <p className="volt-rise font-display text-copper text-xs font-semibold tracking-[0.25em] uppercase mb-8">
            Carlos Paz · Punilla · Córdoba
          </p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-[84px] font-bold leading-[0.92] tracking-tight mb-6">
            <span className="volt-slide block" style={retraso(0.1)}>
              Electricistas
            </span>
            <span className="volt-slide block text-copper" style={retraso(0.22)}>
              en Carlos Paz
            </span>
            <span className="volt-slide block" style={retraso(0.34)}>
              y Punilla.
            </span>
          </h1>

          {/* Copper rule — grows in */}
          <div
            className="h-[3px] w-16 bg-copper mb-8"
            style={{ animation: "volt-line-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both" }}
          />

          <p
            className="volt-slide text-muted text-lg leading-relaxed mb-10 max-w-[500px]"
            style={retraso(0.55)}
          >
            Instalaciones domiciliarias, mantenimiento y reparaciones eléctricas en Carlos Paz y Punilla. Trabajo seguro, rápido y con garantía.
          </p>

          <div className="volt-rise flex flex-wrap gap-3 mb-16" style={retraso(0.65)}>
            <Link
              href="/presupuesto"
              className={`${boton} font-display inline-flex items-center px-7 py-3.5 bg-copper-dark text-white font-semibold text-sm tracking-wide hover:bg-copper-darker rounded-sm shadow-[0_0_20px_rgba(196,118,42,0.25)]`}
            >
              Solicitar presupuesto
            </Link>
            <Link
              href="/servicios"
              className={`${boton} font-display inline-flex items-center px-7 py-3.5 border border-dark-border text-muted font-semibold text-sm tracking-wide hover:border-copper hover:text-white rounded-sm`}
            >
              Ver servicios
            </Link>
          </div>

          <div
            className="volt-rise flex gap-10 pt-8 border-t border-dark-border"
            style={retraso(0.78)}
          >
            {[
              { value: "+10", label: "años de experiencia" },
              { value: "+500", label: "clientes atendidos" },
              { value: "100%", label: "trabajos con garantía" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-copper font-bold text-2xl">{stat.value}</div>
                <div className="text-muted text-xs tracking-wide uppercase mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
