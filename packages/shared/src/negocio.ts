// Datos del negocio: única fuente para header, footer, CTA, JSON-LD y la API.

export const NEGOCIO = {
  nombre: "Voltis",
  telefono: "+5493513873029",
  telefonoVisible: "(351) 387-3029",
  telefonoInternacional: "+54 9 351 387-3029",
  whatsapp: "5493513873029",
  localidadBase: "Villa Carlos Paz",
  horario: [
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "08:00", cierra: "19:00" },
    { dias: ["Saturday"], abre: "08:00", cierra: "13:00" },
  ],
  horarioTexto: "de lunes a viernes de 8 a 19 h y sábados de 8 a 13 h",
  horarioLineas: ["Lunes a viernes: 8:00 – 19:00", "Sábados: 8:00 – 13:00"],
} as const;

export function linkWhatsapp(texto?: string): string {
  const base = `https://wa.me/${NEGOCIO.whatsapp}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

export const LINK_TELEFONO = `tel:${NEGOCIO.telefono}`;

// Formulario para dejar una reseña en el Perfil de Empresa de Google.
export const LINK_RESENA_GOOGLE = "https://g.page/r/CZpXAOJBokL8EBM/review";

// Mensaje de WhatsApp para pedirle la reseña a un cliente.
export function textoPedirResena(nombre?: string | null): string {
  const saludo = nombre?.trim() ? `Hola ${nombre.trim().split(" ")[0]}!` : "Hola!";
  return `${saludo} Gracias por confiar en ${NEGOCIO.nombre}. Si quedaste conforme con el trabajo, ¿nos dejarías tu opinión en Google? Nos ayuda muchísimo y lleva menos de un minuto: ${LINK_RESENA_GOOGLE}`;
}

export const MENSAJE_WHATSAPP = "Hola, necesito un electricista";
export const MENSAJE_COMERCIOS = "Hola, tengo un local y necesito un electricista";

// El contenido de cada landing vive en apps/web/lib/servicios.ts.
// El orden es el de los listados; `principal: false` son los servicios secundarios.
// `resumen` se usa en llms.txt; `whatsapp` es el mensaje precargado de la página.
export const SERVICIOS = [
  {
    slug: "reparaciones-electricas",
    nombre: "Arreglos y fallas eléctricas",
    corto: "Arreglos y fallas",
    principal: true,
    resumen: "Saltan las térmicas, enchufes que no andan, cortes parciales y cortocircuitos en casas y comercios.",
    whatsapp: "Hola, tengo una falla eléctrica y necesito un electricista",
  },
  {
    slug: "agregados-electricos",
    nombre: "Agregados: tomacorrientes, bocas de luz y ventiladores de techo",
    corto: "Agregados",
    principal: true,
    resumen: "Tomacorrientes y bocas de luz nuevos e instalación de ventiladores de techo.",
    whatsapp: "Hola, quiero agregar tomacorrientes o bocas de luz",
  },
  {
    slug: "tableros-electricos",
    nombre: "Tableros eléctricos",
    corto: "Tableros eléctricos",
    principal: true,
    resumen: "Actualización de tableros, disyuntor diferencial y térmicas.",
    whatsapp: "Hola, necesito revisar o actualizar mi tablero eléctrico",
  },
  {
    slug: "locales-comerciales",
    nombre: "Locales comerciales",
    corto: "Locales comerciales",
    principal: true,
    resumen: "Adecuación eléctrica, iluminación, tablero y certificado para la habilitación municipal.",
    whatsapp: MENSAJE_COMERCIOS,
  },
  {
    slug: "instalaciones-domiciliarias",
    nombre: "Instalación completa (obra nueva o reforma)",
    corto: "Instalación completa",
    principal: true,
    resumen: "Instalación eléctrica completa para obra nueva o reforma: cañerías, cableado, tablero y puesta a tierra.",
    whatsapp: "Hola, necesito una instalación eléctrica completa para una obra o reforma",
  },
  {
    slug: "instalacion-ventilador-de-techo",
    nombre: "Instalación de ventilador de techo",
    corto: "Ventiladores de techo",
    principal: false,
    resumen: "Fijación, conexión y puesta en marcha de ventiladores de techo.",
    whatsapp: "Hola, quiero instalar un ventilador de techo",
  },
  {
    slug: "mantenimiento-electricidad",
    nombre: "Mantenimiento eléctrico",
    corto: "Mantenimiento",
    principal: false,
    resumen: "Revisión de la instalación de casas y comercios.",
    whatsapp: "Hola, quiero revisar mi instalación eléctrica",
  },
  {
    slug: "iluminacion-automatizacion",
    nombre: "Iluminación y automatización",
    corto: "Iluminación y domótica",
    principal: false,
    resumen: "Iluminación LED interior y exterior, sensores de movimiento y automatización.",
    whatsapp: "Hola, necesito instalar iluminación",
  },
  {
    slug: "camaras-de-seguridad",
    nombre: "Instalación de cámaras de seguridad",
    corto: "Cámaras de seguridad",
    principal: false,
    resumen: "Cámaras para casas y comercios con cableado protegido y acceso desde el celular.",
    whatsapp: "Hola, quiero instalar cámaras de seguridad",
  },
] as const;

// Trabajos de la home: los destacados o, si no hay, los más recientes.
export function proyectosDePortada<T extends { destacado: boolean }>(proyectos: T[]): T[] {
  const destacados = proyectos.filter((p) => p.destacado);
  return (destacados.length ? destacados : proyectos).slice(0, 3);
}

// Slugs viejos que pueden seguir en la base: se resuelven al servicio actual.
export const SLUGS_ANTERIORES: Record<string, string> = {
  "instalaciones-empresariales": "locales-comerciales",
};

// Mensaje precargado según la página (barra fija y botón flotante).
export function mensajeWhatsappDeRuta(ruta: string): string {
  if (ruta.startsWith("/comercios")) return MENSAJE_COMERCIOS;
  const servicio = SERVICIOS.find((s) => ruta === `/servicios/${s.slug}`);
  return servicio?.whatsapp ?? MENSAJE_WHATSAPP;
}

// Lista inicial para el seed. Después se administran desde el panel.
export const LOCALIDADES = [
  { slug: "villa-carlos-paz", nombre: "Villa Carlos Paz" },
  { slug: "san-antonio-de-arredondo", nombre: "San Antonio de Arredondo" },
  { slug: "mayu-sumaj", nombre: "Mayu Sumaj" },
  { slug: "icho-cruz", nombre: "Icho Cruz" },
  { slug: "cuesta-blanca", nombre: "Cuesta Blanca" },
  { slug: "tala-huasi", nombre: "Tala Huasi" },
  { slug: "cabalango", nombre: "Cabalango" },
  { slug: "malagueno", nombre: "Malagueño" },
  { slug: "tanti", nombre: "Tanti" },
  { slug: "bialet-masse", nombre: "Bialet Massé" },
  { slug: "santa-maria-de-punilla", nombre: "Santa María de Punilla" },
  { slug: "cosquin", nombre: "Cosquín" },
  { slug: "valle-hermoso", nombre: "Valle Hermoso" },
  { slug: "la-falda", nombre: "La Falda" },
  { slug: "la-cumbre", nombre: "La Cumbre" },
] as const;
