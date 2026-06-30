import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Instalación eléctrica completa — Vivienda unifamiliar",
    category: "Domiciliario",
    location: "Villa Carlos Paz",
    description:
      "Instalación eléctrica completa para vivienda de 3 dormitorios: tablero nuevo con diferencial, 28 circuitos, puesta a tierra y certificación.",
    image: "/images/cambio%20de%20tecla.png",
  },
  {
    title: "Tablero trifásico — Local gastronómico",
    category: "Comercial",
    location: "Valle Hermoso",
    description:
      "Tablero trifásico con protecciones industriales para restaurante. Circuitos dedicados para cocina, climatización e iluminación decorativa.",
    image: "/images/tablero-trifasico.jpg",
  },
  {
    title: "Iluminación LED exterior — Country en Punilla",
    category: "Iluminación",
    location: "Punilla",
    description:
      "Diseño e instalación de sistema de iluminación LED exterior con sensores de movimiento y eficiencia energética máxima.",
    image: "/images/iluminacion-led-exterior.jpg",
  },
];

const categoryColors: Record<string, string> = {
  Domiciliario: "bg-blue-100 text-blue-700",
  Comercial: "bg-green-100 text-green-700",
  Industrial: "bg-purple-100 text-purple-700",
  Iluminación: "bg-amber-100 text-amber-700",
};

export default function FeaturedProjects() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wide">
            Trabajos realizados
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Proyectos eléctricos en Carlos Paz y Punilla
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Conocé algunos de los trabajos que realizamos en la región. Instalaciones domiciliarias,
            comerciales e industriales con garantía en toda la zona de Punilla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div
              key={p.title}
              className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[p.category] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {p.category}
                  </span>
                  <span className="text-xs text-slate-400">📍 {p.location}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Ver todos los proyectos →
          </Link>
        </div>
      </div>
    </section>
  );
}
