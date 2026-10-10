"use client";

import { useEffect, useRef } from "react";

// Marca el elemento con `data-visible` la primera vez que entra en pantalla. La animación
// la hace el CSS (`.volt-reveal` en globals.css), así no hace falta una librería de animación.
export function useRevelar<T extends HTMLElement>(alMostrar?: (el: T) => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    alMostrar?.(el);
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.dataset.visible = "";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -72px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
