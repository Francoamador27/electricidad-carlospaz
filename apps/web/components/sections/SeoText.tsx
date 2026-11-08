import Link from "next/link";
import { LINK_TELEFONO, NEGOCIO, linkWhatsapp } from "@voltis/shared/negocio";

export default function SeoText() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-4 text-warm-gray leading-relaxed">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6">
          Electricista en Carlos Paz y el Valle de Punilla
        </h2>
        <p>
          Soy Franco y con <strong>Voltis</strong> trabajo como electricista para casas y locales
          comerciales en Carlos Paz, Cosquín, La Falda, Valle Hermoso, La Cumbre, Icho Cruz, Cabalango,
          Tanti, Bialet Massé, Santa María de Punilla y el resto del valle.
        </p>
        <p>
          Hago <Link href="/servicios/reparaciones-electricas" className="text-copper-dark font-semibold hover:underline">arreglos y búsqueda de fallas</Link>,{" "}
          <Link href="/servicios/agregados-electricos" className="text-copper-dark font-semibold hover:underline">tomacorrientes, bocas de luz y ventiladores de techo</Link>,{" "}
          <Link href="/servicios/tableros-electricos" className="text-copper-dark font-semibold hover:underline">tableros</Link>,{" "}
          <Link href="/comercios" className="text-copper-dark font-semibold hover:underline">adecuación de locales</Link> e{" "}
          <Link href="/servicios/instalaciones-domiciliarias" className="text-copper-dark font-semibold hover:underline">instalaciones completas</Link>.
          Gestionamos el certificado de instalación apta a través de un electricista matriculado.
        </p>
        <p>
          Cada trabajo tiene <strong>garantía escrita</strong>. Atiendo {NEGOCIO.horarioTexto}. Llamame al{" "}
          <a href={LINK_TELEFONO} className="text-copper-dark font-semibold hover:underline">
            {NEGOCIO.telefonoVisible}
          </a>{" "}
          o escribime por{" "}
          <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="text-copper-dark font-semibold hover:underline">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
