import Link from "next/link";
import Image from "next/image";
import { LINK_TELEFONO, NEGOCIO, SERVICIOS, linkWhatsapp } from "@voltis/shared/negocio";
import BotonResena from "@/components/ui/BotonResena";

export default function Footer() {
  return (
    <footer className="bg-ink-deep text-muted mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="bg-white rounded-lg p-0.5">
              <Image
                src="/logo-voltis-200.webp"
                alt="Voltis Instalaciones Eléctricas"
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            </div>
            <span className="font-display text-parchment font-bold text-lg">Voltis</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Soy Franco, electricista en Carlos Paz y Punilla para casas y comercios. Trabajo con garantía escrita.
          </p>
          <BotonResena className="mt-4" />
        </div>

        {/* Services */}
        <div>
          <h3 className="font-display text-parchment font-semibold mb-3">Servicios</h3>
          <ul className="space-y-2 text-sm">
            {SERVICIOS.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="hover:text-copper transition-colors">
                  {s.corto}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/certificado-instalacion-electrica-apta" className="hover:text-copper transition-colors">
                Certificado de instalación apta
              </Link>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-display text-parchment font-semibold mb-3">Voltis</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-copper transition-colors">
                Quién soy
              </Link>
            </li>
            <li>
              <Link href="/comercios" className="hover:text-copper transition-colors">
                Comercios
              </Link>
            </li>
            <li>
              <Link href="/proyectos" className="hover:text-copper transition-colors">
                Trabajos de referencia
              </Link>
            </li>
            <li>
              <Link href="/zonas" className="hover:text-copper transition-colors">
                Zonas de cobertura
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidad" className="hover:text-copper transition-colors">
                Política de privacidad
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
              <a href={LINK_TELEFONO} className="hover:text-copper transition-colors">
                ☎ {NEGOCIO.telefonoVisible}
              </a>
            </li>
            <li>
              <a
                href={linkWhatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper transition-colors"
              >
                WhatsApp: {NEGOCIO.telefonoInternacional}
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
              Lun–Vie: 8:00–19:00
              <br />
              Sáb: 8:00–13:00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dark-border py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} Voltis — Todos los derechos reservados.</p>
          <p>Electricista en Carlos Paz, Punilla y Córdoba, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
