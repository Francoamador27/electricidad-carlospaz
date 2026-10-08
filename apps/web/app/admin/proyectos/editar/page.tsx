"use client";

import { Suspense } from "react";
import type { ProyectoInput } from "@voltis/shared";
import FotosEditor from "@/components/admin/FotosEditor";
import EditorTexto from "@/components/admin/EditorTexto";
import { Boton, Campo, Cargando, MensajeError, Tarjeta, claseInput, errorDe } from "@/components/admin/ui";
import { useEditor, useLista, useServicios } from "@/components/admin/useEditor";
import { slugify } from "@/lib/admin-api";

const VACIO: ProyectoInput = {
  slug: "",
  titulo: "",
  descripcion: "",
  servicioId: null,
  zonaId: null,
  fechaTrabajo: null,
  fotos: [],
  destacado: false,
  estado: "borrador",
};

const aInput = (f: Record<string, unknown>): ProyectoInput => ({
  slug: f.slug as string,
  titulo: f.titulo as string,
  descripcion: f.descripcion as string,
  servicioId: (f.servicioId as number) ?? null,
  zonaId: (f.zonaId as number) ?? null,
  fechaTrabajo: (f.fechaTrabajo as string) ?? null,
  fotos: (f.fotos as ProyectoInput["fotos"]) ?? [],
  destacado: Boolean(f.destacado),
  estado: f.estado as ProyectoInput["estado"],
});

function Editor() {
  const e = useEditor<ProyectoInput>("proyectos", VACIO, aInput);
  const servicios = useServicios();
  const zonas = useLista<{ id: number; nombre: string }>("zonas").filas ?? [];
  const d = e.datos;

  if (!d) return e.error ? <MensajeError texto={e.error} /> : <Cargando />;

  const zona = zonas.find((z) => z.id === d.zonaId);
  const servicio = servicios.find((s) => s.id === d.servicioId);

  return (
    <form
      className="max-w-4xl space-y-6"
      onSubmit={(ev) => {
        ev.preventDefault();
        e.guardar();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{e.id ? "Editar proyecto" : "Nuevo proyecto"}</h1>
        {e.id && d.estado === "publicado" && (
          <a href={`/proyectos/${d.slug}`} target="_blank" className="text-sm underline">
            Ver en el sitio ↗
          </a>
        )}
      </div>
      <MensajeError texto={e.error} />

      <Tarjeta className="space-y-4">
        <Campo label="Título" error={errorDe(e.errorApi, "titulo")} ayuda="Ej.: Tablero nuevo con diferencial en casa de Cosquín">
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
        <Campo label="URL (slug)" error={errorDe(e.errorApi, "slug")} ayuda={`/proyectos/${d.slug || "..."}`}>
          <input className={claseInput} value={d.slug} onChange={(ev) => e.set("slug", slugify(ev.target.value))} required />
        </Campo>
        <div className="grid sm:grid-cols-3 gap-4">
          <Campo label="Servicio">
            <select
              className={claseInput}
              value={d.servicioId ?? ""}
              onChange={(ev) => e.set("servicioId", ev.target.value ? Number(ev.target.value) : null)}
            >
              <option value="">—</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Localidad">
            <select
              className={claseInput}
              value={d.zonaId ?? ""}
              onChange={(ev) => e.set("zonaId", ev.target.value ? Number(ev.target.value) : null)}
            >
              <option value="">—</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>{z.nombre}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Fecha del trabajo">
            <input
              type="date"
              className={claseInput}
              value={d.fechaTrabajo ?? ""}
              onChange={(ev) => e.set("fechaTrabajo", ev.target.value || null)}
            />
          </Campo>
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-semibold mb-3">Fotos</h2>
        <FotosEditor
          fotos={d.fotos}
          onChange={(f) => e.set("fotos", f)}
          carpeta="proyectos"
          altPorDefecto={[servicio?.nombre, zona && `en ${zona.nombre}`].filter(Boolean).join(" ")}
        />
        {errorDe(e.errorApi, "fotos") && <p className="text-xs text-red-600 mt-2">Revisá las descripciones de las fotos.</p>}
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-semibold mb-3">Descripción del trabajo</h2>
        <EditorTexto etiqueta="Descripción del trabajo" valor={d.descripcion} onChange={(v) => e.set("descripcion", v)} alto={220} />
        {errorDe(e.errorApi, "descripcion") && <p className="text-xs text-red-600 mt-1">{errorDe(e.errorApi, "descripcion")}</p>}
      </Tarjeta>

      <Tarjeta className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={d.destacado} onChange={(ev) => e.set("destacado", ev.target.checked)} />
          Destacado en la home
        </label>
        <label className="flex items-center gap-2 text-sm">
          Estado:
          <select
            className={claseInput}
            value={d.estado}
            onChange={(ev) => e.set("estado", ev.target.value as ProyectoInput["estado"])}
          >
            <option value="borrador">Borrador</option>
            <option value="publicado">Publicado</option>
          </select>
        </label>
      </Tarjeta>

      <div className="flex flex-wrap items-center gap-3">
        <Boton type="submit" disabled={e.guardando}>{e.guardando ? "Guardando..." : "Guardar"}</Boton>
        {e.guardado && <span className="text-sm text-green-700">Guardado. Tocá &quot;Publicar cambios&quot; para que se vea en el sitio.</span>}
        {e.id && (
          <Boton type="button" variante="peligro" className="ml-auto" onClick={() => e.borrar(d.titulo)}>
            Borrar proyecto
          </Boton>
        )}
      </div>
    </form>
  );
}

export default function EditarProyecto() {
  return (
    <Suspense fallback={<Cargando />}>
      <Editor />
    </Suspense>
  );
}
