import type { Metadata } from "next";
import PresupuestoForm from "@/components/forms/PresupuestoForm";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pedir presupuesto eléctrico en Carlos Paz",
  description:
    "Solicitá tu presupuesto sin cargo para instalaciones, tableros, reparaciones o mantenimiento eléctrico en Carlos Paz y Punilla.",
  alternates: { canonical: "/presupuesto" },
};

export default function PresupuestoPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Presupuesto", url: "/presupuesto" }]} />
      <PresupuestoForm />
    </>
  );
}
