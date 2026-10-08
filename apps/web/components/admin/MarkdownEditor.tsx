"use client";

import { useState } from "react";
import Markdown from "@/components/ui/Markdown";
import { claseInput } from "@/components/admin/ui";

export default function MarkdownEditor({
  valor,
  onChange,
  filas = 18,
}: {
  valor: string;
  onChange: (v: string) => void;
  filas?: number;
}) {
  const [vista, setVista] = useState<"escribir" | "previa">("escribir");
  return (
    <div>
      <div className="flex gap-1 mb-2 text-sm">
        {(["escribir", "previa"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            className={`px-3 py-1 rounded ${vista === v ? "bg-slate-900 text-white" : "bg-white border border-slate-300"}`}
          >
            {v === "escribir" ? "Escribir" : "Vista previa"}
          </button>
        ))}
        <details className="ml-auto text-xs text-slate-600">
          <summary className="cursor-pointer">Ayuda de formato</summary>
          <pre className="mt-2 bg-white border rounded p-3 whitespace-pre-wrap">
{`## Subtítulo
### Subtítulo chico
**negrita**
- punto de lista
1. lista numerada
[texto del link](/servicios/tableros-electricos)
> recuadro destacado
> **⚠️ Importante:** recuadro rojo`}
          </pre>
        </details>
      </div>
      {vista === "escribir" ? (
        <textarea
          className={`${claseInput} font-mono`}
          rows={filas}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="bg-white border border-slate-300 rounded p-6 min-h-40">
          {valor.trim() ? <Markdown>{valor}</Markdown> : <p className="text-slate-400">Nada para mostrar.</p>}
        </div>
      )}
    </div>
  );
}
