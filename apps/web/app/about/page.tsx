import type { Metadata } from "next";
import Image from "next/image";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Button from "@/components/ui/Button";
import ContactBanner from "@/components/sections/ContactBanner";

export const metadata: Metadata = {
  title: "Sobre nosotros — Electricistas en Carlos Paz",
  description:
    "Conocé nuestro equipo de electricistas matriculados en Carlos Paz y Punilla, Córdoba. Más de 10 años de experiencia en instalaciones, mantenimiento y reparaciones eléctricas.",
  alternates: { canonical: "/about" },
};

const team = [
  {
    name: "Nombre del titular",
    role: "Electricista matriculado · Director técnico",
    filename: "equipo-titular.jpg",
    bio: "Electricista matriculado con más de 10 años de experiencia en instalaciones domiciliarias, comerciales e industriales en Carlos Paz y Punilla.",
  },
  {
    name: "Nombre del técnico 2",
    role: "Técnico electricista",
    filename: "equipo-tecnico-2.jpg",
    bio: "Especialista en tableros eléctricos y automatización. Certificado en normas de seguridad eléctrica AEA e IRAM.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-1 shadow-2xl">
              <Image
                src="/logo-voltis.png"
                alt="Voltis Instalaciones Eléctricas"
                width={96}
                height={96}
                className="rounded-xl object-cover"
              />
            </div>
          </div>
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Sobre nosotros
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Voltis — Electricistas en Carlos Paz desde hace más de 10 años
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Somos un equipo de electricistas matriculados con sede en Carlos Paz, Córdoba.
            Brindamos servicios eléctricos de calidad en toda la región de Punilla con compromiso,
            seguridad y garantía en cada trabajo.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Nuestra historia en Carlos Paz
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                Voltis nació hace más de 10 años con el objetivo de brindar servicios
                eléctricos confiables y accesibles en Carlos Paz y la región de Punilla, Córdoba.
                Empezamos atendiendo hogares del centro de Carlos Paz y fuimos creciendo hasta
                cubrir toda la región.
              </p>
              <p>
                Hoy somos un equipo de electricistas matriculados que atiende instalaciones
                domiciliarias, comerciales e industriales en Carlos Paz, Valle Hermoso, Cosquín,
                La Falda, La Cumbre y todas las localidades de Punilla.
              </p>
              <p>
                Nuestro diferencial es el compromiso con la seguridad eléctrica y la satisfacción
                del cliente. No terminamos un trabajo hasta que el cliente esté conforme y su
                instalación funcione perfectamente.
              </p>
            </div>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src="/images/reparando-espalda.jpg"
              alt="Equipo Voltis trabajando en Carlos Paz"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🛡", title: "Seguridad primero", desc: "Trabajamos respetando las normas de seguridad eléctrica vigentes en Argentina. La seguridad de tu familia y empresa siempre es lo primero." },
              { icon: "✅", title: "Calidad garantizada", desc: "Todos nuestros trabajos incluyen garantía. Usamos materiales de primera calidad y seguimos las mejores prácticas del oficio." },
              { icon: "🤝", title: "Trato honesto", desc: "Brindamos presupuestos claros y detallados, sin costos ocultos. Queremos ser tu electricista de confianza en Carlos Paz para siempre." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Nuestro equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                {/* Team member photo */}
                <ImagePlaceholder
                  label={`Foto de ${member.name}`}
                  filename={member.filename}
                  aspectRatio="square"
                  className="max-w-48 mx-auto mb-4"
                />
                {/* Replace with:
                <Image src={`/images/${member.filename}`} alt={member.name} width={200} height={200} className="rounded-full mx-auto mb-4 object-cover" />
                */}
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-amber-600 text-sm mb-2">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
