"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import AppInstalable from "@/components/admin/AppInstalable";
import Login from "@/components/admin/Login";
import { adminApi, ErrorApi, mensajeError } from "@/lib/admin-api";
import { borrarCopiaSinConexion } from "@/lib/agenda";

// ---------- Íconos (trazo fino, estilo SF Symbols) ----------

type Icono = (p: { className?: string }) => React.ReactElement;
const svg = (d: React.ReactNode): Icono =>
  function IconoSvg({ className }) {
    return (
      <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    );
  };

const IconoAgenda = svg(<><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
const IconoFinanzas = svg(<><path d="M4 19h16" /><path d="M7 16V10M12 16V6M17 16v-4" /></>);
const IconoInicio = svg(<path d="M4 19V10l8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />);
const IconoConsultas = svg(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />);
const IconoProyectos = svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-8 8" /></>);
const IconoBlog = svg(<><path d="M5 4h11l3 3v13H5z" /><path d="M9 10h6M9 14h6M9 18h3" /></>);
const IconoMas = svg(<><circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" /></>);
const IconoZonas = svg(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>);
const IconoResenas = svg(<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />);
const IconoQr = svg(<><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2h-2zM18 14h2M14 18v2M18 18h2v2" /></>);
const IconoConfig = svg(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>);
export const IconoChevron = svg(<path d="m9 6 6 6-6 6" />);

type Seccion = { href: string; label: string; Icono: Icono };

// Pestañas del celular (máximo 5, como iOS). El resto vive en "Más".
const PESTANAS: Seccion[] = [
  { href: "/admin/agenda", label: "Agenda", Icono: IconoAgenda },
  { href: "/admin/consultas", label: "Consultas", Icono: IconoConsultas },
  { href: "/admin/finanzas", label: "Finanzas", Icono: IconoFinanzas },
  { href: "/admin/proyectos", label: "Proyectos", Icono: IconoProyectos },
  { href: "/admin/mas", label: "Más", Icono: IconoMas },
];

export const SECCIONES_MAS: Seccion[] = [
  { href: "/admin", label: "Conversiones del sitio", Icono: IconoInicio },
  { href: "/admin/posts", label: "Blog", Icono: IconoBlog },
  { href: "/admin/zonas", label: "Zonas", Icono: IconoZonas },
  { href: "/admin/pedir-resena", label: "Pedir reseña", Icono: IconoQr },
  { href: "/admin/resenas", label: "Reseñas", Icono: IconoResenas },
  { href: "/admin/configuracion", label: "Configuración", Icono: IconoConfig },
];

// Barra lateral de la computadora: todas las secciones.
const LATERAL: Seccion[] = [
  { href: "/admin/agenda", label: "Agenda", Icono: IconoAgenda },
  { href: "/admin/consultas", label: "Consultas", Icono: IconoConsultas },
  { href: "/admin/finanzas", label: "Finanzas", Icono: IconoFinanzas },
  { href: "/admin/proyectos", label: "Proyectos", Icono: IconoProyectos },
  { href: "/admin", label: "Conversiones", Icono: IconoInicio },
  ...SECCIONES_MAS.filter((x) => x.href !== "/admin"),
];

// ---------- Contexto: sesión y publicar, disponibles en cualquier pantalla ----------

type Panel = { usuario: string; salir: () => void; publicar: () => void; publicando: boolean };
const PanelContexto = createContext<Panel | null>(null);
export function usePanel(): Panel {
  const p = useContext(PanelContexto);
  if (!p) throw new Error("usePanel fuera del panel");
  return p;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const ruta = usePathname().replace(/\/$/, "") || "/admin";
  const [publicando, setPublicando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  // undefined = verificando, null = sin sesión.
  const [usuario, setUsuario] = useState<string | null | undefined>(undefined);
  const [errorConexion, setErrorConexion] = useState<string | null>(null);

  useEffect(() => {
    adminApi<{ usuario: string }>("/yo")
      .then((r) => setUsuario(r.usuario))
      .catch((e) => {
        if (e instanceof ErrorApi && (e.estado === 401 || e.estado === 503)) setUsuario(null);
        else setErrorConexion(mensajeError(e));
      });
  }, []);

  async function salir() {
    await adminApi("/auth/salir", { method: "POST" }).catch(() => undefined);
    // Privacidad: al salir no quedan datos de clientes guardados en el teléfono.
    borrarCopiaSinConexion();
    setUsuario(null);
  }

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

  let contenido: React.ReactNode;
  if (errorConexion) {
    contenido = <p className="p-8 text-red-700">{errorConexion}</p>;
  } else if (usuario === undefined) {
    contenido = <p className="p-8 ios-secundario">Cargando...</p>;
  } else if (usuario === null) {
    contenido = <Login alEntrar={setUsuario} />;
  } else {
    const activa = (href: string) => (href === "/admin" ? ruta === "/admin" : ruta.startsWith(href));
    const enMas = SECCIONES_MAS.some((s) => activa(s.href)) || ruta.startsWith("/admin/mas");

    contenido = (
      <PanelContexto.Provider value={{ usuario, salir, publicar, publicando }}>
        <div className="md:flex min-h-dvh">
          {/* Computadora: barra lateral */}
          <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:sticky md:top-0 md:h-dvh p-3 border-r border-[var(--ios-separador)] bg-[var(--ios-tarjeta)]">
            <Link href="/admin" className="px-3 py-3 text-lg font-bold">
              Voltis <span className="text-[var(--ios-acento)]">panel</span>
            </Link>
            <nav aria-label="Secciones" className="flex-1 space-y-0.5">
              {LATERAL.map(({ href, label, Icono }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={activa(href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] ${
                    activa(href) ? "bg-[var(--ios-acento)] text-[var(--ios-acento-texto)] font-semibold" : "hover:bg-[var(--ios-relleno)]"
                  }`}
                >
                  <Icono className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="space-y-1 pt-3">
              <button type="button" onClick={publicar} disabled={publicando} className="ios-boton w-full disabled:opacity-60">
                {publicando ? "Publicando..." : "Publicar cambios"}
              </button>
              <a href="/" target="_blank" className="block text-center text-sm ios-secundario py-1.5">
                Ver sitio ↗
              </a>
              {usuario !== "local" && (
                <button type="button" onClick={salir} className="block w-full text-center text-sm ios-secundario py-1.5">
                  Salir ({usuario})
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Celular: barra superior translúcida */}
            <header className="ios-barra-superior md:hidden">
              <div className="flex items-center justify-between h-11 px-4">
                <span className="font-semibold">
                  Voltis <span className="text-[var(--ios-acento)]">panel</span>
                </span>
                <button
                  type="button"
                  onClick={publicar}
                  disabled={publicando}
                  aria-label="Publicar cambios"
                  className="ios-boton-texto -mr-3 disabled:opacity-60"
                >
                  {publicando ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </header>

            <main className="ios-contenido px-4 pt-4 md:p-8 max-w-6xl">
              <AppInstalable />
              {aviso && (
                <div
                  role="status"
                  className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                    aviso.tipo === "ok" ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
                  }`}
                >
                  {aviso.texto}
                  <button type="button" className="ml-3 underline" onClick={() => setAviso(null)}>
                    cerrar
                  </button>
                </div>
              )}
              {children}
            </main>
          </div>

          {/* Celular: pestañas inferiores */}
          <nav aria-label="Pestañas" className="ios-tabbar md:hidden">
            {PESTANAS.map(({ href, label, Icono }) => {
              const actual = href === "/admin/mas" ? enMas : activa(href);
              return (
                <Link key={href} href={href} className="ios-tab" aria-current={actual ? "page" : undefined}>
                  <Icono className="w-6 h-6" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </PanelContexto.Provider>
    );
  }

  return <div className="admin-ios">{contenido}</div>;
}
