// Contenido de /llms.txt y /llms-full.txt (https://llmstxt.org), generado en el build
// desde la base para que nunca quede desactualizado.
import { LOCALIDADES, NEGOCIO, SERVICIOS } from "@voltis/shared/negocio";
import { getPosts, getProyectosConRelaciones, getZonas } from "@/lib/contenido";
import { SITE_URL } from "@/lib/site";
import { aMarkdown } from "@/lib/contenido-html";

const u = (path: string) => `${SITE_URL}${path}`;
const publicados = <T extends { estado: string }>(filas: T[]) => filas.filter((f) => f.estado === "publicado");

function encabezado(): string {
  return `# ${NEGOCIO.nombre} — Electricistas en Villa Carlos Paz, Córdoba

> ${NEGOCIO.nombre} es una empresa de electricistas con base en Villa Carlos Paz, Córdoba, Argentina, con más de 10 años de experiencia y más de 500 clientes atendidos. Hace instalaciones eléctricas domiciliarias, comerciales e industriales, tableros, reparaciones, mantenimiento, iluminación LED, domótica, cámaras de seguridad y emite el Certificado de Instalación Eléctrica Apta (Ley 10.281 de Córdoba) en Carlos Paz y todo el Valle de Punilla.

- Teléfono y WhatsApp: ${NEGOCIO.telefonoInternacional} (https://wa.me/${NEGOCIO.whatsapp})
- Horario: ${NEGOCIO.horarioTexto}.
- Zona de cobertura: ${LOCALIDADES.map((l) => l.nombre).join(", ")} y el resto del Valle de Punilla, Córdoba, Argentina.
- Presupuesto sin cargo: ${u("/presupuesto")}
- Todos los trabajos tienen garantía.`;
}

export async function generarLlmsTxt(): Promise<string> {
  const [posts, zonas, proyectos] = await Promise.all([getPosts(), getZonas(), getProyectosConRelaciones()]);

  const secciones = [
    encabezado(),
    `## Servicios

${SERVICIOS.map((s) => `- [${s.nombre}](${u(`/servicios/${s.slug}`)}): ${s.resumen}`).join("\n")}
- [Certificado de Instalación Eléctrica Apta](${u("/certificado-instalacion-electrica-apta")}): Qué es el certificado de la Ley 10.281 de Córdoba, cuándo lo pide la distribuidora y cómo lo emitimos.`,
  ];

  const zonasPub = publicados(zonas);
  if (zonasPub.length) {
    secciones.push(`## Zonas de cobertura

${zonasPub.map((z) => `- [Electricista en ${z.nombre}](${u(`/zonas/${z.slug}`)})${z.seoDescripcion ? `: ${z.seoDescripcion}` : ""}`).join("\n")}`);
  }

  const postsPub = publicados(posts);
  if (postsPub.length) {
    secciones.push(`## Blog

${postsPub.map((p) => `- [${p.titulo}](${u(`/blog/${p.slug}`)}): ${p.extracto}`).join("\n")}`);
  }

  const proyectosPub = publicados(proyectos);
  if (proyectosPub.length) {
    secciones.push(`## Proyectos

${proyectosPub.map((p) => `- [${p.titulo}](${u(`/proyectos/${p.slug}`)})${p.servicio ? `: ${p.servicio.nombre}` : ""}`).join("\n")}`);
  }

  secciones.push(`## Optional

- [Contenido completo para IA](${u("/llms-full.txt")}): Todos los artículos, zonas y preguntas frecuentes en un solo archivo.
- [Sobre nosotros](${u("/about")}): Quiénes somos y cómo trabajamos.
- [Contacto](${u("/contacto")}): WhatsApp, teléfono y formulario.
- [Política de privacidad](${u("/politica-de-privacidad")})`);

  return secciones.join("\n\n") + "\n";
}

// Preguntas frecuentes del certificado: se repiten acá para que las IA tengan la respuesta completa.
const FAQ_CERTIFICADO = [
  ["¿Qué es el Certificado de Instalación Eléctrica Apta?", "Es el documento que establece la Ley provincial 10.281 de Seguridad Eléctrica de Córdoba. Lo emite y firma un instalador electricista habilitado e indica que la instalación cumple con la normativa técnica del ERSeP."],
  ["¿Cuándo lo piden?", "Para pedir un suministro nuevo, para cambios de potencia y cuando un cambio de titularidad incluye pasar de monofásico a trifásico o al revés. Los locales de acceso público deben tener su instalación adecuada a la normativa."],
  ["¿Dónde se presenta?", "Ante la distribuidora de energía del domicilio: EPEC o la cooperativa eléctrica local."],
  ["¿Voltis lo emite?", `Sí, en Carlos Paz y todo el Valle de Punilla. Consultas al ${NEGOCIO.telefonoInternacional}.`],
];

export async function generarLlmsFull(): Promise<string> {
  const [posts, zonas, proyectos] = await Promise.all([getPosts(), getZonas(), getProyectosConRelaciones()]);
  const partes = [
    encabezado(),
    `## Servicios\n\n${SERVICIOS.map((s) => `### ${s.nombre}\n\n${s.resumen}\n\nMás información: ${u(`/servicios/${s.slug}`)}`).join("\n\n")}`,
    `## Certificado de Instalación Eléctrica Apta (Ley 10.281)\n\n${FAQ_CERTIFICADO.map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}\n\nMás información: ${u("/certificado-instalacion-electrica-apta")}`,
  ];

  for (const z of publicados(zonas)) {
    partes.push(`## Electricista en ${z.nombre}\n\nURL: ${u(`/zonas/${z.slug}`)}\n\n${aMarkdown(z.texto)}`);
  }
  for (const p of publicados(posts)) {
    partes.push(`## ${p.titulo}\n\nURL: ${u(`/blog/${p.slug}`)}\n\n${aMarkdown(p.contenido)}`);
  }
  for (const p of publicados(proyectos)) {
    partes.push(`## Proyecto: ${p.titulo}\n\nURL: ${u(`/proyectos/${p.slug}`)}\n\n${aMarkdown(p.descripcion)}`);
  }
  return partes.join("\n\n---\n\n") + "\n";
}
