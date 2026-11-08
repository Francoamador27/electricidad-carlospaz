// Contenido de cada landing de servicio (/servicios/<slug>). El H1 coincide con lo que la
// gente busca, para que la página funcione sola como destino de un anuncio.
// Slug, nombre y mensaje de WhatsApp viven en @voltis/shared/negocio.
import { NEGOCIO, SERVICIOS } from "@voltis/shared/negocio";

export type SlugServicio = (typeof SERVICIOS)[number]["slug"];
export type Pregunta = { q: string; a: string };

export type ContenidoServicio = {
  titulo: string;
  descripcion: string;
  etiqueta: string;
  h1: string;
  intro: string;
  incluye: string[];
  detalleTitulo: string;
  detalle: { titulo: string; texto: string }[];
  faq: Pregunta[];
  cierre: string;
};

export const CERTIFICADO_GESTION =
  "Gestionamos el certificado de instalación apta a través de un electricista matriculado";

const ZONA: Pregunta = {
  q: "¿Hasta dónde vas?",
  a: "Trabajo en Carlos Paz y todo el Valle de Punilla: San Antonio de Arredondo, Icho Cruz, Cabalango, Tanti, Bialet Massé, Cosquín, Valle Hermoso, La Falda, La Cumbre y alrededores.",
};

const GARANTIA: Pregunta = {
  q: "¿El trabajo tiene garantía?",
  a: "Sí, te dejo la garantía por escrito. Si aparece un problema vinculado a lo que hice, vuelvo a solucionarlo sin costo.",
};

export const CONTENIDO_SERVICIOS: Record<SlugServicio, ContenidoServicio> = {
  "reparaciones-electricas": {
    titulo: "Arreglos y fallas eléctricas en Carlos Paz",
    descripcion:
      "¿Saltan las térmicas, un enchufe no anda o se cortó la luz en parte de la casa o el local? Busco la falla y la arreglo. Respondo en el día por WhatsApp.",
    etiqueta: "Arreglos y fallas",
    h1: "Arreglos y fallas eléctricas en Carlos Paz",
    intro:
      "Saltan las térmicas, un enchufe dejó de andar o se cortó la luz en una parte de la casa o del local. Contame qué pasa y lo vemos.",
    incluye: [
      "Búsqueda de la falla hasta encontrar la causa",
      "Térmicas y disyuntores que saltan",
      "Enchufes, llaves y tomas que no andan o están quemados",
      "Cortes parciales y cortocircuitos",
    ],
    detalleTitulo: "Lo que me consultan más seguido",
    detalle: [
      {
        titulo: "Salta la térmica al prender un equipo",
        texto: "Puede ser un circuito sobrecargado o una térmica gastada. Reviso la carga y dejo la protección que corresponde.",
      },
      {
        titulo: "Un enchufe chispeó y dejó de andar",
        texto: "Suele ser un contacto flojo o una sobrecarga. No lo sigas usando: lo cambio y reviso el resto del ramal.",
      },
      {
        titulo: "Se fue la luz en una parte de la casa",
        texto: "Busco qué circuito quedó afectado y dónde está el corte, para que no se repita.",
      },
      {
        titulo: "Olor a quemado cerca del tablero",
        texto: "Bajá la llave general y escribime. Hay que revisar antes de volver a dar tensión.",
      },
    ],
    faq: [
      {
        q: "¿Qué hago si salta el disyuntor y no sube?",
        a: "Desenchufá todo lo del circuito y probá una vez. Si vuelve a saltar, o ves que está dañado o caliente, no insistas y escribime.",
      },
      {
        q: "¿Por qué salta el diferencial cuando llueve?",
        a: "Lo más común es humedad en alguna caja, enchufe exterior o luminaria, que genera una fuga. Hay que encontrar el punto y resolverlo.",
      },
      {
        q: "¿Lo arreglás en la primera visita?",
        a: `Muchas fallas sí, pero depende de lo que encuentre. Trabajo ${NEGOCIO.horarioTexto}.`,
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Mandame una foto o contame qué está pasando y te respondo en el día.",
  },

  "agregados-electricos": {
    titulo: "Agregar tomacorrientes, bocas de luz y ventiladores en Carlos Paz",
    descripcion:
      "Agrego tomacorrientes, bocas de luz y ventiladores de techo en casas y comercios de Carlos Paz. Trabajo prolijo y con garantía escrita. Presupuesto sin cargo.",
    etiqueta: "Agregados",
    h1: "Agregar tomacorrientes, bocas de luz y ventiladores en Carlos Paz",
    intro:
      "Te falta un enchufe, querés una luz nueva o colgar un ventilador. Lo agrego sobre la instalación que ya tenés, prolijo y sin romper de más.",
    incluye: [
      "Tomacorrientes nuevos donde los necesites",
      "Bocas de luz y llaves de encendido",
      "Instalación de ventiladores de techo",
      "Revisión del circuito para que soporte lo que sumás",
    ],
    detalleTitulo: "Cómo lo resuelvo",
    detalle: [
      {
        titulo: "Tomacorrientes",
        texto: "Para la cocina, el escritorio, el aire o donde hoy tengas zapatillas. Veo de qué circuito conviene tomarlo.",
      },
      {
        titulo: "Bocas de luz",
        texto: "Sumo puntos de luz en ambientes, galerías o el patio, con su llave donde te quede cómoda.",
      },
      {
        titulo: "Ventiladores de techo",
        texto: "Lo fijo firme, lo conecto y te dejo la llave o el control funcionando.",
      },
    ],
    faq: [
      {
        q: "¿Hay que romper la pared?",
        a: "Depende de por dónde se pueda pasar el cable. Si no querés romper, también se puede hacer con cablecanal. Te lo digo antes de empezar.",
      },
      {
        q: "¿Me pasás el precio por WhatsApp?",
        a: "Sí. Mandame qué querés agregar y una foto del lugar, y te paso el presupuesto sin cargo.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Decime qué querés agregar y dónde, y te paso el presupuesto sin cargo.",
  },

  "tableros-electricos": {
    titulo: "Tableros eléctricos en Carlos Paz: térmicas y disyuntor",
    descripcion:
      "Actualización de tableros eléctricos en casas y comercios de Carlos Paz: disyuntor diferencial, térmicas y reemplazo de fusibles. Con garantía escrita.",
    etiqueta: "Tableros eléctricos",
    h1: "Tableros eléctricos en Carlos Paz",
    intro:
      "Si tu tablero tiene fusibles, no tiene disyuntor o le salta seguido, conviene actualizarlo. Te digo qué hace falta y qué no.",
    incluye: [
      "Actualización de tableros viejos o con fusibles",
      "Colocación de disyuntor diferencial",
      "Térmicas según lo que consume cada circuito",
      "Circuitos nuevos para aires u otros equipos",
    ],
    detalleTitulo: "Señales de que hay que revisarlo",
    detalle: [
      {
        titulo: "Tiene fusibles",
        texto: "Los fusibles no protegen a las personas de una descarga. Hace falta un disyuntor diferencial.",
      },
      {
        titulo: "Salta seguido",
        texto: "No es normal: puede ser un equipo con problemas, humedad o una protección gastada.",
      },
      {
        titulo: "Calor u olor a quemado",
        texto: "Puede ser una conexión floja. Hay que revisarlo cuanto antes.",
      },
      {
        titulo: "Sumaste equipos",
        texto: "Un aire o un horno eléctrico pueden necesitar su propio circuito.",
      },
    ],
    faq: [
      {
        q: "¿Qué diferencia hay entre la térmica y el disyuntor?",
        a: "La térmica protege los cables de sobrecargas y cortocircuitos. El disyuntor diferencial protege a las personas de una descarga. Un tablero seguro necesita los dos.",
      },
      {
        q: "¿Cuánto tarda cambiar un tablero?",
        a: "Una actualización común suele hacerse en un día. Te confirmo el tiempo con el presupuesto.",
      },
      {
        q: "¿Puedo cambiar yo un fusible?",
        a: "Mejor no. Además, un fusible quemado suele avisar de un problema que hay que encontrar.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Mandame una foto de tu tablero y te digo qué conviene hacer.",
  },

  "locales-comerciales": {
    titulo: "Instalación eléctrica para locales comerciales en Carlos Paz",
    descripcion:
      "Adecuación eléctrica de locales comerciales en Carlos Paz: iluminación, tablero y certificado para la habilitación municipal. Coordinado para que no cierres.",
    etiqueta: "Locales comerciales",
    h1: "Instalación eléctrica para locales comerciales en Carlos Paz",
    intro:
      "Dejo la electricidad de tu local en condiciones para abrir o para seguir trabajando, coordinando los horarios para que no tengas que cerrar.",
    incluye: [
      "Adecuación eléctrica del local",
      "Iluminación del salón y la vidriera",
      "Tablero con sus protecciones",
      "Certificado para la habilitación municipal",
    ],
    detalleTitulo: "Cómo trabajo en un local",
    detalle: [
      {
        titulo: "Veo lo que tenés",
        texto: "Reviso la instalación y te digo qué hay que cambiar y qué puede quedar.",
      },
      {
        titulo: "Coordinamos horarios",
        texto: "Organizamos el trabajo por etapas para no frenar la atención al público.",
      },
      {
        titulo: "El certificado",
        texto: `${CERTIFICADO_GESTION}.`,
      },
    ],
    faq: [
      {
        q: "¿Qué me piden para habilitar el local?",
        a: `Depende del municipio y del rubro, así que conviene confirmarlo en la municipalidad. ${CERTIFICADO_GESTION}.`,
      },
      {
        q: "¿Tengo que cerrar mientras trabajás?",
        a: "La idea es que no. Coordinamos los horarios y las etapas según cómo funcione tu local.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Contame qué local tenés y qué te están pidiendo, y lo vemos.",
  },

  "instalaciones-domiciliarias": {
    titulo: "Instalación eléctrica completa en Carlos Paz",
    descripcion:
      "Instalación eléctrica completa para obra nueva o reforma en Carlos Paz y Punilla: cañerías, cableado, tablero y puesta a tierra. Con garantía escrita.",
    etiqueta: "Instalación completa",
    h1: "Instalación eléctrica completa en Carlos Paz",
    intro: "Para obra nueva o reforma: hago toda la instalación, desde las cañerías hasta el tablero.",
    incluye: [
      "Cañerías y cajas en obra",
      "Cableado, tomas, llaves y bocas de luz",
      "Tablero con térmicas y disyuntor diferencial",
      "Puesta a tierra",
    ],
    detalleTitulo: "Cómo la encaro",
    detalle: [
      {
        titulo: "Obra nueva",
        texto: "Coordino con la obra para pasar cañerías antes del revoque y cablear al final.",
      },
      {
        titulo: "Reforma o ampliación",
        texto: "Veo qué se puede aprovechar y qué conviene cambiar de la instalación vieja.",
      },
      {
        titulo: "El certificado",
        texto: `${CERTIFICADO_GESTION}.`,
      },
    ],
    faq: [
      {
        q: "¿Necesito certificado para pedir la luz en una casa nueva?",
        a: `Sí, para un suministro nuevo la distribuidora pide el Certificado de Instalación Eléctrica Apta (Ley 10.281). ${CERTIFICADO_GESTION}.`,
      },
      {
        q: "¿Cuánto tarda?",
        a: "Depende del tamaño y del avance de la obra. Te paso los tiempos junto con el presupuesto.",
      },
      {
        q: "¿Para qué sirve la puesta a tierra?",
        a: "Lleva a tierra las corrientes de falla y permite que el disyuntor diferencial te proteja de una descarga.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Pasame el plano o contame cómo es la obra y te armo el presupuesto.",
  },

  "instalacion-ventilador-de-techo": {
    titulo: "Instalación de ventilador de techo en Carlos Paz",
    descripcion:
      "Instalo tu ventilador de techo en Carlos Paz y Punilla: fijación firme, conexión y llave o control funcionando. Respondo en el día por WhatsApp.",
    etiqueta: "Ventiladores de techo",
    h1: "Instalación de ventilador de techo en Carlos Paz",
    intro: "Te lo dejo colgado, firme y andando, en casa o en tu local. Decime cuántos son y en qué ambientes.",
    incluye: [
      "Fijación firme al techo",
      "Armado y conexión del ventilador",
      "Llave o control funcionando",
      "Boca de luz nueva, si no hay una en el lugar",
    ],
    detalleTitulo: "Antes de escribirme",
    detalle: [
      {
        titulo: "Si ya hay boca de luz",
        texto: "Normalmente se aprovecha. Reviso que soporte el peso y que la conexión esté bien.",
      },
      {
        titulo: "Si no hay boca",
        texto: "La agrego y te digo por dónde conviene pasar el cable.",
      },
      {
        titulo: "Mandame una foto",
        texto: "Con una foto del techo y el modelo te paso el presupuesto sin cargo.",
      },
    ],
    faq: [
      {
        q: "¿Puedo cambiar una lámpara por un ventilador?",
        a: "En general sí, si la boca de luz permite fijarlo firme. Lo reviso antes de colgarlo.",
      },
      {
        q: "¿Tengo que comprar yo el ventilador?",
        a: "Como te quede más cómodo. Si no lo compraste, te digo qué tener en cuenta según el ambiente.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Decime cuántos ventiladores son y te paso el presupuesto sin cargo.",
  },

  "mantenimiento-electricidad": {
    titulo: "Revisión y mantenimiento eléctrico en Carlos Paz",
    descripcion:
      "Revisión de la instalación eléctrica de tu casa o comercio en Carlos Paz y Punilla: tablero, conexiones y puesta a tierra. Presupuesto sin cargo.",
    etiqueta: "Mantenimiento",
    h1: "Revisión y mantenimiento eléctrico en Carlos Paz",
    intro: "Reviso tu instalación para encontrar los problemas antes de que te dejen sin luz.",
    incluye: [
      "Revisión del tablero y las protecciones",
      "Control de conexiones y tomas",
      "Prueba del disyuntor diferencial",
      "Detalle de lo que hay que corregir",
    ],
    detalleTitulo: "Cuándo conviene",
    detalle: [
      {
        titulo: "Instalaciones viejas",
        texto: "Con el tiempo se aflojan conexiones y se deterioran los aislamientos.",
      },
      {
        titulo: "Casas de fin de semana",
        texto: "Pasan tiempo cerradas y la humedad hace lo suyo.",
      },
    ],
    faq: [
      {
        q: "¿Cada cuánto hay que revisar la instalación?",
        a: "Una revisión al año es una buena referencia para una casa. En un local, conviene más seguido si tiene mucho uso.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Contame qué querés revisar y coordinamos.",
  },

  "iluminacion-automatizacion": {
    titulo: "Iluminación LED y automatización en Carlos Paz",
    descripcion:
      "Iluminación LED interior y exterior, sensores de movimiento y automatización para casas y comercios en Carlos Paz y Punilla. Con garantía escrita.",
    etiqueta: "Iluminación",
    h1: "Iluminación LED y automatización en Carlos Paz",
    intro: "Luces LED, sensores y encendidos automáticos para tu casa o tu local.",
    incluye: [
      "Iluminación LED interior y exterior",
      "Sensores de movimiento",
      "Luces de jardín, cochera y frente",
      "Encendido por horario o desde el celular",
    ],
    detalleTitulo: "Lo más pedido",
    detalle: [
      {
        titulo: "Cambio a LED",
        texto: "En la mayoría de los casos se aprovechan las bocas de luz que ya tenés.",
      },
      {
        titulo: "Sensores",
        texto: "Para escaleras, pasillos y exteriores: la luz prende cuando hace falta.",
      },
    ],
    faq: [
      {
        q: "¿Puedo poner LED sin cambiar la instalación?",
        a: "Casi siempre sí. Para tiras, luces empotradas o automatización a veces hay que ajustar el circuito.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Contame qué querés iluminar y lo vemos.",
  },

  "camaras-de-seguridad": {
    titulo: "Instalación de cámaras de seguridad en Carlos Paz",
    descripcion:
      "Instalación de cámaras de seguridad para casas y comercios en Carlos Paz y Punilla, con cableado prolijo, alimentación segura y acceso desde el celular.",
    etiqueta: "Cámaras de seguridad",
    h1: "Instalación de cámaras de seguridad en Carlos Paz",
    intro: "Para tu casa o tu comercio, con el cableado protegido y todo configurado en tu celular.",
    incluye: [
      "Cámaras en accesos, cochera, patio o salón",
      "Cableado protegido y prolijo",
      "Alimentación eléctrica segura",
      "Grabación y acceso desde el celular",
    ],
    detalleTitulo: "Para qué se usan",
    detalle: [
      {
        titulo: "Casas de fin de semana",
        texto: "Mirás qué pasa desde el celular, estés donde estés.",
      },
      {
        titulo: "Comercios",
        texto: "Caja, salón, depósito y vereda, con grabación continua o por movimiento.",
      },
    ],
    faq: [
      {
        q: "¿Puedo ver las cámaras desde el celular?",
        a: "Sí, siempre que la propiedad tenga conexión a internet. Te dejo la app configurada.",
      },
      {
        q: "¿Cuántas cámaras necesito?",
        a: "Depende de los accesos. En una casa típica alcanza con el ingreso, la cochera y el patio.",
      },
      GARANTIA,
      ZONA,
    ],
    cierre: "Contame qué querés cubrir y te paso el presupuesto sin cargo.",
  },
};
