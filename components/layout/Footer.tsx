import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink-deep text-muted mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="bg-white rounded-lg p-0.5">
              <Image
                src="/logo-voltis.png"
                alt="Voltis Instalaciones Eléctricas"
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            </div>
            <span className="font-display text-parchment font-bold text-lg">Voltis</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Electricistas matriculados en Carlos Paz y la región de Punilla, Córdoba. Instalaciones,
            mantenimiento y reparaciones eléctricas con garantía.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-display text-parchment font-semibold mb-3">Servicios</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/servicios/instalaciones-domiciliarias"
                className="hover:text-copper transition-colors"
              >
                Instalaciones domiciliarias
              </Link>
            </li>
            <li>
              <Link
                href="/servicios/instalaciones-empresariales"
                className="hover:text-copper transition-colors"
              >
                Instalaciones para empresas
              </Link>
            </li>
            <li>
              <Link
                href="/servicios/mantenimiento-electricidad"
                className="hover:text-copper transition-colors"
              >
                Mantenimiento eléctrico
              </Link>
            </li>
            <li>
              <Link
                href="/servicios/reparaciones-electricas"
                className="hover:text-copper transition-colors"
              >
                Reparaciones eléctricas
              </Link>
            </li>
            <li>
              <Link
                href="/servicios/tableros-electricos"
                className="hover:text-copper transition-colors"
              >
                Tableros eléctricos
              </Link>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-display text-parchment font-semibold mb-3">Empresa</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-copper transition-colors">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link href="/proyectos" className="hover:text-copper transition-colors">
                Proyectos realizados
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-copper transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-copper transition-colors">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/presupuesto" className="hover:text-copper transition-colors">
                Solicitar presupuesto
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-parchment font-semibold mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="tel:+5493513873029" className="hover:text-copper transition-colors">
                ☎ (351) 387-3029
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5493513873029"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper transition-colors"
              >
                WhatsApp: +54 9 351 387-3029
              </a>
            </li>
            <li>
              <a
                href="mailto:francohugoamador25@gmail.com"
                className="hover:text-copper transition-colors"
              >
                francohugoamador25@gmail.com
              </a>
            </li>
            <li className="pt-1">
              <span className="text-slate-400">Horario de atención:</span>
              <br />
              Lun–Vie: 8:00–18:00
              <br />
              Sáb: 8:00–13:00
              <br />
              <span className="text-copper font-medium">Urgencias: 24/7</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dark-border py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#4A4540]">
          <p>© {new Date().getFullYear()} Voltis — Todos los derechos reservados.</p>
          <p>Electricistas en Carlos Paz, Punilla y Córdoba, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
