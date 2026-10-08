import Button from "@/components/ui/Button";

export default function ContactBanner() {
  return (
    <section className="bg-amber-500 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          ¿Necesitás un electricista en Carlos Paz?
        </h2>
        <p className="text-slate-800 text-lg max-w-2xl mx-auto mb-8">
          Contactanos y te respondemos a la brevedad para cualquier servicio eléctrico en
          Carlos Paz y Punilla.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/presupuesto" variant="secondary" className="text-base px-8 py-4">
            Solicitar presupuesto
          </Button>
          <a
            href="https://wa.me/5493513873029"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors text-base"
          >
            💬 Escribir por WhatsApp
          </a>
          <a
            href="tel:+5493513873029"
            className="inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-slate-900 hover:text-white transition-colors text-base"
          >
            ☎ Llamar ahora
          </a>
        </div>
      </div>
    </section>
  );
}
