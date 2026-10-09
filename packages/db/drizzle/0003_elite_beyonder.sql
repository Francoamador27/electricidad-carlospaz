CREATE TABLE "admin_intentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" text NOT NULL,
	"usuario" text,
	"exito" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admin_intentos_ip_idx" ON "admin_intentos" USING btree ("ip","created_at");