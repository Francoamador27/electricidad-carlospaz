// Datos del negocio: única fuente para header, footer, CTA, JSON-LD y la API.

export const NEGOCIO = {
  nombre: "Voltis",
  telefono: "+5493513873029",
  telefonoVisible: "(351) 387-3029",
  telefonoInternacional: "+54 9 351 387-3029",
  whatsapp: "5493513873029",
  localidadBase: "Villa Carlos Paz",
  horario: [
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "08:00", cierra: "18:00" },
    { dias: ["Saturday"], abre: "08:00", cierra: "13:00" },
  ],
} as const;

export function linkWhatsapp(texto?: string): string {
  const base = `https://wa.me/${NEGOCIO.whatsapp}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

export const LINK_TELEFONO = `tel:${NEGOCIO.telefono}`;

// El contenido de cada servicio vive en apps/web/app/servicios/<slug>.
export const SERVICIOS = [
  { slug: "instalaciones-domiciliarias", nombre: "Instalaciones domiciliarias" },
  { slug: "instalaciones-empresariales", nombre: "Instalaciones para empresas" },
  { slug: "tableros-electricos", nombre: "Tableros eléctricos" },
  { slug: "reparaciones-electricas", nombre: "Reparaciones eléctricas" },
  { slug: "mantenimiento-electricidad", nombre: "Mantenimiento eléctrico" },
  { slug: "iluminacion-automatizacion", nombre: "Iluminación y automatización" },
] as const;

// Lista inicial para el seed. Después se administran desde el panel.
export const LOCALIDADES = [
  { slug: "villa-carlos-paz", nombre: "Villa Carlos Paz" },
  { slug: "san-antonio-de-arredondo", nombre: "San Antonio de Arredondo" },
  { slug: "mayu-sumaj", nombre: "Mayu Sumaj" },
  { slug: "icho-cruz", nombre: "Icho Cruz" },
  { slug: "cuesta-blanca", nombre: "Cuesta Blanca" },
  { slug: "tala-huasi", nombre: "Tala Huasi" },
  { slug: "malagueno", nombre: "Malagueño" },
  { slug: "tanti", nombre: "Tanti" },
  { slug: "bialet-masse", nombre: "Bialet Massé" },
  { slug: "santa-maria-de-punilla", nombre: "Santa María de Punilla" },
  { slug: "cosquin", nombre: "Cosquín" },
  { slug: "valle-hermoso", nombre: "Valle Hermoso" },
  { slug: "la-falda", nombre: "La Falda" },
  { slug: "la-cumbre", nombre: "La Cumbre" },
] as const;
