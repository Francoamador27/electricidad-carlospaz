"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const line = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

export default function Hero() {
  return (
    <section
      className="relative bg-ink text-white overflow-hidden"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 96.5%, 0 100%)" }}
    >
      {/* PCB dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #C4762A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.035,
        }}
      />

      {/* Ambient copper orb — continuous drift */}
      <div
        className="absolute left-[10%] top-[30%] w-[520px] h-[520px] rounded-full bg-copper blur-[130px] pointer-events-none"
        style={{ animation: "volt-drift 14s ease-in-out infinite" }}
        aria-hidden="true"
      />

      {/* Photo panel */}
      <div className="hidden lg:block absolute right-0 inset-y-0 w-[42%]">
        <Image
          src="/images/reparando-espalda.jpg"
          alt="Electricista trabajando en Carlos Paz"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-ink to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32 lg:py-40 pb-32 md:pb-40 lg:pb-48">
        <div className="max-w-[660px]">
          <motion.p
            {...line(0)}
            className="font-display text-copper text-xs font-semibold tracking-[0.25em] uppercase mb-8"
          >
            Carlos Paz · Punilla · Córdoba
          </motion.p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-[84px] font-bold leading-[0.92] tracking-tight mb-6">
            <motion.span {...line(0.1)} className="block">
              Electricistas
            </motion.span>
            <motion.span {...line(0.22)} className="block text-copper">
              matriculados
            </motion.span>
            <motion.span {...line(0.34)} className="block">
              en tu zona.
            </motion.span>
          </h1>

          {/* Copper rule — grows in */}
          <motion.div
            className="h-[3px] bg-copper mb-8"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
          />

          <motion.p
            {...line(0.55)}
            className="text-muted text-lg leading-relaxed mb-10 max-w-[500px]"
          >
            Instalaciones domiciliarias, mantenimiento y reparaciones eléctricas en Carlos Paz y Punilla. Trabajo seguro, rápido y con garantía.
          </motion.p>

          <motion.div {...line(0.65)} className="flex flex-wrap gap-3 mb-16">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/presupuesto"
                className="font-display inline-flex items-center px-7 py-3.5 bg-copper text-white font-semibold text-sm tracking-wide hover:bg-copper-light transition-colors rounded-sm shadow-[0_0_20px_rgba(196,118,42,0.25)]"
              >
                Solicitar presupuesto
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/servicios"
                className="font-display inline-flex items-center px-7 py-3.5 border border-dark-border text-muted font-semibold text-sm tracking-wide hover:border-copper hover:text-white transition-colors rounded-sm"
              >
                Ver servicios
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            {...line(0.78)}
            className="flex gap-10 pt-8 border-t border-dark-border"
          >
            {[
              { value: "+10", label: "años de experiencia" },
              { value: "+500", label: "clientes atendidos" },
              { value: "24/7", label: "urgencias" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-copper font-bold text-2xl">{stat.value}</div>
                <div className="text-[#4A4540] text-xs tracking-wide uppercase mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
