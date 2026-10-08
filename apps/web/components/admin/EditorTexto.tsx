"use client";

import { useEditor, EditorContent, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { marked } from "marked";

// Editor visual tipo WordPress. Guarda HTML; el contenido viejo en Markdown se convierte al abrirlo.
const esHtml = (t: string) => /^\s*<(p|h[1-6]|ul|ol|blockquote|div|hr)[\s>]/i.test(t);

const COLORES = [
  { nombre: "Negro", valor: "#0f172a" },
  { nombre: "Gris", valor: "#64748b" },
  { nombre: "Cobre", valor: "#c4762a" },
  { nombre: "Ámbar", valor: "#d97706" },
  { nombre: "Rojo", valor: "#dc2626" },
  { nombre: "Verde", valor: "#16a34a" },
  { nombre: "Azul", valor: "#2563eb" },
];

const TAMANOS = [
  { nombre: "Chica", valor: "14px" },
  { nombre: "Normal", valor: "" },
  { nombre: "Grande", valor: "20px" },
  { nombre: "Muy grande", valor: "26px" },
];

function Boton({
  activo,
  onClick,
  titulo,
  children,
  deshabilitado,
}: {
  activo?: boolean;
  onClick: () => void;
  titulo: string;
  children: React.ReactNode;
  deshabilitado?: boolean;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      disabled={deshabilitado}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-8 h-8 px-2 rounded text-sm grid place-items-center disabled:opacity-40 ${
        activo ? "bg-slate-900 text-white" : "hover:bg-slate-200 text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

const Separador = () => <span className="w-px h-6 bg-slate-300 mx-1" aria-hidden />;

function Barra({ editor }: { editor: Editor }) {
  const e = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      bloque: ed.isActive("heading", { level: 2 })
        ? "h2"
        : ed.isActive("heading", { level: 3 })
          ? "h3"
          : "p",
      negrita: ed.isActive("bold"),
      cursiva: ed.isActive("italic"),
      subrayado: ed.isActive("underline"),
      tachado: ed.isActive("strike"),
      resaltado: ed.isActive("highlight"),
      vinetas: ed.isActive("bulletList"),
      numerada: ed.isActive("orderedList"),
      cita: ed.isActive("blockquote"),
      link: ed.isActive("link"),
      alineacion: (["left", "center", "right"] as const).find((a) => ed.isActive({ textAlign: a })) ?? "left",
      tamano: (ed.getAttributes("textStyle").fontSize as string | undefined) ?? "",
      color: (ed.getAttributes("textStyle").color as string | undefined) ?? "",
      deshacer: ed.can().undo(),
      rehacer: ed.can().redo(),
    }),
  });

  const c = () => editor.chain().focus();

  function link() {
    const actual = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Dirección del link (ej.: /servicios/tableros-electricos o https://...)", actual ?? "");
    if (url === null) return;
    if (url.trim() === "") c().extendMarkRange("link").unsetLink().run();
    else c().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div
      role="toolbar"
      aria-label="Formato de texto"
      className="flex flex-wrap items-center gap-1 border-b border-slate-300 bg-slate-50 p-2 sticky top-0 z-10 rounded-t"
    >
      <select
        aria-label="Tipo de texto"
        className="h-8 border border-slate-300 rounded px-2 text-sm bg-white"
        value={e.bloque}
        onChange={(ev) => {
          const v = ev.target.value;
          if (v === "p") c().setParagraph().run();
          else c().toggleHeading({ level: v === "h2" ? 2 : 3 }).run();
        }}
      >
        <option value="p">Párrafo</option>
        <option value="h2">Título</option>
        <option value="h3">Subtítulo</option>
      </select>

      <select
        aria-label="Tamaño de letra"
        className="h-8 border border-slate-300 rounded px-2 text-sm bg-white"
        value={e.tamano}
        onChange={(ev) => (ev.target.value ? c().setFontSize(ev.target.value).run() : c().unsetFontSize().run())}
      >
        {TAMANOS.map((t) => (
          <option key={t.nombre} value={t.valor}>
            {t.nombre}
          </option>
        ))}
      </select>

      <Separador />
      <Boton titulo="Negrita" activo={e.negrita} onClick={() => c().toggleBold().run()}>
        <strong>B</strong>
      </Boton>
      <Boton titulo="Cursiva" activo={e.cursiva} onClick={() => c().toggleItalic().run()}>
        <em className="font-serif">I</em>
      </Boton>
      <Boton titulo="Subrayado" activo={e.subrayado} onClick={() => c().toggleUnderline().run()}>
        <span className="underline">U</span>
      </Boton>
      <Boton titulo="Tachado" activo={e.tachado} onClick={() => c().toggleStrike().run()}>
        <span className="line-through">S</span>
      </Boton>

      <Separador />
      <details className="relative">
        <summary
          className="list-none h-8 px-2 rounded hover:bg-slate-200 text-sm grid place-items-center cursor-pointer"
          title="Color de texto"
          aria-label="Color de texto"
        >
          <span className="font-bold" style={{ color: e.color || "#0f172a", borderBottom: `3px solid ${e.color || "#0f172a"}` }}>
            A
          </span>
        </summary>
        <div className="absolute z-20 mt-1 bg-white border border-slate-300 rounded shadow-lg p-2 grid grid-cols-4 gap-1 w-40">
          {COLORES.map((col) => (
            <button
              key={col.valor}
              type="button"
              title={col.nombre}
              aria-label={`Color ${col.nombre}`}
              onMouseDown={(ev) => ev.preventDefault()}
              onClick={(ev) => {
                c().setColor(col.valor).run();
                (ev.currentTarget.closest("details") as HTMLDetailsElement).open = false;
              }}
              className="w-8 h-8 rounded border border-slate-200"
              style={{ background: col.valor }}
            />
          ))}
          <button
            type="button"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={(ev) => {
              c().unsetColor().run();
              (ev.currentTarget.closest("details") as HTMLDetailsElement).open = false;
            }}
            className="col-span-4 text-xs border border-slate-300 rounded py-1 hover:bg-slate-50"
          >
            Sin color
          </button>
        </div>
      </details>
      <Boton titulo="Resaltar" activo={e.resaltado} onClick={() => c().toggleHighlight().run()}>
        <span className="bg-yellow-200 px-1 rounded-sm">ab</span>
      </Boton>

      <Separador />
      <Boton titulo="Lista con viñetas" activo={e.vinetas} onClick={() => c().toggleBulletList().run()}>
        •≡
      </Boton>
      <Boton titulo="Lista numerada" activo={e.numerada} onClick={() => c().toggleOrderedList().run()}>
        1.
      </Boton>
      <Boton titulo="Recuadro destacado" activo={e.cita} onClick={() => c().toggleBlockquote().run()}>
        ❝
      </Boton>
      <Boton titulo="Línea divisoria" onClick={() => c().setHorizontalRule().run()}>
        ―
      </Boton>

      <Separador />
      {(["left", "center", "right"] as const).map((a) => (
        <Boton
          key={a}
          titulo={{ left: "Alinear a la izquierda", center: "Centrar", right: "Alinear a la derecha" }[a]}
          activo={e.alineacion === a}
          onClick={() => c().setTextAlign(a).run()}
        >
          {{ left: "⇤", center: "↔", right: "⇥" }[a]}
        </Boton>
      ))}

      <Separador />
      <Boton titulo="Link" activo={e.link} onClick={link}>
        🔗
      </Boton>
      <Boton titulo="Quitar formato" onClick={() => c().unsetAllMarks().clearNodes().run()}>
        ⌫
      </Boton>

      <Separador />
      <Boton titulo="Deshacer" deshabilitado={!e.deshacer} onClick={() => c().undo().run()}>
        ↶
      </Boton>
      <Boton titulo="Rehacer" deshabilitado={!e.rehacer} onClick={() => c().redo().run()}>
        ↷
      </Boton>
    </div>
  );
}

export default function EditorTexto({
  valor,
  onChange,
  alto = 320,
  etiqueta,
}: {
  valor: string;
  onChange: (html: string) => void;
  alto?: number;
  etiqueta: string;
}) {
  const editor = useEditor({
    // Next.js renderiza en el servidor: el editor se monta recién en el navegador.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TextStyleKit.configure({ backgroundColor: false, fontFamily: false, lineHeight: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    content: esHtml(valor) ? valor : (marked.parse(valor || "", { async: false }) as string),
    editorProps: {
      attributes: {
        class: "contenido-rico max-w-none p-4 focus:outline-none",
        style: `min-height:${alto}px`,
        "aria-label": etiqueta,
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.isEmpty ? "" : ed.getHTML()),
  });

  if (!editor) {
    return <div className="border border-slate-300 rounded bg-white" style={{ minHeight: alto + 50 }} />;
  }

  return (
    <div className="border border-slate-300 rounded bg-white focus-within:ring-2 focus-within:ring-amber-400">
      <Barra editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
