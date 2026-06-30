export default function SeoText() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Electricistas en Carlos Paz y el Valle de Punilla — Voltis
        </h2>

        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            <strong>Voltis</strong> es una empresa de electricidad matriculada con más de 10 años de
            trayectoria en Carlos Paz y la región de Punilla, Córdoba, Argentina. Brindamos
            servicios eléctricos profesionales para hogares, comercios, industrias y hoteles en
            toda la zona serrana.
          </p>

          <p>
            Nuestro equipo de <strong>electricistas matriculados</strong> está habilitado para
            realizar todo tipo de trabajos eléctricos: desde una instalación eléctrica domiciliaria
            completa para una obra nueva en Carlos Paz, hasta la actualización de tableros eléctricos
            con disyuntores termomagnéticos y diferenciales en Cosquín, La Falda, Valle Hermoso o
            La Cumbre.
          </p>

          <p>
            Las <strong>instalaciones eléctricas en Argentina</strong> deben cumplir con la normativa
            AEA 90364 y ser ejecutadas por profesionales habilitados. En Voltis trabajamos en regla,
            con materiales certificados y entregamos el certificado técnico necesario para tramitar
            habilitaciones municipales en Carlos Paz y la región de Punilla.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 mb-3">
                Servicios eléctricos domiciliarios en Carlos Paz
              </h3>
              <ul className="space-y-1.5 text-sm">
                {[
                  "Instalación eléctrica para obra nueva",
                  "Ampliaciones y reformas eléctricas",
                  "Tableros eléctricos modernos",
                  "Puesta a tierra certificada",
                  "Bocas de luz y tomacorrientes",
                  "Reparaciones y urgencias 24/7",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="text-amber-500 font-bold shrink-0">✓</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 mb-3">
                Electricistas para empresas en Punilla
              </h3>
              <ul className="space-y-1.5 text-sm">
                {[
                  "Instalaciones comerciales e industriales",
                  "Tableros trifásicos y de alta potencia",
                  "Certificados para habilitaciones municipales",
                  "Mantenimiento preventivo programado",
                  "Iluminación LED eficiente",
                  "Urgencias eléctricas comerciales",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="text-amber-500 font-bold shrink-0">✓</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p>
            Si estás buscando un <strong>electricista en Carlos Paz</strong> de confianza, con
            matrícula, garantía y precio justo, Voltis es tu opción. Atendemos Carlos Paz, Valle
            Hermoso, Cosquín, La Falda, La Cumbre, Icho Cruz, Tanti, Bialet Massé, Santa María de
            Punilla y todas las localidades del Valle de Punilla, Córdoba.
          </p>

          <p>
            Todos nuestros <strong>trabajos eléctricos incluyen garantía</strong>. Para urgencias eléctricas en Carlos Paz y Punilla,
            atendemos las 24 horas los 7 días de la semana. Llamanos al{" "}
            <a href="tel:+5493513873029" className="text-amber-600 font-semibold hover:underline">
              (351) 387-3029
            </a>{" "}
            o escribinos por{" "}
            <a
              href="https://wa.me/5493513873029"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 font-semibold hover:underline"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
