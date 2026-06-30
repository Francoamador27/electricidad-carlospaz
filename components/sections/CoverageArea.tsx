const zones = [
  { name: "Villa Carlos Paz", tag: "Principal" },
  { name: "Valle Hermoso", tag: "" },
  { name: "Cosquín", tag: "" },
  { name: "La Falda", tag: "" },
  { name: "La Cumbre", tag: "" },
  { name: "Icho Cruz", tag: "" },
  { name: "Tanti", tag: "" },
  { name: "San Antonio de Arredondo", tag: "" },
  { name: "Cabalango", tag: "" },
  { name: "Cuesta Blanca", tag: "" },
  { name: "Santa María de Punilla", tag: "" },
  { name: "Bialet Massé", tag: "" },
];

export default function CoverageArea() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Zona de cobertura
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Atendemos todo el Valle de Punilla
          </h2>
          <p className="text-slate-300 mt-3 max-w-2xl mx-auto">
            Nuestros electricistas matriculados se desplazan a toda la región de Punilla,
            Córdoba. Si estás en la zona, llegamos a tu domicilio o empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108962.4227165798!2d-64.58213829262995!3d-31.412040083187616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d6640d6777c71%3A0x75c24ab6cb121bed!2sVilla%20Carlos%20Paz%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses-419!2sit!4v1782660348956!5m2!1ses-419!2sit"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Zona de cobertura Voltis — Valle de Punilla, Córdoba"
            />
          </div>

          {/* Zones list */}
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-6">
              Localidades donde trabajamos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {zones.map((z) => (
                <div key={z.name} className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm">✓</span>
                  <span className="text-slate-200 text-sm">{z.name}</span>
                  {z.tag && (
                    <span className="text-xs bg-amber-500 text-slate-900 font-bold px-1.5 py-0.5 rounded">
                      {z.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed">
                ¿No ves tu localidad en la lista?{" "}
                <strong className="text-white">Consultanos igual.</strong> Atendemos consultas en
                toda la región de Córdoba. Para urgencias fuera de la zona principal, coordinamos
                según disponibilidad.
              </p>
              <a
                href="tel:+5493513873029"
                className="inline-flex items-center gap-2 mt-4 text-amber-400 font-bold text-sm hover:underline"
              >
                ☎ Consultar cobertura — (351) 387-3029
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
