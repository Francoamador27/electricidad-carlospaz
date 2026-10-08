CREATE TYPE "public"."estado" AS ENUM('borrador', 'publicado');--> statement-breakpoint
CREATE TABLE "consultas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"telefono" text NOT NULL,
	"email" text,
	"localidad" text,
	"servicio" text,
	"tipo_propiedad" text,
	"urgencia" text,
	"mensaje" text,
	"pagina_origen" text,
	"atribucion" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"titulo" text NOT NULL,
	"extracto" text NOT NULL,
	"contenido" text NOT NULL,
	"categoria" text,
	"portada" jsonb,
	"servicio_id" integer,
	"zona_id" integer,
	"seo_titulo" text,
	"seo_descripcion" text,
	"estado" "estado" DEFAULT 'borrador' NOT NULL,
	"publicado_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "proyectos" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text NOT NULL,
	"servicio_id" integer,
	"zona_id" integer,
	"fecha_trabajo" date,
	"fotos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"destacado" boolean DEFAULT false NOT NULL,
	"estado" "estado" DEFAULT 'borrador' NOT NULL,
	"publicado_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "proyectos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resenas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"localidad" text,
	"servicio" text,
	"texto" text NOT NULL,
	"estrellas" integer NOT NULL,
	"fuente" text,
	"estado" "estado" DEFAULT 'borrador' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "estrellas_rango" CHECK ("resenas"."estrellas" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "servicios" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "servicios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "zonas" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"texto" text NOT NULL,
	"seo_titulo" text,
	"seo_descripcion" text,
	"estado" "estado" DEFAULT 'borrador' NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "zonas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_zona_id_zonas_id_fk" FOREIGN KEY ("zona_id") REFERENCES "public"."zonas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_zona_id_zonas_id_fk" FOREIGN KEY ("zona_id") REFERENCES "public"."zonas"("id") ON DELETE no action ON UPDATE no action;