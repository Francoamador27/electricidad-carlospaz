import type { Consulta } from "@voltis/shared";
import { linkWhatsapp } from "@voltis/shared/negocio";
import { API_URL, contextoPagina, leerAtribucion, registrarClic, track } from "@/lib/tracking";

type DatosConsulta = Omit<Consulta, "paginaOrigen" | "atribucion" | "turnstileToken" | "empresa">;

// Guarda la consulta en la API y después abre WhatsApp con el mensaje armado.
// La pestaña se abre en el mismo clic (antes del await) para que el navegador no la
// bloquee como popup. Si la API falla, WhatsApp se abre igual: no se pierde el contacto.
export async function enviarConsulta(
  form: HTMLFormElement,
  datos: DatosConsulta,
  textoWhatsapp: string,
): Promise<boolean> {
  const ventana = window.open("", "_blank");
  const extra = new FormData(form);

  let guardada = false;
  try {
    const res = await fetch(`${API_URL}/api/consultas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...datos,
        paginaOrigen: window.location.pathname,
        atribucion: leerAtribucion(),
        turnstileToken: extra.get("cf-turnstile-response") ?? undefined,
        empresa: extra.get("empresa") ?? undefined,
      }),
      signal: AbortSignal.timeout(8000),
    });
    guardada = res.ok;
  } catch {
    guardada = false;
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
