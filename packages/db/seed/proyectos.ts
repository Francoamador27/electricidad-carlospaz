// Proyectos de referencia: describen el TIPO de trabajo que hace Voltis, sin inventar
// cliente, fecha ni localidad. Reemplazarlos por trabajos reales desde el panel.

export type ProyectoSeed = {
  slug: string;
  titulo: string;
  servicio: string;
  foto: string;
  alt: string;
  descripcion: string;
  destacado?: boolean;
};

const AVISO =
  "> **Trabajo de referencia.** Así encaramos este tipo de trabajo. Pronto vamos a sumar fotos de obras realizadas.";

export const PROYECTOS: ProyectoSeed[] = [
  {
    slug: "actualizacion-tablero-electrico-domiciliario",
    titulo: "Actualización de tablero eléctrico domiciliario",
    servicio: "tableros-electricos",
    foto: "/images/tablero-electrico.png",
    alt: "Tablero eléctrico domiciliario con disyuntor diferencial y termomagnéticas",
    destacado: true,
    descripcion: `${AVISO}

Reemplazo de un tablero antiguo con fusibles por uno nuevo con **disyuntor diferencial de 30 mA** y **termomagnéticas por circuito**.

## Cómo lo hacemos

1. Relevamos los circuitos existentes y la carga de la casa.
2. Separamos circuitos: iluminación, tomacorrientes, cocina y equipos de alta potencia.
3. Montamos el tablero nuevo con sus protecciones e identificamos cada circuito.
4. Verificamos la puesta a tierra y probamos el diferencial.

Es uno de los trabajos que más seguridad le suma a una casa. Más información en [tableros eléctricos](/servicios/tableros-electricos).`,
  },
  {
    slug: "tablero-trifasico-para-comercio",
    titulo: "Tablero trifásico para comercio",
    servicio: "instalaciones-empresariales",
    foto: "/images/tablero-trifasico.jpg",
    alt: "Tablero eléctrico trifásico para local comercial",
    destacado: true,
    descripcion: `${AVISO}

Tablero trifásico para un local con equipos de alta potencia: cámaras de frío, hornos o aires acondicionados.

## Qué incluye

- Cálculo de carga y balanceo de fases
- Protecciones termomagnéticas y diferenciales por sector
- Circuitos independientes para iluminación, tomacorrientes y equipos
- Identificación de cada circuito para facilitar el mantenimiento

Si tu comercio necesita el [Certificado de Instalación Eléctrica Apta](/certificado-instalacion-electrica-apta), lo emitimos al terminar. Ver [instalaciones para empresas](/servicios/instalaciones-empresariales).`,
  },
  {
    slug: "instalacion-electrica-obra-nueva",
    titulo: "Instalación eléctrica completa en obra nueva",
    servicio: "instalaciones-domiciliarias",
    foto: "/images/nivel-laser-exactitud.jpg",
    alt: "Marcado con nivel láser del recorrido de cañerías eléctricas en obra nueva",
    destacado: true,
    descripcion: `${AVISO}

Instalación eléctrica de una vivienda desde cero, coordinada con el avance de la obra.

## Etapas

1. **Proyecto y cálculo de carga** antes de empezar.
2. **Cañerías y cajas** en obra gruesa, marcadas con nivel láser.
3. **Cableado** con la sección correcta para cada circuito.
4. **Tablero, puesta a tierra y artefactos.**
5. **Pruebas** de aislación y protecciones, y certificado final.

Más detalles en nuestra [guía de instalación para obra nueva](/blog/instalacion-electrica-obra-nueva-carlos-paz).`,
  },
  {
    slug: "iluminacion-led-exterior-casa-con-parque",
    titulo: "Iluminación LED exterior para casa con parque",
    servicio: "iluminacion-automatizacion",
    foto: "/images/iluminacion-led-exterior.jpg",
    alt: "Iluminación LED exterior en jardín de una casa",
    descripcion: `${AVISO}

Iluminación de parque, fachada y caminos con artefactos LED aptos para exterior (IP65 o superior).

## Qué tenemos en cuenta

- Cableado enterrado con caño y materiales para intemperie
- Circuito propio con protección diferencial
- Encendido por sensor de movimiento, fotocélula o desde el celular
- Bajo consumo: LED en lugar de lámparas halógenas

Ver [iluminación y automatización](/servicios/iluminacion-automatizacion).`,
  },
  {
    slug: "domotica-luces-desde-el-celular",
    titulo: "Domótica: luces y equipos desde el celular",
    servicio: "iluminacion-automatizacion",
    foto: "/images/smart-home.jpg",
    alt: "Control de iluminación del hogar desde una app en el celular",
    descripcion: `${AVISO}

Automatización de luces y equipos para manejarlos desde el celular o por horarios.

## Ejemplos de lo que se puede automatizar

- Encender y apagar luces a distancia o con horarios
- Escenas: "salir de casa" apaga todo con un toque
- Control de termotanque o bomba por horario
- Simulación de presencia cuando la casa está vacía

Ver [iluminación y automatización](/servicios/iluminacion-automatizacion).`,
  },
  {
    slug: "instalacion-camaras-de-seguridad-vivienda",
    titulo: "Instalación de cámaras de seguridad en vivienda",
    servicio: "camaras-de-seguridad",
    foto: "/images/camara-seguridad.jpg",
    alt: "Cámara de seguridad instalada en el exterior de una vivienda",
    destacado: false,
    descripcion: `${AVISO}

Instalación de cámaras de seguridad con visualización desde el celular.

## Cómo lo hacemos

1. Definimos con vos qué zonas cubrir: accesos, portón, patio.
2. Elegimos la ubicación de cada cámara para evitar puntos ciegos.
3. Tendemos el cableado y la alimentación de forma prolija y protegida.
4. Configuramos la grabación y el acceso desde tu celular.

Ver [instalación de cámaras de seguridad](/servicios/camaras-de-seguridad).`,
  },
  {
    slug: "busqueda-de-fallas-y-reparacion-de-circuito",
    titulo: "Búsqueda de fallas y reparación de circuito",
    servicio: "reparaciones-electricas",
    foto: "/images/reparando-espalda.jpg",
    alt: "Electricista revisando un circuito para encontrar una falla",
    descripcion: `${AVISO}

Diagnóstico de un circuito que hacía saltar el diferencial y reparación del origen de la falla.

## Pasos

1. Aislamos circuito por circuito hasta encontrar el que falla.
2. Medimos aislación para ubicar la fuga: humedad, cable dañado o artefacto defectuoso.
3. Reparamos el tramo o el elemento dañado.
4. Probamos el diferencial y dejamos todo funcionando.

Ver [reparaciones eléctricas](/servicios/reparaciones-electricas).`,
  },
];
