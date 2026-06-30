import type { Metadata } from "next";
import Link from "next/link";
import ContactBanner from "@/components/sections/ContactBanner";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  content: React.ReactNode;
};

const posts: Record<string, Post> = {
  "como-saber-si-necesito-actualizar-tablero-electrico": {
    slug: "como-saber-si-necesito-actualizar-tablero-electrico",
    title: "¿Cómo saber si necesito actualizar mi tablero eléctrico?",
    description:
      "El tablero eléctrico es el corazón de tu instalación. Conocé las señales que indican que es hora de actualizarlo en Carlos Paz y Punilla.",
    category: "Mantenimiento",
    date: "2025-06-01",
    content: (
      <article className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          El tablero eléctrico es el cerebro de toda tu instalación. Distribuye la energía,
          protege los circuitos y, si funciona correctamente, te protege a vos y a tu familia.
          Pero si tiene más de 15 o 20 años —o si todavía tiene fusibles tipo cuchilla— probablemente
          ya es hora de reemplazarlo.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          7 señales de que tu tablero necesita ser actualizado
        </h2>
        <ol className="space-y-4 mb-8">
          {[
            {
              title: "Tiene fusibles tipo cuchilla o de vidrio",
              desc: "Los fusibles son tecnología del siglo pasado. No ofrecen protección diferencial contra descargas eléctricas y son mucho más lentos que los disyuntores modernos. Si tu tablero tiene fusibles, actualizarlo es urgente.",
            },
            {
              title: "Los disyuntores saltan con frecuencia",
              desc: "Un disyuntor que salta seguido indica que hay un circuito sobrecargado, una falla eléctrica latente o un disyuntor defectuoso. No es normal y hay que revisarlo.",
            },
            {
              title: "Sentís calor o olor a quemado cerca del tablero",
              desc: "El calor excesivo en el tablero es una señal de conexiones flojas o sobrecarga. El olor a quemado puede indicar que ya hay daño en el aislamiento. Llamá a un electricista de inmediato.",
            },
            {
              title: "No tiene llave diferencial (disyuntor diferencial)",
              desc: "El diferencial es el dispositivo que te protege de electrocución al detectar corrientes de fuga. Si tu tablero no tiene diferencial de 30mA, tu instalación no cumple con la normativa eléctrica argentina vigente.",
            },
            {
              title: "Se producen chispas al enchufar equipos grandes",
              desc: "Las chispas al conectar un aire acondicionado, lavarropas o horno indican problemas en los circuitos o en el propio tablero.",
            },
            {
              title: "La instalación tiene más de 20 años sin revisión",
              desc: "Los aislamientos eléctricos se deterioran con el tiempo. Una instalación antigua sin mantenimiento puede tener fallas invisibles que solo detecta un electricista matriculado.",
            },
            {
              title: "El tablero no da abasto para la demanda actual",
              desc: "Si tu hogar tiene más electrodomésticos que cuando fue instalado (aire acondicionado, calefactor eléctrico, lavarropa, secarropa) y los circuitos saltan seguido, el tablero necesita ampliarse o reemplazarse.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-amber-500 font-bold text-xl flex-shrink-0">{i + 1}.</span>
              <div>
                <strong className="text-slate-900 block mb-1">{item.title}</strong>
                <span className="text-slate-600 text-sm">{item.desc}</span>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          ¿Qué debe tener un tablero eléctrico moderno?
        </h2>
        <ul className="space-y-2 mb-8">
          {[
            "Llave general termomagnética",
            "Disyuntor diferencial de alta sensibilidad (30 mA) — protege a las personas",
            "Disyuntores termomagnéticos por circuito — protegen los cables y equipos",
            "Circuitos separados para cocina, baño, iluminación y tomacorrientes",
            "Circuito dedicado para equipos de alta potencia (aire, calefactor eléctrico, horno)",
            "Puesta a tierra correctamente instalada y medida",
            "Capacidad suficiente para la demanda actual y proyecciones futuras",
          ].map((item) => (
            <li key={item} className="flex gap-3 items-start">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            ¿Cuánto cuesta actualizar el tablero eléctrico en Carlos Paz?
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            El costo varía según la cantidad de circuitos, el tipo de tablero y el estado de la
            instalación existente. Normalmente, la actualización de un tablero domiciliario en
            Carlos Paz puede realizarse en un solo día de trabajo. Consultanos para más información.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="font-bold text-red-800 text-lg mb-2">⚠️ Importante</h3>
          <p className="text-red-700 text-sm leading-relaxed">
            El reemplazo o la intervención en tableros eléctricos <strong>DEBE ser realizado
            por un electricista matriculado</strong>. Es ilegal y extremadamente peligroso
            intentarlo sin habilitación. Un error puede causar electrocución o incendio.
          </p>
        </div>
      </article>
    ),
  },

  "seguridad-electrica-hogar-carlos-paz": {
    slug: "seguridad-electrica-hogar-carlos-paz",
    title: "5 consejos de seguridad eléctrica para tu hogar en Carlos Paz",
    description:
      "La seguridad eléctrica en el hogar es fundamental para prevenir accidentes. Seguí estos consejos en tu vivienda de Carlos Paz y Punilla.",
    category: "Seguridad",
    date: "2025-05-15",
    content: (
      <article className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Los accidentes eléctricos en el hogar son más comunes de lo que se cree. En Argentina,
          gran parte de los incendios domiciliarios tienen origen eléctrico, y muchos son
          prevenibles con medidas simples. Acá te contamos los 5 consejos más importantes para
          mantener tu hogar eléctrico seguro en Carlos Paz y Punilla.
        </p>

        <div className="space-y-8 mb-10">
          {[
            {
              num: "01",
              title: "Nunca realices trabajos eléctricos por tu cuenta",
              content:
                "Este es el consejo más importante. La normativa eléctrica argentina (Resolución SE 1/2020 y norma AEA 90364) establece que las instalaciones y reparaciones eléctricas deben ser realizadas únicamente por electricistas matriculados. Más allá de la ley, intentar reparar un enchufe quemado, cambiar un cable o intervenir en el tablero sin conocimiento puede costar la vida. Ante cualquier problema eléctrico, llamá a un profesional.",
              warning: true,
            },
            {
              num: "02",
              title: "Instalá un disyuntor diferencial en tu tablero",
              content:
                "El diferencial es el dispositivo que salva vidas. Detecta corrientes de fuga (por ejemplo, cuando una persona toca un cable con tensión) y corta el suministro en milisegundos. Muchas instalaciones antiguas en Carlos Paz no lo tienen. Si tu tablero no tiene diferencial de 30 mA, hablá con un electricista para instalarlo. Es obligatorio por normativa y puede prevenir una electrocución.",
              warning: false,
            },
            {
              num: "03",
              title: "No sobrecargues los tomacorrientes ni uses zapatillas apiladas",
              content:
                "Un tomacorriente tiene una capacidad máxima de potencia. Conectar muchos equipos de alto consumo (calefactor, pava eléctrica, microondas) en un mismo punto genera calor excesivo que puede quemar el cableado y provocar un incendio. Cada equipo de alta potencia debería tener su propio circuito dedicado. Consultá con un electricista si necesitás ampliar los circuitos de tu hogar en Carlos Paz.",
              warning: false,
            },
            {
              num: "04",
              title: "Revisá el estado de cables, enchufes y artefactos",
              content:
                "Los cables pelados, enchufes flojos, artefactos con cable deshilachado y tomas con signos de quemado son situaciones de riesgo que deben resolverse de inmediato. No los ignores ni los 'arregles' con cinta. Llamá a un electricista para que evalúe y repare el problema correctamente. Una revisión preventiva anual puede detectar estos problemas antes de que sean peligrosos.",
              warning: false,
            },
            {
              num: "05",
              title: "Mantené actualizado el tablero eléctrico",
              content:
                "Si tu tablero tiene fusibles tipo cuchilla o tiene más de 20 años sin revisión, es prioritario que un electricista matriculado lo inspeccione. Un tablero obsoleto no protege correctamente tu instalación. En caso de sobrecarga o cortocircuito, puede no actuar a tiempo y provocar un incendio.",
              warning: false,
            },
          ].map((item) => (
            <div
              key={item.num}
              className={`rounded-xl p-6 border ${item.warning ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="flex gap-4 items-start">
                <span className="text-3xl font-black text-amber-400 leading-none flex-shrink-0">
                  {item.num}
                </span>
                <div>
                  <h3
                    className={`font-bold text-lg mb-2 ${item.warning ? "text-red-800" : "text-slate-900"}`}
                  >
                    {item.warning && "⚠️ "}
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${item.warning ? "text-red-700" : "text-slate-600"}`}>
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            ¿Cuándo fue la última revisión eléctrica de tu hogar?
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            Si no recordás cuándo fue la última revisión eléctrica, probablemente sea hora de
            hacer una. En Voltis realizamos revisiones preventivas en Carlos Paz y toda
            la región de Punilla. Contactanos para coordinar una visita.
          </p>
        </div>
      </article>
    ),
  },

  "iluminacion-led-ahorro-energia-punilla": {
    slug: "iluminacion-led-ahorro-energia-punilla",
    title: "Iluminación LED: ahorrá energía en tu hogar o empresa de Punilla",
    description:
      "La iluminación LED puede reducir tu consumo eléctrico hasta un 80%. Descubrí cómo migrar a LED en Carlos Paz y Punilla con ayuda de un electricista matriculado.",
    category: "Eficiencia energética",
    date: "2025-04-20",
    content: (
      <article className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Cambiar a iluminación LED es una de las inversiones más inteligentes que podés hacer en
          tu hogar o empresa de Punilla. Con una reducción del consumo de hasta el 80% respecto a
          las lámparas incandescentes y una vida útil hasta 25 veces mayor, el LED se paga solo en
          pocos meses.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          ¿Por qué el LED consume menos?
        </h2>
        <p className="text-slate-700 mb-6 leading-relaxed">
          Las lámparas incandescentes tradicionales convierten solo el 5% de la energía en luz;
          el 95% restante se pierde como calor. Las LED, en cambio, convierten entre el 80% y
          90% de la energía en luz visible. Una lámpara LED de 9W produce la misma cantidad de
          luz que una incandescente de 60W.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Comparativa: LED vs. incandescente vs. bajo consumo
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">Tipo</th>
                <th className="px-4 py-3 text-center">Potencia (luz equivalente 60W)</th>
                <th className="px-4 py-3 text-center">Vida útil</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">Ahorro estimado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-50 border-b border-slate-200">
                <td className="px-4 py-3 font-medium">Incandescente</td>
                <td className="px-4 py-3 text-center">60 W</td>
                <td className="px-4 py-3 text-center">1.000 hs</td>
                <td className="px-4 py-3 text-center text-slate-400">—</td>
              </tr>
              <tr className="bg-white border-b border-slate-200">
                <td className="px-4 py-3 font-medium">Bajo consumo (CFL)</td>
                <td className="px-4 py-3 text-center">15 W</td>
                <td className="px-4 py-3 text-center">8.000 hs</td>
                <td className="px-4 py-3 text-center text-amber-600 font-medium">~75%</td>
              </tr>
              <tr className="bg-amber-50 border-b border-amber-200">
                <td className="px-4 py-3 font-bold text-amber-700">LED</td>
                <td className="px-4 py-3 text-center font-bold text-amber-700">9 W</td>
                <td className="px-4 py-3 text-center font-bold text-amber-700">25.000 hs</td>
                <td className="px-4 py-3 text-center text-green-700 font-bold">~85%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          Tipos de LED para cada ambiente
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[
            {
              icon: "🏠",
              title: "Dormitorios y living",
              desc: "LED cálida (2700K–3000K). Genera un ambiente acogedor. Potencia: 7–9W.",
            },
            {
              icon: "🍳",
              title: "Cocina y baño",
              desc: "LED neutra o fría (4000K–5000K). Ideal para tareas que requieren buena visibilidad. Potencia: 9–12W.",
            },
            {
              icon: "🏢",
              title: "Oficinas y locales",
              desc: "LED fría (5000K–6500K) o paneles LED. Máxima claridad para trabajo. Potencia según superficie.",
            },
            {
              icon: "🌿",
              title: "Exterior y jardín",
              desc: "LED con protección IP65 o superior. Resistentes a la lluvia, aptas para fachadas y jardines de Carlos Paz.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <strong className="text-slate-900 block mb-1">{item.title}</strong>
                <span className="text-slate-600 text-sm">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          ¿Cuándo conviene que instale el LED un electricista?
        </h2>
        <p className="text-slate-700 mb-4 leading-relaxed">
          Cambiar una lámpara por otra del mismo tipo (por ejemplo, LED en lugar de incandescente
          con el mismo casquillo E27) no requiere electricista. Pero hay situaciones donde
          <strong> sí es necesario un electricista matriculado</strong>:
        </p>
        <ul className="space-y-2 mb-8">
          {[
            "Instalación de artefactos LED embutidos (dicroicos, downlights) que requieren apertura en el cielorraso",
            "Instalación de tiras LED con fuentes de alimentación (drivers) 220V",
            "Automatización de iluminación con sensores de movimiento, dimmers o domótica",
            "Iluminación exterior con cableado nuevo",
            "Proyectos de iluminación de locales comerciales o industriales",
          ].map((item) => (
            <li key={item} className="flex gap-3 items-start">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              <span className="text-slate-700 text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            Migrá a LED en Carlos Paz y Punilla con Voltis
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            Diseñamos e instalamos proyectos de iluminación LED para hogares, comercios y empresas
            en Carlos Paz, Valle Hermoso, Cosquín, La Falda y toda la región de Punilla. Presupuesto
            gratuito y sin compromiso.
          </p>
        </div>
      </article>
    ),
  },

  "instalacion-electrica-obra-nueva-carlos-paz": {
    slug: "instalacion-electrica-obra-nueva-carlos-paz",
    title: "Guía de instalación eléctrica para obra nueva en Carlos Paz",
    description:
      "Si estás construyendo en Carlos Paz o Punilla, conocé los pasos esenciales para planificar la instalación eléctrica de tu vivienda o local desde cero.",
    category: "Instalaciones",
    date: "2025-03-10",
    content: (
      <article className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          La instalación eléctrica es una de las etapas más importantes de cualquier obra nueva.
          Un mal diseño o una ejecución deficiente pueden generar problemas de seguridad que duran
          décadas y son costosos de corregir. Acá te explicamos los pasos clave para planificar
          correctamente la instalación eléctrica de tu vivienda o local en Carlos Paz y Punilla.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <p className="text-red-800 text-sm font-medium">
            ⚠️ <strong>Importante:</strong> La instalación eléctrica en obra nueva debe ser
            realizada por un electricista matriculado. Es requisito legal para tramitar la
            habilitación de la obra y el certificado eléctrico ante el municipio de Carlos Paz.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-6">
          Pasos de la instalación eléctrica en obra nueva
        </h2>

        <div className="space-y-6 mb-10">
          {[
            {
              step: "1",
              title: "Proyecto eléctrico y cálculo de carga",
              desc: "Antes de picar paredes, el electricista debe calcular la carga total de la vivienda (cantidad de equipos, potencia, circuitos necesarios) y diseñar el proyecto eléctrico. Este plano define la ubicación del tablero, la cantidad de circuitos y el recorrido de los cables.",
            },
            {
              step: "2",
              title: "Cañerías y cajas (en obra gruesa)",
              desc: "Una vez levantadas las paredes y antes de revocar, se instalan las cañerías (caños de PVC o metálicos) por donde van a pasar los cables. También se instalan las cajas para tomacorrientes, bocas de luz e interruptores. Este es el momento más crítico: hacerlo mal implica picar y revocar de nuevo.",
            },
            {
              step: "3",
              title: "Tendido de cables",
              desc: "Con las cañerías colocadas, se pasan los cables por dentro. El tipo y sección de cable (mm²) depende de la potencia de cada circuito. Los circuitos de alta potencia (aire acondicionado, calefactor, cocina) requieren cables de mayor sección y circuitos dedicados.",
            },
            {
              step: "4",
              title: "Instalación del tablero eléctrico",
              desc: "El tablero es el centro de comando de la instalación. Debe incluir llave general, disyuntor diferencial (30 mA) y termomagnéticos por circuito. La ubicación debe ser accesible, en un lugar seco y de fácil acceso para el propietario.",
            },
            {
              step: "5",
              title: "Puesta a tierra",
              desc: "La puesta a tierra es obligatoria y fundamental para la seguridad. Consiste en una jabalina o malla de cables enterrados que conducen las corrientes de falla al suelo, protegiendo a las personas. Sin puesta a tierra, el diferencial no puede funcionar correctamente.",
            },
            {
              step: "6",
              title: "Instalación de artefactos y verificación final",
              desc: "Con las paredes terminadas, se instalan tomacorrientes, interruptores, bocas de luz y artefactos. Finalmente, se realizan pruebas de continuidad, aislación y funcionamiento de todas las protecciones.",
            },
            {
              step: "7",
              title: "Certificado técnico",
              desc: "Al finalizar la obra, el electricista emite el certificado de instalación eléctrica firmado y sellado. Este documento es necesario para la habilitación municipal en Carlos Paz y para cualquier trámite ante EPEC (Empresa Provincial de Energía de Córdoba).",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-slate-900 font-black flex items-center justify-center text-lg">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          ¿Cuántos circuitos necesita una vivienda en Carlos Paz?
        </h2>
        <p className="text-slate-700 mb-4 leading-relaxed">
          La cantidad de circuitos depende del tamaño y uso de la vivienda. Como mínimo, una
          vivienda de 2-3 ambientes debería tener:
        </p>
        <ul className="space-y-2 mb-8">
          {[
            "Circuito de iluminación (independiente por sector)",
            "Circuitos de tomacorrientes generales",
            "Circuito dedicado para cocina (horno, microondas, heladera)",
            "Circuito dedicado para lavarropas",
            "Circuito dedicado para cada aire acondicionado",
            "Circuito dedicado para calefactor eléctrico o termo eléctrico",
            "Circuito de exterior e iluminación de jardín (si aplica)",
          ].map((item) => (
            <li key={item} className="flex gap-3 items-start">
              <span className="text-amber-500 font-bold mt-0.5">✓</span>
              <span className="text-slate-700 text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            Instalación eléctrica para obras en Carlos Paz y Punilla
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            En Voltis nos ocupamos de la instalación eléctrica completa de tu obra nueva
            en Carlos Paz, Cosquín, La Falda, Valle Hermoso y toda la región de Punilla. Desde el
            proyecto hasta el certificado técnico final. Contactanos para coordinar una visita.
          </p>
        </div>
      </article>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Artículo no encontrado</h1>
          <Link href="/blog" className="text-amber-600 hover:underline">
            Ver todos los artículos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-slate-900 text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-sm text-slate-400 mb-4">
            <Link href="/blog" className="hover:text-amber-400 transition-colors">
              Blog
            </Link>{" "}
            / <span className="text-amber-400">{post.category}</span>
          </div>
          <span className="text-xs font-semibold bg-amber-500 text-slate-900 px-3 py-1 rounded-full uppercase tracking-wide">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4 leading-tight">{post.title}</h1>
          <time className="text-slate-400 text-sm">{post.date}</time>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {post.content}
        </div>
      </section>

      <EmergencyCTA />

      <section className="py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-bold text-slate-900 text-lg mb-4">Más artículos sobre electricidad en Carlos Paz</h3>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-600 hover:underline font-medium"
          >
            ← Ver todos los artículos del blog
          </Link>
        </div>
      </section>

      <ContactBanner />
    </>
  );
}
