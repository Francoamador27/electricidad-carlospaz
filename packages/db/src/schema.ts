import {
  bigint,
  boolean,
  date,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const estado = pgEnum("estado", ["borrador", "publicado"]);

export type Foto = {
  key: string;
  anchos: number[];
  ancho: number;
  alto: number;
  alt: string;
  tipo: "antes" | "despues" | "general";
  // Safari puede no generar WebP desde canvas: en ese caso se sube JPEG.
  formato?: "webp" | "jpeg";
};

const actualizado = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// Solo para relaciones: el contenido de cada servicio vive en apps/web.
export const servicios = pgTable("servicios", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  orden: integer("orden").notNull().default(0),
});

export const zonas = pgTable("zonas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  texto: text("texto").notNull(),
  seoTitulo: text("seo_titulo"),
  seoDescripcion: text("seo_descripcion"),
  estado: estado("estado").notNull().default("borrador"),
  orden: integer("orden").notNull().default(0),
  updatedAt: actualizado(),
});

export const proyectos = pgTable("proyectos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  servicioId: integer("servicio_id").references(() => servicios.id),
  zonaId: integer("zona_id").references(() => zonas.id),
  fechaTrabajo: date("fecha_trabajo"),
  fotos: jsonb("fotos").$type<Foto[]>().notNull().default([]),
  destacado: boolean("destacado").notNull().default(false),
  estado: estado("estado").notNull().default("borrador"),
  publicadoAt: timestamp("publicado_at", { withTimezone: true }),
  updatedAt: actualizado(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  extracto: text("extracto").notNull(),
  contenido: text("contenido").notNull(),
  categoria: text("categoria"),
  portada: jsonb("portada").$type<Foto>(),
  servicioId: integer("servicio_id").references(() => servicios.id),
  zonaId: integer("zona_id").references(() => zonas.id),
  seoTitulo: text("seo_titulo"),
  seoDescripcion: text("seo_descripcion"),
  estado: estado("estado").notNull().default("borrador"),
  publicadoAt: timestamp("publicado_at", { withTimezone: true }),
  updatedAt: actualizado(),
});

export const resenas = pgTable(
  "resenas",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    localidad: text("localidad"),
    servicio: text("servicio"),
    texto: text("texto").notNull(),
    estrellas: integer("estrellas").notNull(),
    fuente: text("fuente"),
    estado: estado("estado").notNull().default("borrador"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("estrellas_rango", sql`${t.estrellas} between 1 and 5`)],
);

export const consultas = pgTable("consultas", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  email: text("email"),
  localidad: text("localidad"),
  servicio: text("servicio"),
  tipoPropiedad: text("tipo_propiedad"),
  urgencia: text("urgencia"),
  mensaje: text("mensaje"),
  paginaOrigen: text("pagina_origen"),
  atribucion: jsonb("atribucion").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Clics en CTA (WhatsApp, teléfono). Los formularios quedan en `consultas`.
export const eventos = pgTable(
  "eventos",
  {
    id: serial("id").primaryKey(),
    tipo: text("tipo").notNull(),
    pagina: text("pagina"),
    servicio: text("servicio"),
    zona: text("zona"),
    atribucion: jsonb("atribucion").$type<Record<string, string>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("eventos_created_at_idx").on(t.createdAt)],
);

// Configuración editable desde el panel (IDs de GTM, códigos de verificación).
export const config = pgTable("config", {
  clave: text("clave").primaryKey(),
  valor: text("valor").notNull(),
  updatedAt: actualizado(),
});

// Intentos de login al panel: sirve para bloquear después de varios errores.
export const adminIntentos = pgTable(
  "admin_intentos",
  {
    id: serial("id").primaryKey(),
    ip: text("ip").notNull(),
    usuario: text("usuario"),
    exito: boolean("exito").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_intentos_ip_idx").on(t.ip, t.createdAt)],
);

// ---------- Agenda y finanzas (panel) ----------

export const estadoTrabajo = pgEnum("estado_trabajo", ["agendado", "en_curso", "terminado", "cancelado"]);
export const medioPago = pgEnum("medio_pago", ["efectivo", "transferencia", "mercadopago", "otro"]);

// Trabajos agendados. Los montos van en centavos (enteros): sin errores de redondeo.
// Un trabajo "todo el día" del 16 al 18 se guarda de 16 00:00 a 19 00:00 (fin exclusivo).
export const trabajos = pgTable(
  "trabajos",
  {
    id: serial("id").primaryKey(),
    titulo: text("titulo").notNull(),
    servicioId: integer("servicio_id").references(() => servicios.id),
    clienteNombre: text("cliente_nombre").notNull(),
    clienteTelefono: text("cliente_telefono"),
    direccion: text("direccion"),
    zonaId: integer("zona_id").references(() => zonas.id),
    localidadOtra: text("localidad_otra"),
    mapsUrl: text("maps_url"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    descripcion: text("descripcion"),
    notas: text("notas"),
    quienVa: text("quien_va"),
    inicio: timestamp("inicio", { withTimezone: true }).notNull(),
    fin: timestamp("fin", { withTimezone: true }).notNull(),
    todoElDia: boolean("todo_el_dia").notNull().default(false),
    precioCentavos: bigint("precio_centavos", { mode: "number" }),
    estado: estadoTrabajo("estado").notNull().default("agendado"),
    consultaId: integer("consulta_id").references(() => consultas.id, { onDelete: "set null" }),
    proyectoId: integer("proyecto_id").references(() => proyectos.id, { onDelete: "set null" }),
    fotos: jsonb("fotos").$type<Foto[]>().notNull().default([]),
    recordatorioMin: integer("recordatorio_min").default(60),
    recordatorioEnviadoAt: timestamp("recordatorio_enviado_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: actualizado(),
  },
  (t) => [
    index("trabajos_rango_idx").on(t.inicio, t.fin),
    check("trabajos_fin_despues_de_inicio", sql`${t.fin} >= ${t.inicio}`),
  ],
);

export const trabajoPagos = pgTable(
  "trabajo_pagos",
  {
    id: serial("id").primaryKey(),
    trabajoId: integer("trabajo_id")
      .notNull()
      .references(() => trabajos.id, { onDelete: "cascade" }),
    fecha: date("fecha").notNull(),
    montoCentavos: bigint("monto_centavos", { mode: "number" }).notNull(),
    medio: medioPago("medio").notNull(),
    nota: text("nota"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("trabajo_pagos_fecha_idx").on(t.fecha),
    index("trabajo_pagos_trabajo_idx").on(t.trabajoId),
    check("trabajo_pagos_monto_positivo", sql`${t.montoCentavos} > 0`),
  ],
);

export const trabajoGastos = pgTable(
  "trabajo_gastos",
  {
    id: serial("id").primaryKey(),
    trabajoId: integer("trabajo_id")
      .notNull()
      .references(() => trabajos.id, { onDelete: "cascade" }),
    fecha: date("fecha").notNull(),
    descripcion: text("descripcion").notNull(),
    montoCentavos: bigint("monto_centavos", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("trabajo_gastos_fecha_idx").on(t.fecha),
    index("trabajo_gastos_trabajo_idx").on(t.trabajoId),
    check("trabajo_gastos_monto_positivo", sql`${t.montoCentavos} > 0`),
  ],
);

// Dispositivos que activaron las notificaciones del panel (Web Push).
export const suscripcionesPush = pgTable("suscripciones_push", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  dispositivo: text("dispositivo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  ultimoEnvioAt: timestamp("ultimo_envio_at", { withTimezone: true }),
});
