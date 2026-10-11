"use client";

// Piezas de interfaz al estilo iOS para el panel: selector segmentado, interruptor y hoja inferior.
import { useEffect, useId, useRef } from "react";

export function Segmentado<T extends string>({
  opciones,
  valor,
  onChange,
  etiqueta,
}: {
  opciones: { valor: T; nombre: string }[];
  valor: T;
  onChange: (v: T) => void;
  etiqueta: string;
}) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="flex rounded-[9px] bg-[var(--ios-relleno)] p-0.5 text-[13px] font-semibold">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={o.valor === valor}
          onClick={() => onChange(o.valor)}
          className={`flex-1 rounded-[7px] px-2 py-1.5 transition-colors ${
            o.valor === valor ? "bg-[var(--ios-tarjeta)] shadow-sm" : "ios-secundario"
          }`}
        >
          {o.nombre}
        </button>
      ))}
    </div>
  );
}

// Interruptor iOS (verde cuando está activo). Es un checkbox real: accesible y con teclado.
export function Interruptor({
  activo,
  onChange,
  etiqueta,
  descripcion,
}: {
  activo: boolean;
  onChange: (v: boolean) => void;
  etiqueta: string;
  descripcion?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="ios-fila cursor-pointer">
      <span className="flex-1">
        <span className="block">{etiqueta}</span>
        {descripcion && <span className="block text-[13px] ios-secundario">{descripcion}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={activo}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`block w-[51px] h-[31px] rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ios-acento)] ${
            activo ? "bg-[var(--ios-verde)]" : "bg-[var(--ios-separador)]"
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow transition-transform ${
            activo ? "translate-x-[20px]" : ""
          }`}
        />
      </span>
    </label>
  );
}

// Hoja que sube desde abajo (en la compu, ventana centrada). Esc o tocar afuera la cierra.
export function Hoja({
  abierta,
  onCerrar,
  titulo,
  children,
}: {
  abierta: boolean;
  onCerrar: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);

  return (
    <dialog
      ref={dialogo}
      aria-label={titulo}
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === dialogo.current) onCerrar();
      }}
      className="ios-hoja"
    >
      <div className="ios-hoja-contenido">
        <div className="sticky top-0 z-10 bg-[var(--ios-fondo)] pt-2 pb-2 px-4">
          <div className="mx-auto mb-2 h-[5px] w-9 rounded-full bg-[var(--ios-separador)] md:hidden" aria-hidden="true" />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-semibold truncate">{titulo}</h2>
            <button type="button" onClick={onCerrar} className="ios-boton-texto -mr-3">
              Cerrar
            </button>
          </div>
        </div>
        <div className="px-4 pb-[calc(24px+env(safe-area-inset-bottom))]">{abierta && children}</div>
      </div>
    </dialog>
  );
}

// Fila de una lista agrupada con etiqueta a la izquierda y valor a la derecha.
export function FilaDato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="ios-fila">
      <span className="ios-secundario shrink-0">{etiqueta}</span>
      <span className="flex-1 text-right min-w-0 break-words">{children}</span>
    </div>
  );
}
