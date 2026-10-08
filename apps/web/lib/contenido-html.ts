// El contenido de posts, proyectos y zonas se guarda como HTML (editor visual del panel).
// Lo cargado antes está en Markdown: se detecta y se convierte al vuelo, sin migrar la base.
// Este archivo corre solo en el servidor (build): sanitize-html y turndown no van al navegador.
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";

export function esHtml(texto: string): boolean {
  return /^\s*<(p|h[1-6]|ul|ol|blockquote|div|hr)[\s>]/i.test(texto);
}

export function aHtml(texto: string): string {
  return esHtml(texto) ? texto : (marked.parse(texto, { async: false }) as string);
}

const COLOR = [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i];

// Solo lo que produce el editor del panel. Nada de scripts, iframes ni atributos on*.
const OPCIONES: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "mark", "span",
    "ul", "ol", "li", "blockquote", "hr", "a", "table", "thead", "tbody", "tr", "th", "td", "code",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    "*": ["style", "class"],
  },
  allowedClasses: { blockquote: ["alerta"] },
  allowedStyles: {
    "*": {
      color: COLOR,
      "background-color": COLOR,
      "font-size": [/^\d{1,2}px$/],
      "text-align": [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    // Links externos en pestaña nueva y sin pasar autoridad de SEO.
    a: (tag, attribs) => {
      const externo = /^https?:\/\//.test(attribs.href ?? "");
      return {
        tagName: "a",
        attribs: externo ? { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" } : attribs,
      };
    },
  },
};

// Recuadros que empiezan con ⚠️ se muestran en rojo, como en el contenido original.
function marcarAlertas(html: string): string {
  return html.replace(/<blockquote>((?:(?!<\/blockquote>)[\s\S])*?⚠️[\s\S]*?)<\/blockquote>/g, '<blockquote class="alerta">$1</blockquote>');
}

export function htmlSeguro(texto: string): string {
  return sanitizeHtml(marcarAlertas(aHtml(texto)), OPCIONES);
}

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });

// Para llms-full.txt: texto legible para IA, sin estilos.
export function aMarkdown(texto: string): string {
  return esHtml(texto) ? turndown.turndown(htmlSeguro(texto)) : texto;
}

export function textoPlano(texto: string, max = 155): string {
  const plano = aMarkdown(texto)
    .replace(/[#*>_`[\]]/g, "")
    .replace(/\(\/[^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plano.length > max ? `${plano.slice(0, max - 1).trimEnd()}…` : plano;
}
