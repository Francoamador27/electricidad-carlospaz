import { htmlSeguro } from "@/lib/contenido-html";

// Contenido de posts, proyectos y zonas (HTML del editor o Markdown viejo), ya sanitizado.
export default function Contenido({ texto }: { texto: string }) {
  return <div className="contenido-rico" dangerouslySetInnerHTML={{ __html: htmlSeguro(texto) }} />;
}
