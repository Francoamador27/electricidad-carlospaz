"use client";

import { useEffect, useState } from "react";
import { CLAVES_CONFIG, CONFIG_CAMPOS, type ConfigSitio } from "@voltis/shared";
import { Boton, Campo, Cargando, MensajeError, Tarjeta, Titulo, claseInput, errorDe } from "@/components/admin/ui";
import { adminApi, ErrorApi, mensajeError } from "@/lib/admin-api";

const GUIAS: Record<string, string[]> = {
  gtm_id: [
    "Entrá a tagmanager.google.com y creá una cuenta y un contenedor de tipo Web.",
    "Copiá el ID que empieza con GTM- y pegalo acá.",
    "Dentro de GTM agregá la etiqueta de Google Analytics 4 (y la de Google Ads o el Pixel de Meta cuando los uses).",
    "Los eventos del sitio ya llegan a GTM: click_whatsapp, click_telefono, generate_lead y ver_proyecto.",
  ],
  google_site_verification: [
    "En search.google.com/search-console agregá la propiedad con prefijo de URL.",
    'Elegí el método "Etiqueta HTML" y copiá solo el valor de content="...".',
    'Guardá acá, tocá "Publicar cambios", esperá 2 minutos y apretá "Verificar" en Search Console.',
    "Después enviá el sitemap: /sitemap.xml.",
  ],
  meta_domain_verification: [
    "En business.facebook.com → Configuración → Seguridad de la marca → Dominios, agregá tu dominio.",
    'Elegí "Etiqueta meta" y copiá solo el valor de content="...".',
    "Guardá, publicá y verificá en Meta.",
  ],
  bing_site_verification: [
    "En bing.com/webmasters agregá el sitio (podés importarlo desde Search Console).",
    'Si te pide etiqueta, copiá el valor de content="..." de msvalidate.01.',
    "Bing es la fuente de búsqueda de ChatGPT y Copilot: conviene tenerlo verificado.",
  ],
};

export default function ConfiguracionPage() {
  const [valores, setValores] = useState<ConfigSitio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorApi, setErrorApi] = useState<ErrorApi | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    adminApi<ConfigSitio>("/config").then(setValores).catch((e) => setError(mensajeError(e)));
  }, []);

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!valores) return;
    setGuardando(true);
    setError(null);
    setErrorApi(null);
    try {
      const cuerpo = Object.fromEntries(CLAVES_CONFIG.map((k) => [k, (valores[k] ?? "").trim()]));
      setValores(await adminApi<ConfigSitio>("/config", { method: "PUT", body: JSON.stringify(cuerpo) }));
      setGuardado(true);
    } catch (e) {
      setError(mensajeError(e));
      if (e instanceof ErrorApi) setErrorApi(e);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <Titulo>Configuración</Titulo>
      <p className="text-sm text-slate-600 mb-6">
        Estos datos se aplican al sitio cuando tocás <strong>Publicar cambios</strong>.
      </p>
      <MensajeError texto={error} />
      {!valores && !error && <Cargando />}

      {valores && (
        <form onSubmit={guardar} className="space-y-4">
          {CLAVES_CONFIG.map((k) => (
            <Tarjeta key={k} className="space-y-3">
              <Campo label={CONFIG_CAMPOS[k].label} ayuda={CONFIG_CAMPOS[k].ayuda} error={errorDe(errorApi, k)}>
                <input
                  className={`${claseInput} font-mono`}
                  value={valores[k] ?? ""}
                  onChange={(e) => {
                    setGuardado(false);
                    setValores({ ...valores, [k]: e.target.value });
                  }}
                  spellCheck={false}
                />
              </Campo>
              <details className="text-sm text-slate-600">
                <summary className="cursor-pointer">Cómo conseguirlo</summary>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  {GUIAS[k].map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
              </details>
            </Tarjeta>
          ))}
          <div className="flex items-center gap-3">
            <Boton type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</Boton>
            {guardado && <span className="text-sm text-green-700">Guardado. Tocá &quot;Publicar cambios&quot; para aplicarlo.</span>}
          </div>
        </form>
      )}
    </div>
  );
}
