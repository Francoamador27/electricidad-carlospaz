import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import PresupuestoForm from "@/components/forms/PresupuestoForm";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = metaPagina({
  titulo: "Pedir presupuesto eléctrico en Carlos Paz",
  descripcion:
    "Solicitá tu presupuesto sin cargo para arreglos, agregados, tableros o instalaciones en casas y comercios de Carlos Paz y Punilla.",
  ruta: "/presupuesto",
});

export default function PresupuestoPage() {
  return (
    <>
      <Breadcrumbs items={[{ nombre: "Presupuesto", url: "/presupuesto" }]} />
      <PresupuestoForm />
    </>
  );
}
