"use client";

import { Suspense } from "react";
import type { PostInput } from "@voltis/shared";
import FotosEditor from "@/components/admin/FotosEditor";
import EditorTexto from "@/components/admin/EditorTexto";
import { Boton, Campo, Cargando, MensajeError, Tarjeta, claseInput, errorDe } from "@/components/admin/ui";
import { useEditor, useLista, useServicios } from "@/components/admin/useEditor";
import { slugify } from "@/lib/admin-api";

const VACIO: PostInput = {
  slug: "",
  titulo: "",
  extracto: "",
  contenido: "",
  categoria: null,
  portada: null,
  servicioId: null,
  zonaId: null,
  seoTitulo: null,
  seoDescripcion: null,
  estado: "borrador",
};

const aInput = (f: Record<string, unknown>): PostInput => ({
  slug: f.slug as string,
  titulo: f.titulo as string,
  extracto: f.extracto as string,
  contenido: f.contenido as string,
  categoria: (f.categoria as string) ?? null,
  portada: (f.portada as PostInput["portada"]) ?? null,
  servicioId: (f.servicioId as number) ?? null,
  zonaId: (f.zonaId as number) ?? null,
  seoTitulo: (f.seoTitulo as string) ?? null,
  seoDescripcion: (f.seoDescripcion as string) ?? null,
  estado: f.estado as PostInput["estado"],
});

const CATEGORIAS = ["Mantenimiento", "Seguridad", "Instalaciones", "Eficiencia energética", "Trámites"];

function Editor() {
  const e = useEditor<PostInput>("posts", VACIO, aInput);
  const servicios = useServicios();
  const zonas = useLista<{ id: number; nombre: string }>("zonas").filas ?? [];
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
        <h1 className="text-2xl font-bold">{e.id ? "Editar artículo" : "Nuevo artículo"}</h1>
        {e.id && d.estado === "publicado" && (
          <a href={`/blog/${d.slug}`} target="_blank" className="text-sm underline">Ver en el sitio ↗</a>
        )}
      </div>
      <MensajeError texto={e.error} />

      <Tarjeta className="space-y-4">
        <Campo label="Título" error={errorDe(e.errorApi, "titulo")}>
          <input
            className={claseInput}
            value={d.titulo}
            onChange={(ev) => {
              e.set("titulo", ev.target.value);
              if (!e.id) e.set("slug", slugify(ev.target.value));
            }}
            required
          />
        </Campo>
        <Campo label="URL (slug)" error={errorDe(e.errorApi, "slug")} ayuda={`/blog/${d.slug || "..."}`}>
          <input className={claseInput} value={d.slug} onChange={(ev) => e.set("slug", slugify(ev.target.value))} required />
        </Campo>
        <Campo label="Extracto" error={errorDe(e.errorApi, "extracto")} ayuda="Resumen de 1–2 oraciones para el listado del blog.">
          <textarea className={claseInput} rows={2} value={d.extracto} onChange={(ev) => e.set("extracto", ev.target.value)} required />
        </Campo>
        <div className="grid sm:grid-cols-3 gap-4">
          <Campo label="Categoría">
            <input
              className={claseInput}
              list="categorias"
              value={d.categoria ?? ""}
              onChange={(ev) => e.set("categoria", ev.target.value || null)}
            />
            <datalist id="categorias">
              {CATEGORIAS.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Campo>
          <Campo label="Servicio relacionado" ayuda="El artículo enlaza a este servicio.">
            <select
              className={claseInput}
              value={d.servicioId ?? ""}
              onChange={(ev) => e.set("servicioId", ev.target.value ? Number(ev.target.value) : null)}
            >
              <option value="">—</option>
              {servicios.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </Campo>
          <Campo label="Localidad relacionada">
            <select
              className={claseInput}
              value={d.zonaId ?? ""}
              onChange={(ev) => e.set("zonaId", ev.target.value ? Number(ev.target.value) : null)}
            >
              <option value="">—</option>
              {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </select>
          </Campo>
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-semibold mb-3">Imagen de portada</h2>
        <FotosEditor
          fotos={d.portada ? [d.portada] : []}
          onChange={(f) => e.set("portada", f[0] ?? null)}
          carpeta="posts"
          altPorDefecto={d.titulo}
          multiples={false}
          conTipo={false}
        />
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-semibold mb-3">Contenido</h2>
        <EditorTexto etiqueta="Contenido del artículo" valor={d.contenido} onChange={(v) => e.set("contenido", v)} alto={420} />
        {errorDe(e.errorApi, "contenido") && <p className="text-xs text-red-600 mt-1">{errorDe(e.errorApi, "contenido")}</p>}
      </Tarjeta>

      <Tarjeta className="space-y-4">
        <h2 className="font-semibold">Google (opcional)</h2>
        <Campo label="Título para Google" ayuda={`${(d.seoTitulo ?? d.titulo).length}/60 caracteres. Vacío = usa el título.`}>
          <input className={claseInput} value={d.seoTitulo ?? ""} onChange={(ev) => e.set("seoTitulo", ev.target.value || null)} />
        </Campo>
        <Campo label="Descripción para Google" ayuda={`${(d.seoDescripcion ?? d.extracto).length}/155 caracteres. Vacío = usa el extracto.`}>
          <textarea className={claseInput} rows={2} value={d.seoDescripcion ?? ""} onChange={(ev) => e.set("seoDescripcion", ev.target.value || null)} />
        </Campo>
      </Tarjeta>

      <div className="flex flex-wrap items-center gap-3">
        <select className={`${claseInput} w-auto`} value={d.estado} onChange={(ev) => e.set("estado", ev.target.value as PostInput["estado"])}>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </select>
        <Boton type="submit" disabled={e.guardando}>{e.guardando ? "Guardando..." : "Guardar"}</Boton>
        {e.guardado && <span className="text-sm text-green-700">Guardado. Tocá &quot;Publicar cambios&quot; para que se vea en el sitio.</span>}
        {e.id && (
          <Boton type="button" variante="peligro" className="ml-auto" onClick={() => e.borrar(d.titulo)}>
            Borrar artículo
          </Boton>
        )}
      </div>
    </form>
  );
}

export default function EditarPost() {
  return (
    <Suspense fallback={<Cargando />}>
      <Editor />
    </Suspense>
  );
}
