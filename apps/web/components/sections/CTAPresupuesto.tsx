import Link from "next/link";
import { LINK_TELEFONO, NEGOCIO, linkWhatsapp } from "@voltis/shared";

export default function CTAPresupuesto() {
  return (
    <section className="bg-slate-900 text-white py-14">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          ¿Necesitás un electricista?
        </h2>
        <p className="text-slate-300 text-base md:text-lg mb-2 max-w-2xl mx-auto leading-relaxed">
          No intentes resolver
          una falla por tu cuenta: un error puede causar un incendio o una descarga eléctrica.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Atendemos {NEGOCIO.horarioTexto} en Carlos Paz y todo el Valle de Punilla.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={linkWhatsapp("Hola, necesito un electricista")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg"
          >
            💬 Escribir por WhatsApp
          </a>
          <a
            href={LINK_TELEFONO}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg"
          >
            ☎ {NEGOCIO.telefonoVisible}
          </a>
        </div>
        <p className="mt-6">
          <Link href="/presupuesto" className="text-amber-400 font-semibold hover:underline">
            O pedí tu presupuesto sin cargo →
          </Link>
        </p>
      </div>
    </section>
  );
}
