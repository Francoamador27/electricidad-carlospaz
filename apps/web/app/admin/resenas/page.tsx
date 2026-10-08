"use client";

import { useEffect, useState } from "react";
import type { ResenaInput } from "@voltis/shared";
import { Boton, Campo, Cargando, Estado, MensajeError, Tarjeta, Titulo, claseInput } from "@/components/admin/ui";
import { adminApi, mensajeError } from "@/lib/admin-api";

type Resena = ResenaInput & { id: number; createdAt: string };

const VACIA: ResenaInput = {
  nombre: "",
  localidad: null,
  servicio: null,
  texto: "",
  estrellas: 5,
  fuente: "google",
  estado: "publicado",
};

export default function ResenasAdmin() {
  const [filas, setFilas] = useState<Resena[] | null>(null);
  const [form, setForm] = useState<ResenaInput>(VACIA);
  const [editando, setEditando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    adminApi<Resena[]>("/resenas").then(setFilas).catch((e) => setError(mensajeError(e)));
  }, []);

  const set = <K extends keyof ResenaInput>(k: K, v: ResenaInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const fila = await adminApi<Resena>(editando ? `/resenas/${editando}` : "/resenas", {
        method: editando ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setFilas((fs) => (editando ? fs?.map((r) => (r.id === editando ? fila : r)) : [fila, ...(fs ?? [])]) ?? null);
      setForm(VACIA);
      setEditando(null);
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(r: Resena) {
    if (!confirm(`¿Borrar la reseña de ${r.nombre}?`)) return;
    try {
      await adminApi(`/resenas/${r.id}`, { method: "DELETE" });
      setFilas((fs) => fs?.filter((x) => x.id !== r.id) ?? null);
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  function editar(r: Resena) {
    setEditando(r.id);
    setForm({
      nombre: r.nombre,
      localidad: r.localidad,
      servicio: r.servicio,
      texto: r.texto,
      estrellas: r.estrellas,
      fuente: r.fuente,
      estado: r.estado,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-4xl">
      <Titulo>Reseñas</Titulo>
      <p className="text-sm text-slate-600 mb-4">
        Cargá solo reseñas reales (por ejemplo, copiadas de tu Perfil de Google o de un WhatsApp de un cliente, con su
        permiso). La sección de reseñas aparece en la home cuando hay al menos una publicada.
      </p>
      <MensajeError texto={error} />

      <Tarjeta className="mb-8">
        <form onSubmit={guardar} className="space-y-4">
          <h2 className="font-semibold">{editando ? "Editar reseña" : "Nueva reseña"}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Campo label="Nombre" ayuda='Ej.: "Marcela R."'>
              <input className={claseInput} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
            </Campo>
            <Campo label="Localidad">
              <input className={claseInput} value={form.localidad ?? ""} onChange={(e) => set("localidad", e.target.value || null)} />
            </Campo>
            <Campo label="Servicio">
              <input className={claseInput} value={form.servicio ?? ""} onChange={(e) => set("servicio", e.target.value || null)} />
            </Campo>
          </div>
          <Campo label="Texto">
            <textarea className={claseInput} rows={3} value={form.texto} onChange={(e) => set("texto", e.target.value)} required />
          </Campo>
          <div className="flex flex-wrap items-end gap-4">
            <Campo label="Estrellas">
              <select className={claseInput} value={form.estrellas} onChange={(e) => set("estrellas", Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
              </select>
            </Campo>
            <Campo label="Fuente">
              <select className={claseInput} value={form.fuente ?? ""} onChange={(e) => set("fuente", e.target.value || null)}>
                <option value="google">Google</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="otra">Otra</option>
              </select>
            </Campo>
            <Campo label="Estado">
              <select className={claseInput} value={form.estado} onChange={(e) => set("estado", e.target.value as ResenaInput["estado"])}>
                <option value="publicado">Publicada</option>
                <option value="borrador">Borrador</option>
              </select>
            </Campo>
            <Boton type="submit" disabled={guardando}>{guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar"}</Boton>
            {editando && (
              <Boton type="button" variante="secundario" onClick={() => (setEditando(null), setForm(VACIA))}>
                Cancelar
              </Boton>
            )}
          </div>
        </form>
      </Tarjeta>

      {!filas && !error && <Cargando />}
      <ul className="space-y-3">
        {filas?.map((r) => (
          <li key={r.id} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-semibold">{r.nombre}</span>
              <span className="text-amber-600">{"★".repeat(r.estrellas)}</span>
              <span className="text-xs text-slate-500">{[r.localidad, r.servicio, r.fuente].filter(Boolean).join(" · ")}</span>
              <span className="ml-auto"><Estado estado={r.estado} /></span>
            </div>
            <p className="text-sm text-slate-700">{r.texto}</p>
            <div className="mt-3 flex gap-2">
              <Boton variante="secundario" onClick={() => editar(r)}>Editar</Boton>
              <Boton variante="peligro" onClick={() => borrar(r)}>Borrar</Boton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
