import type { Consulta } from "@voltis/shared";
import { linkWhatsapp } from "@voltis/shared/negocio";
import { API_URL, contextoPagina, leerAtribucion, registrarClic, track } from "@/lib/tracking";

type DatosConsulta = Omit<Consulta, "paginaOrigen" | "atribucion" | "turnstileToken" | "empresa">;

// Guarda la consulta en la API y después abre WhatsApp con el mensaje armado.
// La pestaña se abre en el mismo clic (antes del await) para que el navegador no la
// bloquee como popup. Si la API falla, WhatsApp se abre igual: no se pierde el contacto.
// Sin token del antispam (Turnstile) no se llama a la API, que la rechazaría: se va directo
// a WhatsApp con los datos en el mensaje.
export async function enviarConsulta(
  form: HTMLFormElement,
  datos: DatosConsulta,
  textoWhatsapp: string,
): Promise<boolean> {
  const ventana = window.open("", "_blank");
  const extra = new FormData(form);
  const token = extra.get("cf-turnstile-response");
  const sinToken = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) && !token;

  let guardada = false;
  if (!sinToken) {
    try {
      const res = await fetch(`${API_URL}/api/consultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...datos,
          paginaOrigen: window.location.pathname,
          atribucion: leerAtribucion(),
          turnstileToken: token ?? undefined,
          empresa: extra.get("empresa") ?? undefined,
        }),
        signal: AbortSignal.timeout(8000),
      });
      guardada = res.ok;
    } catch {
      guardada = false;
    }
  }

  if (guardada) {
    track("generate_lead", {
      ...contextoPagina(),
      servicio: datos.servicio,
      zona: datos.localidad,
    });
  } else {
    registrarClic("click_whatsapp");
  }

  const url = linkWhatsapp(textoWhatsapp);
  if (ventana) {
    ventana.opener = null;
    ventana.location.href = url;
  } else {
    window.location.href = url;
  }
  return guardada;
}
