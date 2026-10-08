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

// El contenido de cada servicio vive en apps/web/app/(sitio)/servicios/<slug>.
// `resumen` se usa en llms.txt y en listados.
export const SERVICIOS = [
  {
    slug: "instalaciones-domiciliarias",
    nombre: "Instalaciones domiciliarias",
    resumen: "Instalaciones eléctricas completas para viviendas y obra nueva: cañerías, cableado, tomas, tablero con disyuntor diferencial y puesta a tierra.",
  },
  {
    slug: "instalaciones-empresariales",
    nombre: "Instalaciones para empresas",
    resumen: "Instalaciones para locales, oficinas, gastronomía, hoteles e industrias: tableros trifásicos y circuitos de alta potencia.",
  },
  {
    slug: "tableros-electricos",
    nombre: "Tableros eléctricos",
    resumen: "Instalación y actualización de tableros: reemplazo de fusibles por termomagnéticas y disyuntor diferencial de 30 mA.",
  },
  {
    slug: "reparaciones-electricas",
    nombre: "Reparaciones eléctricas",
    resumen: "Diagnóstico y reparación de cortocircuitos, enchufes quemados, diferenciales que saltan y fallas eléctricas.",
  },
  {
    slug: "mantenimiento-electricidad",
    nombre: "Mantenimiento eléctrico",
    resumen: "Revisiones preventivas de la instalación con informe del estado, para casas, comercios y complejos turísticos.",
  },
  {
    slug: "iluminacion-automatizacion",
    nombre: "Iluminación y automatización",
    resumen: "Iluminación LED interior y exterior, sensores de movimiento y domótica para manejar luces y equipos desde el celular.",
  },
  {
    slug: "camaras-de-seguridad",
    nombre: "Instalación de cámaras de seguridad",
    resumen: "Cámaras de seguridad para casas y comercios con cableado protegido, alimentación segura y acceso desde el celular.",
  },
] as const;

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
