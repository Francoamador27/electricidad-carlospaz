import type { Metadata } from "next";
import Image from "next/image";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = {
  title: "Proyectos eléctricos realizados en Carlos Paz y Punilla",
  description:
    "Proyectos de instalaciones eléctricas realizados en Carlos Paz y Punilla, Córdoba. Trabajos en viviendas, locales comerciales, oficinas e industrias.",
  alternates: { canonical: "/proyectos" },
};

const projects = [
  {
    title: "Instalación eléctrica completa — Vivienda unifamiliar",
    category: "Domiciliario",
    location: "Carlos Paz",
    description:
      "Instalación eléctrica completa en casa de tres dormitorios en el centro de Carlos Paz. Tablero nuevo, cañerías empotradas, puesta a tierra y 28 circuitos.",
    image: "/images/cambio%20de%20tecla.png",
  },
  {
    title: "Tablero trifásico industrial — Empresa de maquinaria",
    category: "Industrial",
    location: "Carlos Paz",
    description:
      "Instalación de tablero eléctrico trifásico para empresa de maquinaria en zona industrial de Carlos Paz. Circuitos de alta potencia y protecciones diferenciales.",
    image: "/images/tablero-trifasico.jpg",
  },
  {
    title: "Instalación eléctrica — Local gastronómico",
    category: "Comercial",
    location: "Valle Hermoso",
    description:
      "Instalación eléctrica comercial para restaurante en Valle Hermoso. Circuitos dedicados para cocina industrial, aire acondicionado e iluminación decorativa.",
    image: "/images/electricidad-interior.jpg",
  },
  {
    title: "Iluminación LED exterior — Country en Punilla",
    category: "Iluminación",
    location: "Punilla",
    description:
      "Diseño e instalación de sistema de iluminación LED exterior en country de Punilla. Eficiencia energética y automatización con sensores de movimiento.",
    image: "/images/iluminacion-led-exterior.jpg",
  },
  {
    title: "Actualización de tablero — Edificio de departamentos",
    category: "Domiciliario",
    location: "Carlos Paz",
    description:
      "Reemplazo de tablero eléctrico con fusibles por tablero moderno con disyuntores diferenciales en edificio de 8 departamentos en Carlos Paz.",
    image: "/images/tablero-electrico.png",
  },
  {
    title: "Instalación eléctrica — Oficina corporativa",
    category: "Comercial",
    location: "Cosquín",
    description:
      "Instalación eléctrica para oficina corporativa en Cosquín. Red eléctrica, piso técnico, UPS y red de datos integrada.",
    image: "/images/smart-home.jpg",
  },
];

const categories = ["Todos", "Domiciliario", "Comercial", "Industrial", "Iluminación"];

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Proyectos realizados
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Trabajos eléctricos en Carlos Paz y Punilla
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Algunos de los proyectos eléctricos que realizamos en Carlos Paz, Punilla y la región
            de Córdoba. Instalaciones domiciliarias, comerciales, industriales y más.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category filter — visual only, to be wired with JS if needed */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  cat === "Todos"
                    ? "bg-amber-500 text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-xs text-slate-400">📍 {project.location}</span>
                  </div>
                  <h2 className="font-bold text-slate-900 mb-2">{project.title}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to add more projects */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            ¿Querés ver tu proyecto eléctrico acá?
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            Contactanos y cotizamos tu instalación eléctrica en Carlos Paz y Punilla sin cargo.
          </p>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
