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
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-amber-500 text-slate-900 text-sm py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="font-medium">Carlos Paz y Punilla, Córdoba</span>
          <div className="flex items-center gap-4">
            <a href="tel:+5493513873029" className="font-bold hover:underline">
              ☎ (351) 387-3029
            </a>
            <a
              href="https://wa.me/5493513873029"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4  flex items-center justify-between">
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
          <Link href="/" className="text-slate-900 hover:text-amber-500 transition-colors">
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
              className="text-slate-900 hover:text-amber-500 transition-colors flex items-center gap-1"
            >
              Servicios <span className="text-xs">▾</span>
            </Link>
            {servicesOpen && (
              <div
                className="absolute top-full left-0 mt-1 bg-white text-slate-800 rounded-lg shadow-xl w-64 py-2 z-50 border border-slate-100"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                {services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 text-sm transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/proyectos" className="text-slate-900 hover:text-amber-500 transition-colors">
            Proyectos
          </Link>
          <Link href="/about" className="text-slate-900 hover:text-amber-500 transition-colors">
            Sobre nosotros
          </Link>
          <Link href="/blog" className="text-slate-900 hover:text-amber-500 transition-colors">
            Blog
          </Link>
          <Link href="/contacto" className="text-slate-900 hover:text-amber-500 transition-colors">
            Contacto
          </Link>

          <Link
            href="/presupuesto"
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Solicitar presupuesto
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
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pb-4">
          <Link
            href="/"
            className="block py-3 text-slate-900 font-medium border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <div className="py-2 border-b border-slate-100">
            <Link
              href="/servicios"
              className="block py-1 text-slate-900 font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Servicios
            </Link>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="block py-1 pl-4 text-slate-700 hover:text-amber-500 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {s.label}
              </Link>
            ))}
          </div>
          <Link
            href="/proyectos"
            className="block py-3 text-slate-900 font-medium border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Proyectos
          </Link>
          <Link
            href="/about"
            className="block py-3 text-slate-900 font-medium border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Sobre nosotros
          </Link>
          <Link
            href="/blog"
            className="block py-3 text-slate-900 font-medium border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contacto"
            className="block py-3 text-slate-900 font-medium border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Contacto
          </Link>
          <Link
            href="/presupuesto"
            className="block mt-3 bg-amber-500 text-slate-900 font-bold px-4 py-3 rounded-lg text-center"
            onClick={() => setMenuOpen(false)}
          >
            Solicitar presupuesto
          </Link>
        </div>
      )}
    </header>
  );
}
