# Voltis — sitio y panel

Monorepo pnpm. Plan, decisiones y pendientes en [PLAN.md](PLAN.md).

| Carpeta | Qué es |
| --- | --- |
| `apps/web` | Sitio (Next, export estático → Cloudflare Pages) y panel en `/admin` |
| `apps/api` | API Hono en Cloudflare Workers: formularios, clics, panel, fotos (R2) |
| `packages/db` | Schema Drizzle, migraciones y seed (Neon Postgres) |
| `packages/shared` | Datos del negocio (teléfono, localidades, servicios) y schemas zod |

## Correr en local

Requisitos: Node 22+, pnpm 10.

```bash
pnpm install
pnpm dev          # web en http://localhost:3000, API en http://localhost:8787
```

Variables locales (no se suben al repo):

- `apps/api/.dev.vars` — ver `apps/api/.dev.vars.example`
- `apps/web/.env.local` — ver `apps/web/.env.example`

En `pnpm dev` el sitio muestra también los borradores (con un cartel rojo). El build de
producción solo incluye lo publicado.

## Panel

http://localhost:3000/admin — en local entra sin login (`ADMIN_SIN_AUTH=1`). En producción
lo protege Cloudflare Access.

- **Conversiones:** formularios y clics en WhatsApp/teléfono por día, página, origen y zona.
- **Consultas:** leads del formulario, con botón para responder por WhatsApp.
- **Proyectos / Blog / Zonas / Reseñas:** alta, edición, fotos y estado borrador/publicado.
- **Publicar cambios:** regenera el sitio (en local no hace nada).

## Base de datos

```bash
pnpm db:migrate   # aplica migraciones
pnpm db:seed      # carga inicial (no pisa lo editado)
pnpm db:studio    # explorar tablas en el navegador
```

Para cambiar el schema: editar `packages/db/src/schema.ts`, después
`pnpm --filter @voltis/db db:generate` y `pnpm db:migrate`.
