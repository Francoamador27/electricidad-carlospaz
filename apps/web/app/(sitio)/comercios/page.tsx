import type { Metadata } from "next";
import { MENSAJE_COMERCIOS } from "@voltis/shared/negocio";
import LandingServicio from "@/components/sections/LandingServicio";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { metaPagina } from "@/lib/seo";
import { CERTIFICADO_GESTION } from "@/lib/servicios";

export const metadata: Metadata = metaPagina({
  titulo: "Electricista para locales comerciales en Carlos Paz",
  descripcion:
    "Electricista para tu local en Carlos Paz: adecuación eléctrica, iluminación, tablero y certificado para la habilitación municipal, sin que tengas que cerrar.",
  ruta: "/comercios",
});

export default function ComerciosPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Comercios", url: "/comercios" }]} />
      <LandingServicio
        etiqueta="Comercios"
        h1="Electricista para locales comerciales en Carlos Paz"
        intro="Adecuación eléctrica, iluminación, tablero y certificado para la habilitación municipal. Coordinamos el trabajo para que no tengas que cerrar el local."
        mensaje={MENSAJE_COMERCIOS}
        incluye={[
          "Adecuación eléctrica del local",
          "Iluminación del salón y la vidriera",
          "Tablero con térmicas y disyuntor diferencial",
          "Certificado para la habilitación municipal",
        ]}
        detalleTitulo="Soy Franco y así trabajo en tu local"
        detalle={[
          {
            titulo: "Trabajo coordinado para no cerrar",
            texto: "Organizamos horarios y etapas para que sigas atendiendo mientras avanzo.",
          },
          {
            titulo: "Adecuación del local",
            texto: "Reviso lo que hay y te digo qué hace falta cambiar, sin agregar trabajos de más.",
          },
          {
            titulo: "Iluminación y tablero",
            texto: "Luz pareja para el salón y la vidriera, y un tablero con sus protecciones.",
          },
          {
            titulo: "Certificado para la habilitación",
            texto: `${CERTIFICADO_GESTION}.`,
          },
        ]}
        cierre="Contame qué local tenés y qué te están pidiendo. Te respondo en el día."
      />
    </>
  );
}
