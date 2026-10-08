import type { Metadata } from "next";
import ContactoForm from "@/components/forms/ContactoForm";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contacto — Electricista en Carlos Paz",
  description:
    "Contactá a Voltis, electricistas matriculados en Carlos Paz y Punilla. WhatsApp, teléfono o formulario: te respondemos a la brevedad.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Contacto", url: "/contacto" }]} />
      <ContactoForm />
    </>
  );
}
