// Datos de la agenda en el panel: tipos, pedidos a la API y copia para ver sin conexión.
import type { FotoInput } from "@voltis/shared";
import type { EstadoTrabajo, MedioPago } from "@voltis/shared/agenda";
import { adminApi, ErrorApi } from "@/lib/admin-api";

export type Trabajo = {
  id: number;
  titulo: string;
  servicioId: number | null;
  servicio: string | null;
  clienteNombre: string;
  clienteTelefono: string | null;
  direccion: string | null;
  zonaId: number | null;
  zona: string | null;
  localidadOtra: string | null;
  mapsUrl: string | null;
  lat: number | null;
  lng: number | null;
  descripcion: string | null;
  notas: string | null;
  quienVa: string | null;
  inicio: string;
  fin: string;
  todoElDia: boolean;
  precioCentavos: number | null;
  estado: EstadoTrabajo;
  consultaId: number | null;
  proyectoId: number | null;
  fotos: FotoInput[];
  recordatorioMin: number | null;
  pagadoCentavos: number;
  gastadoCentavos: number;
};

export type Pago = { id: number; fecha: string; montoCentavos: number; medio: MedioPago; nota: string | null };
export type Gasto = { id: number; fecha: string; descripcion: string; montoCentavos: number };
export type TrabajoDetalle = Trabajo & { pagos: Pago[]; gastos: Gasto[] };

export function localidad(t: Pick<Trabajo, "zona" | "localidadOtra">): string | null {
  return t.zona ?? t.localidadOtra ?? null;
}

// ---------- Sin conexión ----------
// Se guarda la última consulta de la agenda en el teléfono (decisión de Franco: ver la agenda
// en la sierra sin señal). Solo lo que ya se vio, nunca se envían datos desde acá.

const CLAVE_COPIA = "voltis-agenda-copia";

type Copia = { desde: string; hasta: string; guardada: string; trabajos: Trabajo[] };

function guardarCopia(c: Copia) {
  try {
    localStorage.setItem(CLAVE_COPIA, JSON.stringify(c));
  } catch {
    // Sin almacenamiento disponible: no hay copia sin conexión, no pasa nada más.
  }
}

function leerCopia(): Copia | null {
  try {
    const raw = localStorage.getItem(CLAVE_COPIA);
    return raw ? (JSON.parse(raw) as Copia) : null;
  } catch {
    return null;
  }
}

export type ResultadoAgenda = { trabajos: Trabajo[]; sinConexion: false } | { trabajos: Trabajo[]; sinConexion: true; guardada: string };

export async function cargarAgenda(desde: string, hasta: string): Promise<ResultadoAgenda> {
  try {
    const trabajos = await adminApi<Trabajo[]>(`/trabajos?desde=${desde}&hasta=${hasta}`);
    guardarCopia({ desde, hasta, guardada: new Date().toISOString(), trabajos });
    return { trabajos, sinConexion: false };
  } catch (e) {
    // Error del servidor (no de red): que lo maneje la pantalla.
    if (e instanceof ErrorApi) throw e;
    const copia = leerCopia();
    if (!copia) throw e;
    // Se muestran los trabajos guardados que caen en el rango pedido.
    const enRango = copia.trabajos.filter((t) => t.inicio.slice(0, 10) <= hasta && t.fin.slice(0, 10) >= desde);
    return { trabajos: enRango, sinConexion: true, guardada: copia.guardada };
  }
}

export function borrarCopiaSinConexion() {
  try {
    localStorage.removeItem(CLAVE_COPIA);
  } catch {
    // nada
  }
}
