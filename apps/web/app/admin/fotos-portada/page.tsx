"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { proyectosDePortada, type FotoInput } from "@voltis/shared";
import { usePanel } from "@/components/admin/AdminShell";
import FotosEditor from "@/components/admin/FotosEditor";
import { Boton, Cargando, MensajeError, Tarjeta, Titulo } from "@/components/admin/ui";
import { adminApi, ErrorApi, mensajeError } from "@/lib/admin-api";
import { indiceFotoPrincipal } from "@/lib/fotos";

type Proyecto = {
  id: number;
  titulo: string;
  estado: string;
  destacado: boolean;
  fechaTrabajo: string | null;
  fotos: FotoInput[];
};
type Post = { id: number; titulo: string; estado: string; publicadoAt: string | null; portada: FotoInput | null };

const CANTIDAD_BLOG = 3;

// Mismo orden que el sitio (Postgres ordena los NULL primero en DESC).
function ordenarProyectos(filas: Proyecto[]): Proyecto[] {
  return [...filas].sort((a, b) => {
    if (a.fechaTrabajo !== b.fechaTrabajo) {
      if (!a.fechaTrabajo) return -1;
      if (!b.fechaTrabajo) return 1;
      return b.fechaTrabajo.localeCompare(a.fechaTrabajo);
    }
    return b.id - a.id;
  });
}

function ordenarPosts(filas: Post[]): Post[] {
  return [...filas].sort((a, b) => (b.publicadoAt ?? "").localeCompare(a.publicadoAt ?? ""));
}

// Una foto que se guarda sola al cambiarla. La espera evita guardar en cada tecla de la descripción.
function FotoAutoguardada({
  inicial,
  carpeta,
  alt,
  guardar,
}: {
  inicial: FotoInput | null;
  carpeta: "sitio" | "proyectos" | "posts";
  alt: string;
  guardar: (foto: FotoInput | null) => Promise<unknown>;
}) {
  const [fotos, setFotos] = useState<FotoInput[]>(inicial ? [inicial] : []);
  const [estado, setEstado] = useState<string | null>(null);
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cambiar(nuevas: FotoInput[]) {
    setFotos(nuevas);
    if (espera.current) clearTimeout(espera.current);
    if (nuevas[0] && nuevas[0].alt.trim().length < 3) {
      setEstado("Escribí una descripción de la foto para guardarla.");
      return;
    }
    espera.current = setTimeout(async () => {
      setEstado("Guardando...");
      try {
        await guardar(nuevas[0] ?? null);
        setEstado("Guardado ✓");
      } catch (e) {
        const invalido = e instanceof ErrorApi && e.codigo === "datos_invalidos";
        setEstado(invalido ? "No se pudo guardar: revisá los datos desde su editor." : mensajeError(e));
      }
    }, 700);
  }

  return (
    <>
      <FotosEditor fotos={fotos} onChange={cambiar} carpeta={carpeta} altPorDefecto={alt} multiples={false} conTipo={false} />
      {estado && (
        <p role="status" className="text-sm font-medium mt-2">
          {estado}
        </p>
      )}
    </>
  );
}

export default function FotosPortadaPage() {
  const { publicar, publicando } = usePanel();
  const [datos, setDatos] = useState<{ franco: FotoInput | null; proyectos: Proyecto[]; posts: Post[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      adminApi<{ foto: FotoInput | null }>("/foto-franco"),
      adminApi<Proyecto[]>("/proyectos"),
      adminApi<Post[]>("/posts"),
    ])
      .then(([f, proyectos, posts]) =>
        setDatos({
          franco: f.foto,
          proyectos: proyectosDePortada(ordenarProyectos(proyectos.filter((p) => p.estado === "publicado"))),
          posts: ordenarPosts(posts.filter((p) => p.estado === "publicado")).slice(0, CANTIDAD_BLOG),
        }),
      )
      .catch((e) => setError(mensajeError(e)));
  }, []);

  // Solo cambia la foto: el resto de la fila se reenvía tal cual para no pisar otros datos.
  function guardarProyecto(p: Proyecto, indice: number, foto: FotoInput | null) {
    const anterior = p.fotos[indice];
    const fotos = p.fotos.flatMap((f, i) => {
      if (i !== indice) return [f];
      return foto ? [{ ...foto, tipo: anterior?.tipo ?? foto.tipo }] : [];
    });
    if (!anterior && foto) fotos.push(foto);
    return adminApi(`/proyectos/${p.id}`, { method: "PUT", body: JSON.stringify({ ...p, fotos }) });
  }

  return (
    <div className="max-w-3xl">
      <Titulo>Fotos de la portada</Titulo>
      <p className="text-sm text-slate-600 mb-6">
        Cada cambio se guarda solo. Cuando termines, tocá <strong>Publicar cambios</strong> para verlo en el sitio.
      </p>
      <MensajeError texto={error} />
      {!datos && !error && <Cargando />}

      {datos && (
        <div className="space-y-8">
          <section>
            <h2 className="ios-encabezado-lista">Tu foto (portada y Quién soy)</h2>
            <Tarjeta className="space-y-2">
              <p className="text-sm text-slate-600">Usá una foto vertical, con tu cara centrada.</p>
              <FotoAutoguardada
                inicial={datos.franco}
                carpeta="sitio"
                alt="Franco, electricista en Carlos Paz"
                guardar={(foto) => adminApi("/foto-franco", { method: "PUT", body: JSON.stringify({ foto }) })}
              />
            </Tarjeta>
          </section>

          <section>
            <h2 className="ios-encabezado-lista">Trabajos que se ven en la portada</h2>
            <p className="text-sm text-slate-600 mb-3">
              Para mostrar otro trabajo, cargalo en{" "}
              <Link href="/admin/proyectos" className="underline">
                Proyectos
              </Link>{" "}
              y marcalo como destacado.
            </p>
            <div className="space-y-4">
              {datos.proyectos.map((p) => {
                const indice = indiceFotoPrincipal(p.fotos);
                return (
                  <Tarjeta key={p.id} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold">{p.titulo}</h3>
                      <Link href={`/admin/proyectos/editar?id=${p.id}`} className="text-sm underline shrink-0">
                        Editar texto
                      </Link>
                    </div>
                    <FotoAutoguardada
                      inicial={p.fotos[indice] ?? null}
                      carpeta="proyectos"
                      alt={p.titulo}
                      guardar={(foto) => guardarProyecto(p, indice, foto)}
                    />
                  </Tarjeta>
                );
              })}
              {datos.proyectos.length === 0 && <p className="text-sm text-slate-600">No hay proyectos publicados.</p>}
            </div>
          </section>

          <section>
            <h2 className="ios-encabezado-lista">Artículos del blog en la portada</h2>
            <div className="space-y-4">
              {datos.posts.map((p) => (
                <Tarjeta key={p.id} className="space-y-2">
                  <h3 className="font-semibold">{p.titulo}</h3>
                  <FotoAutoguardada
                    inicial={p.portada}
                    carpeta="posts"
                    alt={p.titulo}
                    guardar={(portada) =>
                      adminApi(`/posts/${p.id}`, { method: "PUT", body: JSON.stringify({ ...p, portada }) })
                    }
                  />
                </Tarjeta>
              ))}
              {datos.posts.length === 0 && <p className="text-sm text-slate-600">No hay artículos publicados.</p>}
            </div>
          </section>

          <Boton type="button" onClick={publicar} disabled={publicando}>
            {publicando ? "Publicando..." : "Publicar cambios"}
          </Boton>
        </div>
      )}
    </div>
  );
}
