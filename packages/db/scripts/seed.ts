// Carga inicial: servicios, zonas (borrador) y los 4 posts que ya estaban en el sitio.
// Idempotente: no pisa filas existentes, así no se pierde lo editado desde el panel.
// Con --actualizar-posts reescribe el contenido de los posts del seed.
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";
import { LOCALIDADES, SERVICIOS } from "@voltis/shared";
import { eq, getDb, schema } from "../src";
import { ZONAS } from "../seed/zonas";
import { PROYECTOS } from "../seed/proyectos";

config({ path: "../../apps/api/.dev.vars" });
const db = getDb(process.env.DATABASE_URL!);

const PUBLIC_WEB = path.resolve(import.meta.dirname, "../../../apps/web/public");
const POSTS_DIR = path.resolve(import.meta.dirname, "../seed/posts");

function frontmatter(raw: string): { datos: Record<string, string>; cuerpo: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error("Falta frontmatter");
  const datos: Record<string, string> = {};
  for (const linea of m[1].split(/\r?\n/)) {
    const i = linea.indexOf(":");
    datos[linea.slice(0, i).trim()] = linea.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  return { datos, cuerpo: m[2].trim() };
}

async function main() {
  const servicios = await db
    .insert(schema.servicios)
    .values(SERVICIOS.map((s, i) => ({ slug: s.slug, nombre: s.nombre, orden: i })))
    .onConflictDoNothing()
    .returning();
  console.log(`servicios: ${servicios.length} nuevos`);

  const zonas = await db
    .insert(schema.zonas)
    .values(
      LOCALIDADES.map((l, i) => {
        const z = ZONAS.find((z) => z.slug === l.slug);
        if (!z) throw new Error(`Falta texto para ${l.slug}`);
        return { ...z, nombre: l.nombre, orden: i, estado: "borrador" as const };
      }),
    )
    .onConflictDoNothing()
    .returning();
  console.log(`zonas: ${zonas.length} nuevas`);

  const idServicio = new Map(
    (await db.select().from(schema.servicios)).map((s) => [s.slug, s.id]),
  );

  const posts = [];
  for (const archivo of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))) {
    const { datos, cuerpo } = frontmatter(fs.readFileSync(path.join(POSTS_DIR, archivo), "utf8"));
    const dim = await imageSizeFromFile(path.join(PUBLIC_WEB, datos.portada));
    posts.push({
      slug: archivo.replace(/\.md$/, ""),
      titulo: datos.titulo,
      extracto: datos.extracto,
      seoDescripcion: datos.seoDescripcion,
      categoria: datos.categoria,
      contenido: cuerpo,
      portada: {
        key: datos.portada,
        anchos: [],
        ancho: dim.width,
        alto: dim.height,
        alt: datos.portadaAlt,
        tipo: "general" as const,
      },
      servicioId: idServicio.get(datos.servicio),
      estado: "publicado" as const,
      publicadoAt: new Date(`${datos.fecha}T12:00:00-03:00`),
    });
  }
  const nuevos = await db.insert(schema.posts).values(posts).onConflictDoNothing().returning();
  console.log(`posts: ${nuevos.length} nuevos`);

  if (process.argv.includes("--actualizar-posts")) {
    for (const p of posts) {
      await db
        .update(schema.posts)
        .set({ contenido: p.contenido, extracto: p.extracto, seoDescripcion: p.seoDescripcion })
        .where(eq(schema.posts.slug, p.slug));
    }
    console.log(`posts: ${posts.length} actualizados`);
  }

  const proyectos = [];
  for (const p of PROYECTOS) {
    const dim = await imageSizeFromFile(path.join(PUBLIC_WEB, p.foto));
    proyectos.push({
      slug: p.slug,
      titulo: p.titulo,
      descripcion: p.descripcion,
      servicioId: idServicio.get(p.servicio),
      fotos: [{ key: p.foto, anchos: [], ancho: dim.width, alto: dim.height, alt: p.alt, tipo: "general" as const }],
      destacado: p.destacado ?? false,
      estado: "publicado" as const,
      publicadoAt: new Date(),
    });
  }
  const nuevosProyectos = await db.insert(schema.proyectos).values(proyectos).onConflictDoNothing().returning();
  console.log(`proyectos: ${nuevosProyectos.length} nuevos`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
