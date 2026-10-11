CREATE TYPE "public"."estado_trabajo" AS ENUM('agendado', 'en_curso', 'terminado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."medio_pago" AS ENUM('efectivo', 'transferencia', 'mercadopago', 'otro');--> statement-breakpoint
CREATE TABLE "suscripciones_push" (
	"id" serial PRIMARY KEY NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"dispositivo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_envio_at" timestamp with time zone,
	CONSTRAINT "suscripciones_push_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "trabajo_gastos" (
	"id" serial PRIMARY KEY NOT NULL,
	"trabajo_id" integer NOT NULL,
	"fecha" date NOT NULL,
	"descripcion" text NOT NULL,
	"monto_centavos" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trabajo_gastos_monto_positivo" CHECK ("trabajo_gastos"."monto_centavos" > 0)
);
--> statement-breakpoint
CREATE TABLE "trabajo_pagos" (
	"id" serial PRIMARY KEY NOT NULL,
	"trabajo_id" integer NOT NULL,
	"fecha" date NOT NULL,
	"monto_centavos" bigint NOT NULL,
	"medio" "medio_pago" NOT NULL,
	"nota" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trabajo_pagos_monto_positivo" CHECK ("trabajo_pagos"."monto_centavos" > 0)
);
--> statement-breakpoint
CREATE TABLE "trabajos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"servicio_id" integer,
	"cliente_nombre" text NOT NULL,
	"cliente_telefono" text,
	"direccion" text,
	"zona_id" integer,
	"localidad_otra" text,
	"maps_url" text,
	"lat" double precision,
	"lng" double precision,
	"descripcion" text,
	"notas" text,
	"quien_va" text,
	"inicio" timestamp with time zone NOT NULL,
	"fin" timestamp with time zone NOT NULL,
	"todo_el_dia" boolean DEFAULT false NOT NULL,
	"precio_centavos" bigint,
	"estado" "estado_trabajo" DEFAULT 'agendado' NOT NULL,
	"consulta_id" integer,
	"proyecto_id" integer,
	"fotos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"recordatorio_min" integer DEFAULT 60,
	"recordatorio_enviado_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trabajos_fin_despues_de_inicio" CHECK ("trabajos"."fin" >= "trabajos"."inicio")
);
--> statement-breakpoint
ALTER TABLE "trabajo_gastos" ADD CONSTRAINT "trabajo_gastos_trabajo_id_trabajos_id_fk" FOREIGN KEY ("trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajo_pagos" ADD CONSTRAINT "trabajo_pagos_trabajo_id_trabajos_id_fk" FOREIGN KEY ("trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajos" ADD CONSTRAINT "trabajos_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajos" ADD CONSTRAINT "trabajos_zona_id_zonas_id_fk" FOREIGN KEY ("zona_id") REFERENCES "public"."zonas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajos" ADD CONSTRAINT "trabajos_consulta_id_consultas_id_fk" FOREIGN KEY ("consulta_id") REFERENCES "public"."consultas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajos" ADD CONSTRAINT "trabajos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "trabajo_gastos_fecha_idx" ON "trabajo_gastos" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "trabajo_gastos_trabajo_idx" ON "trabajo_gastos" USING btree ("trabajo_id");--> statement-breakpoint
CREATE INDEX "trabajo_pagos_fecha_idx" ON "trabajo_pagos" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "trabajo_pagos_trabajo_idx" ON "trabajo_pagos" USING btree ("trabajo_id");--> statement-breakpoint
CREATE INDEX "trabajos_rango_idx" ON "trabajos" USING btree ("inicio","fin");