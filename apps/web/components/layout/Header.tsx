"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

const services = [
  { label: "Instalaciones domiciliarias", href: "/servicios/instalaciones-domiciliarias" },
  { label: "Instalaciones para empresas", href: "/servicios/instalaciones-empresariales" },
  { label: "Mantenimiento eléctrico", href: "/servicios/mantenimiento-electricidad" },
  { label: "Reparaciones eléctricas", href: "/servicios/reparaciones-electricas" },
  { label: "Tableros eléctricos", href: "/servicios/tableros-electricos" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleServicesEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }

  function handleServicesLeave() {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 350);
  }

  return (
    <header className="bg-parchment sticky top-0 z-50 border-b border-warm-border">
      {/* Top bar */}
      <div className="bg-ink text-[#5A5450] text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
          <span className="tracking-wide">Carlos Paz y Punilla, Córdoba</span>
          <div className="flex items-center gap-5">
            <a href="tel:+5493513873029" className="font-medium text-muted hover:text-copper transition-colors">
              (351) 387-3029
            </a>
            <a
              href="https://wa.me/5493513873029"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted hover:text-copper transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-voltis.png"
            alt="Voltis Instalaciones Eléctricas"
            width={100}
            height={100}
            className="rounded-xl object-cover bg-white"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link href="/" className="font-display text-ink hover:text-copper transition-colors">
            Inicio
          </Link>

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
          >
            <Link
              href="/servicios"
              className="font-display text-ink hover:text-copper transition-colors flex items-center gap-1"
            >
              Servicios <span className="text-xs">▾</span>
            </Link>
            {servicesOpen && (
              <div
                className="absolute top-full left-0 mt-1 bg-white text-ink rounded border border-warm-border shadow-[0_8px_24px_rgba(0,0,0,0.08)] w-64 py-1.5 z-50"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                {services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="font-display block px-4 py-2.5 hover:bg-parchment hover:text-copper text-sm transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/proyectos" className="font-display text-ink hover:text-copper transition-colors">
            Proyectos
          </Link>
          <Link href="/about" className="font-display text-ink hover:text-copper transition-colors">
            Sobre nosotros
          </Link>
          <Link href="/blog" className="font-display text-ink hover:text-copper transition-colors">
            Blog
          </Link>
          <Link href="/contacto" className="font-display text-ink hover:text-copper transition-colors">
            Contacto
          </Link>

          <Link
            href="/presupuesto"
            className="font-display bg-copper hover:bg-copper-light text-white font-semibold px-5 py-2 rounded-sm transition-colors tracking-wide text-xs uppercase"
          >
            Presupuesto
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-900 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-parchment border-t border-warm-border px-6 pb-4">
          <Link
            href="/"
            className="font-display block py-3 text-ink font-medium border-b border-warm-border"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <div className="py-2 border-b border-warm-border">
            <Link
              href="/servicios"
              className="font-display block py-1 text-ink font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Servicios
            </Link>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="font-display block py-1 pl-4 text-warm-gray hover:text-copper text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {s.label}
              </Link>
            ))}
          </div>
          <Link
            href="/proyectos"
            className="font-display block py-3 text-ink font-medium border-b border-warm-border"
            onClick={() => setMenuOpen(false)}
          >
            Proyectos
          </Link>
          <Link
            href="/about"
            className="font-display block py-3 text-ink font-medium border-b border-warm-border"
            onClick={() => setMenuOpen(false)}
          >
            Sobre nosotros
          </Link>
          <Link
            href="/blog"
            className="font-display block py-3 text-ink font-medium border-b border-warm-border"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contacto"
            className="font-display block py-3 text-ink font-medium border-b border-warm-border"
            onClick={() => setMenuOpen(false)}
          >
            Contacto
          </Link>
          <Link
            href="/presupuesto"
            className="font-display block mt-3 bg-copper text-white font-semibold px-4 py-3 rounded-sm text-center tracking-wide text-sm hover:bg-copper-light transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Solicitar presupuesto
          </Link>
        </div>
      )}
    </header>
  );
}
