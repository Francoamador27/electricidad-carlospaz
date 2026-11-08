import BotonesContacto from "@/components/ui/BotonesContacto";
import type { Pregunta } from "@/lib/servicios";

export const BENEFICIOS = [
  "Respuesta en el día",
  "Trabajo con garantía escrita",
  "Presupuesto sin cargo por WhatsApp",
];

type Props = {
  etiqueta: string;
  h1: string;
  intro: string;
  mensaje: string;
  incluye: string[];
  detalleTitulo: string;
  detalle: { titulo: string; texto: string }[];
  faq?: Pregunta[];
  cierre: string;
};

// Plantilla de las páginas de destino: H1 + CTA sin hacer scroll, qué incluye y CTA final.
export default function LandingServicio({
  etiqueta,
  h1,
  intro,
  mensaje,
  incluye,
  detalleTitulo,
  detalle,
  faq = [],
  cierre,
}: Props) {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-20 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-center">
          <div>
            <p className="font-display text-copper text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              {etiqueta}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">{h1}</h1>
            <p className="text-muted text-base md:text-lg leading-relaxed mb-6">{intro}</p>
            <BotonesContacto mensaje={mensaje} />
          </div>

          <div className="border border-dark-border rounded p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Qué incluye</h2>
            <ul className="space-y-3">
              {incluye.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span className="text-copper font-bold shrink-0" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-parchment border-b border-warm-border">
        <ul className="max-w-7xl mx-auto px-6 md:px-8 py-5 grid sm:grid-cols-3 gap-3 text-sm font-semibold text-ink">
          {BENEFICIOS.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-copper-dark" aria-hidden="true">
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8">{detalleTitulo}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {detalle.map((d) => (
              <div key={d.titulo} className="border border-warm-border rounded p-6">
                <h3 className="font-display font-semibold text-ink mb-2">{d.titulo}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {faq.length > 0 && (
        <section className="py-14 md:py-20 bg-parchment">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8">
              Preguntas frecuentes
            </h2>
            <div className="space-y-3">
              {faq.map((item) => (
                <details key={item.q} className="bg-white border border-warm-border rounded p-5">
                  <summary className="font-semibold text-ink cursor-pointer">{item.q}</summary>
                  <p className="mt-3 text-warm-gray text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-ink text-white py-14">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Hablemos</h2>
          <p className="text-muted mb-7">{cierre}</p>
          <BotonesContacto mensaje={mensaje} className="justify-center" />
        </div>
      </section>
    </>
  );
}
