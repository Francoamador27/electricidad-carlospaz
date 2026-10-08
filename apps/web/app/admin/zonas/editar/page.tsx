"use client";

import { Suspense } from "react";
import type { ZonaInput } from "@voltis/shared";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Boton, Campo, Cargando, MensajeError, Tarjeta, claseInput, errorDe } from "@/components/admin/ui";
import { useEditor } from "@/components/admin/useEditor";
import { slugify } from "@/lib/admin-api";

const VACIO: ZonaInput = {
  slug: "",
  nombre: "",
  texto: "",
  seoTitulo: null,
  seoDescripcion: null,
  estado: "borrador",
  orden: 100,
};

const aInput = (f: Record<string, unknown>): ZonaInput => ({
  slug: f.slug as string,
  nombre: f.nombre as string,
  texto: f.texto as string,
  seoTitulo: (f.seoTitulo as string) ?? null,
  seoDescripcion: (f.seoDescripcion as string) ?? null,
  estado: f.estado as ZonaInput["estado"],
  orden: f.orden as number,
});

function Editor() {
  const e = useEditor<ZonaInput>("zonas", VACIO, aInput);
  const d = e.datos;
  if (!d) return e.error ? <MensajeError texto={e.error} /> : <Cargando />;

  return (
    <form
      className="max-w-4xl space-y-6"
      onSubmit={(ev) => {
        ev.preventDefault();
        e.guardar();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{e.id ? `Electricista en ${d.nombre}` : "Nueva localidad"}</h1>
        {e.id && (
          <a href={`/zonas/${d.slug}`} target="_blank" className="text-sm underline">
            {d.estado === "publicado" ? "Ver en el sitio ↗" : "Vista previa local ↗"}
          </a>
        )}
      </div>
      <MensajeError texto={e.error} />

      <Tarjeta className="grid sm:grid-cols-3 gap-4">
        <Campo label="Localidad" error={errorDe(e.errorApi, "nombre")}>
          <input
            className={claseInput}
            value={d.nombre}
            onChange={(ev) => {
              e.set("nombre", ev.target.value);
              if (!e.id) e.set("slug", slugify(ev.target.value));
            }}
            required
          />
        </Campo>
        <Campo label="URL (slug)" error={errorDe(e.errorApi, "slug")} ayuda={`/zonas/${d.slug || "..."}`}>
          <input className={claseInput} value={d.slug} onChange={(ev) => e.set("slug", slugify(ev.target.value))} required />
        </Campo>
        <Campo label="Orden" ayuda="Menor = aparece antes.">
          <input type="number" className={claseInput} value={d.orden} onChange={(ev) => e.set("orden", Number(ev.target.value))} />
        </Campo>
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-semibold mb-1">Texto de la página</h2>
        <p className="text-xs text-slate-500 mb-3">
          Tiene que ser propio de esta localidad: tipo de casas, problemas típicos, trabajos que hacés ahí. No copies el
          texto de otra zona cambiando el nombre.
        </p>
        <MarkdownEditor valor={d.texto} onChange={(v) => e.set("texto", v)} />
      </Tarjeta>

      <Tarjeta className="space-y-4">
        <h2 className="font-semibold">Google</h2>
        <Campo label="Título para Google" ayuda={`Vacío = "Electricista en ${d.nombre || "..."}"`}>
          <input className={claseInput} value={d.seoTitulo ?? ""} onChange={(ev) => e.set("seoTitulo", ev.target.value || null)} />
        </Campo>
        <Campo label="Descripción para Google" ayuda={`${(d.seoDescripcion ?? "").length}/155 caracteres`}>
          <textarea className={claseInput} rows={2} value={d.seoDescripcion ?? ""} onChange={(ev) => e.set("seoDescripcion", ev.target.value || null)} />
        </Campo>
      </Tarjeta>

      <div className="flex flex-wrap items-center gap-3">
        <select className={`${claseInput} w-auto`} value={d.estado} onChange={(ev) => e.set("estado", ev.target.value as ZonaInput["estado"])}>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </select>
        <Boton type="submit" disabled={e.guardando}>{e.guardando ? "Guardando..." : "Guardar"}</Boton>
        {e.guardado && <span className="text-sm text-green-700">Guardado.</span>}
        {e.id && (
          <Boton type="button" variante="peligro" className="ml-auto" onClick={() => e.borrar(d.nombre)}>
            Borrar localidad
          </Boton>
        )}
      </div>
    </form>
  );
}

export default function EditarZona() {
  return (
    <Suspense fallback={<Cargando />}>
      <Editor />
    </Suspense>
  );
}
