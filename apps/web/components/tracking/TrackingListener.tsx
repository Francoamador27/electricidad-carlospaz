"use client";

import { useEffect } from "react";
import { capturarAtribucion, registrarClic, tipoDeLink } from "@/lib/tracking";

// Un único listener para todos los links a WhatsApp y teléfono del sitio.
export default function TrackingListener() {
  useEffect(() => {
    capturarAtribucion();

    function alClic(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const tipo = tipoDeLink(link.getAttribute("href") ?? "");
      if (tipo) registrarClic(tipo);
    }

    document.addEventListener("click", alClic, { capture: true });
    return () => document.removeEventListener("click", alClic, { capture: true });
  }, []);

  return null;
}
