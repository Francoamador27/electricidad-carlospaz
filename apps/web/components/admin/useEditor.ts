"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, ErrorApi, mensajeError } from "@/lib/admin-api";

// Carga / guarda / borra un elemento de /admin/api/<recurso>. El id viene en ?id=
// (export estático: no hay rutas dinámicas en el panel).
export function useEditor<T extends object>(recurso: string, vacio: T, aInput: (fila: Record<string, unknown>) => T) {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const [datos, setDatos] = useState<T | null>(id ? null : vacio);
  const [error, setError] = useState<string | null>(null);
  const [errorApi, setErrorApi] = useState<ErrorApi | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi<Record<string, unknown>>(`/${recurso}/${id}`)
      .then((fila) => setDatos(aInput(fila)))
      .catch((e) => setError(mensajeError(e)));
    // aInput es estable por recurso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, recurso]);

  function set<K extends keyof T>(campo: K, valor: T[K]) {
    setGuardado(false);
    setDatos((d) => (d ? { ...d, [campo]: valor } : d));
  }

  async function guardar() {
    if (!datos) return;
    setGuardando(true);
    setError(null);
    setErrorApi(null);
    try {
      const fila = await adminApi<{ id: number }>(id ? `/${recurso}/${id}` : `/${recurso}`, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(datos),
      });
      setGuardado(true);
      if (!id) router.replace(`/admin/${recurso}/editar?id=${fila.id}`);
    } catch (e) {
      setError(mensajeError(e));
      if (e instanceof ErrorApi) setErrorApi(e);
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(nombre: string) {
    if (!id || !confirm(`¿Borrar "${nombre}"? No se puede deshacer.`)) return;
    try {
      await adminApi(`/${recurso}/${id}`, { method: "DELETE" });
      router.push(`/admin/${recurso}`);
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  return { id, datos, set, guardar, borrar, error, errorApi, guardando, guardado };
}

export function useLista<T>(recurso: string) {
  const [filas, setFilas] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    adminApi<T[]>(`/${recurso}`)
      .then(setFilas)
      .catch((e) => setError(mensajeError(e)));
  }, [recurso]);
  return { filas, error };
}

export function useServicios() {
  return useLista<{ id: number; slug: string; nombre: string }>("servicios").filas ?? [];
}
