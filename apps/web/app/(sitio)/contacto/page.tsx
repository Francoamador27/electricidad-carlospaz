import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import ContactoForm from "@/components/forms/ContactoForm";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = metaPagina({
  titulo: "Contacto — Electricista en Carlos Paz",
  descripcion:
    "Contactá a Voltis, electricistas en Carlos Paz y Punilla. WhatsApp, teléfono o formulario: te respondemos a la brevedad.",
  ruta: "/contacto",
});

export default function ContactoPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Contacto", url: "/contacto" }]} />
      <ContactoForm />
    </>
  );
}
