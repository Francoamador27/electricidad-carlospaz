import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium px-3 py-1 rounded-full mb-6">
            <span>⚡</span>
            Electricistas matriculados · Carlos Paz, Córdoba
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Electricista en{" "}
            <span className="text-amber-400">Carlos Paz</span> y Punilla
          </h1>

          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
            Instalaciones domiciliarias, mantenimiento y reparaciones eléctricas en Carlos Paz,
            Punilla y toda la región de Córdoba. Trabajo seguro, rápido y con garantía.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href="/presupuesto" variant="primary" className="text-base px-8 py-4">
              Solicitar presupuesto
            </Button>
            <Button href="/servicios" variant="outline" className="text-base px-8 py-4">
              Ver servicios
            </Button>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-slate-700">
            {[
              { value: "+10 años", label: "de experiencia" },
              { value: "+500", label: "clientes atendidos" },
              { value: "24/7", label: "urgencias" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-amber-400 font-bold text-2xl">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <Image
            src="/images/reparando-espalda.jpg"
            alt="Electricista trabajando en Carlos Paz"
            width={600}
            height={600}
            className="rounded-2xl shadow-2xl object-cover w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
