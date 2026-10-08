import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type Nodo = { type: string; value?: string; children?: Nodo[] };

function textoDe(nodo?: Nodo): string {
  if (!nodo) return "";
  if (nodo.type === "text") return nodo.value ?? "";
  return (nodo.children ?? []).map(textoDe).join("");
}

// Mismos estilos que tenían los posts cuando estaban escritos en JSX.
const componentes: Components = {
  p: ({ children }) => <p className="text-slate-700 mb-6 leading-relaxed">{children}</p>,
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="font-bold text-slate-900 text-lg mt-6 mb-2">{children}</h3>,
  ul: ({ children }) => (
    <ul className="space-y-2 mb-8 [&>li]:flex [&>li]:gap-3 [&>li]:before:content-['✓'] [&>li]:before:text-amber-500 [&>li]:before:font-bold">
      {children}
    </ul>
  ),
  ol: ({ children }) => <ol className="space-y-4 mb-8 list-decimal pl-6 marker:text-amber-500 marker:font-bold">{children}</ol>,
  li: ({ children }) => <li className="text-slate-700 leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="text-slate-900">{children}</strong>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-amber-600 hover:underline font-medium">
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">
        {children}
      </a>
    ),
  blockquote: ({ children, node }) => {
    const alerta = textoDe(node as unknown as Nodo).includes("⚠️");
    return (
      <div
        className={`rounded-xl p-6 my-8 border [&_p]:mb-0 [&_p]:text-sm [&_h3]:mt-0 ${
          alerta
            ? "bg-red-50 border-red-200 [&_p]:text-red-700 [&_strong]:text-red-800"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        {children}
      </div>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-900 text-white">{children}</thead>,
  th: ({ children, style }) => <th className="px-4 py-3 text-left" style={style}>{children}</th>,
  td: ({ children, style }) => (
    <td className="px-4 py-3 border-b border-slate-200" style={style}>
      {children}
    </td>
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
