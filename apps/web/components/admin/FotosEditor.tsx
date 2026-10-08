"use client";

import { useRef, useState } from "react";
import type { FotoInput } from "@voltis/shared";
import { adminApi, mensajeError } from "@/lib/admin-api";
import { srcFoto } from "@/lib/fotos";
import { procesarImagen } from "@/lib/procesar-imagen";
import { claseInput } from "@/components/admin/ui";

type Props = {
  fotos: FotoInput[];
  onChange: (fotos: FotoInput[]) => void;
  carpeta: "proyectos" | "posts";
  altPorDefecto: string;
  multiples?: boolean;
  conTipo?: boolean;
};

export default function FotosEditor({ fotos, onChange, carpeta, altPorDefecto, multiples = true, conTipo = true }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subir(archivos: FileList | null) {
    if (!archivos?.length) return;
    setError(null);
    const nuevas: FotoInput[] = [];
    try {
      for (const [i, archivo] of Array.from(archivos).entries()) {
        setSubiendo(`Procesando ${i + 1} de ${archivos.length}...`);
        const img = await procesarImagen(archivo);
        const form = new FormData();
        form.append("carpeta", carpeta);
        for (const v of img.versiones) form.append(`w${v.ancho}`, v.blob, `w${v.ancho}`);
        setSubiendo(`Subiendo ${i + 1} de ${archivos.length}...`);
        const r = await adminApi<{ key: string; anchos: number[]; formato: "webp" | "jpeg" }>("/uploads", {
          method: "POST",
          body: form,
        });
        nuevas.push({
          key: r.key,
          anchos: r.anchos,
          formato: r.formato,
          ancho: img.ancho,
          alto: img.alto,
          alt: altPorDefecto || "Trabajo eléctrico",
          tipo: "general",
        });
      }
      onChange(multiples ? [...fotos, ...nuevas] : nuevas.slice(0, 1));
    } catch (e) {
      setError(e instanceof Error && !("estado" in e) ? e.message : mensajeError(e));
    } finally {
      setSubiendo(null);
      if (input.current) input.current.value = "";
    }
  }

  function actualizar(i: number, cambio: Partial<FotoInput>) {
    onChange(fotos.map((f, j) => (j === i ? { ...f, ...cambio } : f)));
  }

  function mover(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= fotos.length) return;
    const copia = [...fotos];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    onChange(copia);
  }

  return (
    <div>
      {fotos.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {fotos.map((f, i) => (
            <li key={f.key} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcFoto(f, f.anchos[0])} alt={f.alt} className="w-full aspect-video object-cover bg-slate-100" />
              <div className="p-3 space-y-2">
                <input
                  className={claseInput}
                  value={f.alt}
                  onChange={(e) => actualizar(i, { alt: e.target.value })}
                  placeholder="Descripción de la foto (para Google y accesibilidad)"
                  aria-label="Texto alternativo"
                />
                <div className="flex gap-2">
                  {conTipo && (
                    <select
                      className={claseInput}
                      value={f.tipo}
                      onChange={(e) => actualizar(i, { tipo: e.target.value as FotoInput["tipo"] })}
                      aria-label="Tipo de foto"
                    >
                      <option value="general">General</option>
                      <option value="antes">Antes</option>
                      <option value="despues">Después</option>
                    </select>
                  )}
                  {multiples && (
                    <>
                      <button type="button" className="border rounded px-2" onClick={() => mover(i, -1)} aria-label="Mover antes">
                        ↑
                      </button>
                      <button type="button" className="border rounded px-2" onClick={() => mover(i, 1)} aria-label="Mover después">
                        ↓
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="border border-red-300 text-red-700 rounded px-2 ml-auto"
                    onClick={() => onChange(fotos.filter((_, j) => j !== i))}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiples}
        className="hidden"
        onChange={(e) => subir(e.target.files)}
      />
      <button
        type="button"
        disabled={!!subiendo}
        onClick={() => input.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-lg px-4 py-6 w-full text-sm text-slate-600 disabled:opacity-60"
      >
        {subiendo ?? (multiples ? "+ Agregar fotos" : fotos.length ? "Cambiar foto" : "+ Subir foto")}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <p className="text-xs text-slate-500 mt-2">
        Se convierten a WebP en varios tamaños y se borran los datos de ubicación (GPS) de la foto.
      </p>
    </div>
  );
}
