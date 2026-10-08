"use client";

import { useEffect } from "react";
import { track } from "@/lib/tracking";

export default function VerProyecto(props: { proyecto: string; servicio?: string; zona?: string }) {
  const { proyecto, servicio, zona } = props;
  useEffect(() => {
    track("ver_proyecto", { proyecto, servicio, zona });
  }, [proyecto, servicio, zona]);
  return null;
}
