import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { NEGOCIO, linkWhatsapp } from "@voltis/shared/negocio";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = metaPagina({
  titulo: "Política de privacidad",
  descripcion:
    "Cómo usa Voltis los datos que dejás en el formulario y las cookies del sitio.",
  ruta: "/politica-de-privacidad",
});

// TODO(Franco): completar razón social / CUIT y email de contacto antes de publicar.
const ACTUALIZADA = "8 de octubre de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Política de privacidad", url: "/politica-de-privacidad" }]} />
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Política de privacidad</h1>
          <p className="text-sm text-slate-500">Última actualización: {ACTUALIZADA}</p>

          <h2>Quiénes somos</h2>
          <p>
            Este sitio pertenece a {NEGOCIO.nombre}, servicio de electricidad con base en{" "}
            {NEGOCIO.localidadBase}, Córdoba, Argentina. Somos responsables de los datos que nos
            dejás a través del sitio.
          </p>

          <h2>Qué datos juntamos y para qué</h2>
          <ul>
            <li>
              <strong>Formularios de contacto y presupuesto:</strong> nombre, teléfono, email
              (opcional), localidad, tipo de servicio y el detalle del trabajo. Los usamos solo
              para responderte y preparar tu presupuesto.
            </li>
            <li>
              <strong>Origen de la visita:</strong> si llegaste desde un anuncio o un link con
              parámetros de campaña (por ejemplo, utm_source o gclid), guardamos esos datos junto
              con tu consulta para saber qué canales funcionan.
            </li>
            <li>
              <strong>Clics en WhatsApp y teléfono:</strong> registramos de forma anónima en qué
              página se hizo el clic, sin datos personales.
            </li>
          </ul>
          <p>No vendemos ni compartimos tus datos con terceros para fines comerciales.</p>

          <h2>Cookies y medición</h2>
          <p>
            Usamos Google Tag Manager y Google Analytics para medir cómo se usa el sitio, y
            podemos usar Google Ads para medir la efectividad de nuestros anuncios. Estas
            herramientas usan cookies. Podés bloquearlas o borrarlas desde la configuración de tu
            navegador; el sitio sigue funcionando igual.
          </p>
          <p>
            El formulario está protegido con Cloudflare Turnstile, que verifica que quien lo envía
            sea una persona.
          </p>

          <h2>Cuánto tiempo guardamos los datos</h2>
          <p>
            Guardamos las consultas mientras sean necesarias para atenderte y hacer el seguimiento
            del trabajo. Podés pedirnos que las borremos en cualquier momento.
          </p>

          <h2>Tus derechos</h2>
          <p>
            Según la Ley 25.326 de Protección de Datos Personales, podés pedirnos acceso,
            rectificación, actualización o supresión de tus datos. Escribinos por{" "}
            <a href={linkWhatsapp()} className="text-amber-700 hover:underline">WhatsApp</a> al{" "}
            {NEGOCIO.telefonoInternacional}.
          </p>
          <p>
            La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de
            la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan
            quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes
            en materia de protección de datos personales.
          </p>
        </div>
      </section>
    </>
  );
}
