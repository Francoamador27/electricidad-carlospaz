CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" text NOT NULL,
	"pagina" text,
	"servicio" text,
	"zona" text,
	"atribucion" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "eventos_created_at_idx" ON "eventos" USING btree ("created_at");