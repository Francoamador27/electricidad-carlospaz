import { expect, test } from "@playwright/test";
import { aMarkdown, htmlSeguro, textoPlano } from "../lib/contenido-html";

// Tests del sanitizador del contenido del editor (corren en Node, sin navegador).

test("bloquea scripts, eventos e iframes", () => {
  const sucio =
    '<p>Hola<script>alert(1)</script></p><p onclick="robar()">click</p><iframe src="https://malo.com"></iframe><a href="javascript:alert(1)">x</a>';
  const limpio = htmlSeguro(sucio);
  expect(limpio).not.toContain("<script");
  expect(limpio).not.toContain("onclick");
  expect(limpio).not.toContain("<iframe");
  expect(limpio).not.toContain("javascript:");
  expect(limpio).toContain("<p>Hola</p>");
});

test("conserva color, tamaño, alineación y resaltado del editor", () => {
  const html =
    '<p style="text-align: center"><span style="color: #dc2626; font-size: 20px">rojo</span> <mark>resaltado</mark></p>';
  const limpio = htmlSeguro(html);
  expect(limpio).toContain("text-align:center");
  expect(limpio).toContain("color:#dc2626");
  expect(limpio).toContain("font-size:20px");
  expect(limpio).toContain("<mark>resaltado</mark>");
});

test("descarta estilos peligrosos o fuera de lo permitido", () => {
  const limpio = htmlSeguro('<p><span style="position: fixed; background-image: url(https://x.com/a.png); color: red">x</span></p>');
  expect(limpio).not.toContain("position");
  expect(limpio).not.toContain("url(");
});

test("los links externos abren en pestaña nueva con nofollow", () => {
  const limpio = htmlSeguro('<p><a href="https://otro.com">a</a> <a href="/servicios">b</a></p>');
  expect(limpio).toContain('href="https://otro.com" target="_blank" rel="noopener noreferrer nofollow"');
  expect(limpio).toContain('<a href="/servicios">b</a>');
});

test("el Markdown viejo se convierte a HTML y los avisos ⚠️ quedan en rojo", () => {
  const limpio = htmlSeguro("## Título\n\n> **⚠️ Importante:** cuidado");
  expect(limpio).toContain("<h2>Título</h2>");
  expect(limpio).toContain('<blockquote class="alerta">');
});

test("el HTML se pasa a texto para llms-full.txt y descripciones", () => {
  const html = "<h2>Pasos</h2><ul><li><p><strong>Uno</strong></p></li></ul>";
  expect(aMarkdown(html)).toContain("## Pasos");
  expect(aMarkdown(html)).toContain("**Uno**");
  expect(textoPlano(html)).toBe("Pasos - Uno");
});
