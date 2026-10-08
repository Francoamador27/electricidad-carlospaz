"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminApi, mensajeError } from "@/lib/admin-api";

const SECCIONES = [
  { href: "/admin", label: "Conversiones" },
  { href: "/admin/consultas", label: "Consultas" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/zonas", label: "Zonas" },
  { href: "/admin/resenas", label: "Reseñas" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const ruta = usePathname().replace(/\/$/, "") || "/admin";
  const [publicando, setPublicando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [menu, setMenu] = useState(false);

  async function publicar() {
    if (!confirm("¿Publicar los cambios? El sitio se regenera en 1–2 minutos.")) return;
    setPublicando(true);
    setAviso(null);
    try {
      const r = await adminApi<{ simulado?: boolean }>("/publicar", { method: "POST" });
      setAviso({
        tipo: "ok",
        texto: r.simulado
          ? "Modo local: no hay deploy hook. En producción esto regenera el sitio."
          : "Listo. El sitio se está regenerando (1–2 minutos).",
      });
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeError(e) });
    } finally {
      setPublicando(false);
    }
  }

  const activa = (href: string) => (href === "/admin" ? ruta === "/admin" : ruta.startsWith(href));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="bg-slate-900 text-slate-200 md:w-56 md:min-h-screen md:flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin" className="font-display font-bold text-white text-lg">
            Voltis <span className="text-amber-400">panel</span>
          </Link>
          <button className="md:hidden text-sm border border-slate-600 rounded px-2 py-1" onClick={() => setMenu(!menu)}>
            Menú
          </button>
        </div>
        <nav className={`${menu ? "block" : "hidden"} md:block px-2 pb-4`}>
          {SECCIONES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setMenu(false)}
              className={`block rounded px-3 py-2 text-sm ${
                activa(s.href) ? "bg-amber-500 text-slate-900 font-semibold" : "hover:bg-slate-800"
              }`}
            >
              {s.label}
            </Link>
          ))}
          <div className="mt-6 px-1 space-y-2">
            <button
              onClick={publicar}
              disabled={publicando}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded px-3 py-2 disabled:opacity-60"
            >
              {publicando ? "Publicando..." : "Publicar cambios"}
            </button>
            <a href="/" target="_blank" className="block text-center text-xs text-slate-400 hover:text-white">
              Ver sitio ↗
            </a>
          </div>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8">
        {aviso && (
          <div
            role="status"
            className={`mb-6 rounded border px-4 py-3 text-sm ${
              aviso.tipo === "ok" ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            {aviso.texto}
            <button className="ml-3 underline" onClick={() => setAviso(null)}>
              cerrar
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
