import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import BotonesContacto from "@/components/ui/BotonesContacto";
import BotonResena from "@/components/ui/BotonResena";
import FotoFranco from "@/components/ui/FotoFranco";
import { MENSAJE_WHATSAPP } from "@voltis/shared/negocio";

export const metadata: Metadata = metaPagina({
  titulo: "Quién soy — Franco, electricista en Carlos Paz",
  descripcion:
    "Soy Franco, electricista en Carlos Paz para casas y comercios. Trabajo prolijo, respuesta rápida y garantía escrita en cada trabajo.",
  ruta: "/about",
});

export default function QuienSoyPage() {
  return (
    <section className="bg-parchment py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6 md:px-8 grid md:grid-cols-[320px_1fr] gap-10 items-center">
        <FotoFranco className="w-full max-w-[320px] mx-auto aspect-[4/5] rounded text-8xl" />
        <div>
          <p className="font-display text-copper-dark text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Voltis
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-5">Quién soy</h1>
          <div className="space-y-4 text-warm-gray leading-relaxed mb-8">
            <p>
              Soy Franco, electricista en Carlos Paz. Voltis es mi servicio de electricidad para casas
              y locales comerciales de la ciudad y del Valle de Punilla.
            </p>
            <p>
              Cuando me escribís, te respondo yo y en el día. Te paso un presupuesto claro y, si
              avanzamos, dejo el trabajo prolijo y funcionando.
            </p>
            <p>Cada trabajo tiene garantía escrita: si algo falla por lo que hice, vuelvo a solucionarlo.</p>
          </div>
          <BotonesContacto mensaje={MENSAJE_WHATSAPP} className="mb-5" />
          <BotonResena />
        </div>
      </div>
    </section>
  );
}
