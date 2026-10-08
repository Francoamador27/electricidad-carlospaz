# Voltis — sitio y panel

Monorepo pnpm. Plan, decisiones y pendientes en [PLAN.md](PLAN.md).

| Carpeta | Qué es |
| --- | --- |
| `apps/web` | Sitio (Next, export estático → Cloudflare Pages) y panel en `/admin` |
| `apps/api` | API Hono en Cloudflare Workers: formularios, clics, panel, fotos (Vercel Blob) |
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

## Tests

```bash
pnpm test                                   # build + todos los tests
pnpm --filter @voltis/web test:e2e          # solo tests (sobre el último build)
pnpm --filter @voltis/web exec playwright show-report   # reporte con capturas de los fallos
```

Playwright con Chromium, en escritorio y celular. Cubren:

- **SEO:** title, description, canonical, h1 y JSON-LD válido en cada página; sitemap, robots, `llms.txt`.
- **Contenido:** sin urgencias 24/7, sin citas legales dudosas, sin borradores publicados.
- **Navegación:** recorre el sitio buscando links rotos; menú y footer.
- **Formularios:** guardan la consulta con UTM/gclid, abren WhatsApp y miden `generate_lead`; si la API falla, WhatsApp se abre igual.
- **Tracking:** clics en WhatsApp/teléfono y `ver_proyecto`.
- **Celular:** sin scroll horizontal.
- **Panel:** conversiones, consultas, alta de proyecto con foto, publicar y configuración.
- **API:** validaciones, honeypot, Turnstile, CORS y que el panel quede cerrado sin Cloudflare Access.

Los tests del sitio y del panel simulan la API: no escriben en la base.
