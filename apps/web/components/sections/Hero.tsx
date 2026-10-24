import type { CSSProperties } from "react";
import Link from "next/link";
import { LINK_TELEFONO, linkWhatsapp } from "@voltis/shared/negocio";

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
              Electricista domiciliario
            </span>
            <span className="volt-slide block text-copper" style={retraso(0.22)}>
              en Carlos Paz,
            </span>
            <span className="volt-slide block" style={retraso(0.34)}>
              Valle de Punilla.
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
            <a
              href={linkWhatsapp("Hola, necesito un electricista")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${boton} font-display inline-flex items-center gap-2 px-7 py-3.5 bg-green-700 text-white font-semibold text-sm tracking-wide hover:bg-green-800 rounded-sm shadow-[0_0_20px_rgba(21,128,61,0.25)]`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={LINK_TELEFONO}
              className={`${boton} font-display inline-flex items-center gap-2 px-7 py-3.5 bg-copper-dark text-white font-semibold text-sm tracking-wide hover:bg-copper-darker rounded-sm shadow-[0_0_20px_rgba(196,118,42,0.25)]`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
              Llamar
            </a>
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
