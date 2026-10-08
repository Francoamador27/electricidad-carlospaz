# Voltis — Plan de trabajo (v2)

> Reemplaza a `plan.md` (v1). Parte del sitio que ya existe en este repo. Fecha: 2026-10-08.
> Regla: todo el trabajo es local. Nada se pushea ni se deploya sin pedido explícito de Franco.
> **[A CONFIRMAR]** = falta respuesta de Franco; se avanza con placeholders.

## 0. Punto de partida

El repo ya tiene un sitio en Next 16 + Tailwind 4 con `output: "export"`:

- Páginas: home, `/servicios` + 6 servicios con diseño propio, `/blog` + 4 posts (JSX), `/proyectos`, `/about`, `/contacto`, `/presupuesto`.
- SEO: metadata, `sitemap.ts`, `robots.ts` (con `force-static`), JSON-LD `ElectricalContractor` + `WebSite`, `llms.txt`, verificación de Search Console.
- Contenido escrito directamente en el código. No hay base ni API (`lib/api.ts` apunta a un backend inexistente).
- `/presupuesto` arma un mensaje y abre WhatsApp; `/contacto` tiene el envío comentado.
- Teléfono/WhatsApp `+54 9 351 387-3029` repetido en ~30 lugares.
- Las reseñas de la home son de ejemplo, no reales.

## 1. Decisiones tomadas

| Tema | Decisión |
| --- | --- |
| Marca | **Voltis** (v1 decía "Voltius" por error). |
| Repo | Monorepo pnpm: `apps/web` (Next actual), `apps/api` (Hono en Workers), `packages/shared` (zod + tipos + datos del negocio). |
| URLs | Se mantienen las actuales (`/about`, `/presupuesto`, slugs de servicios). Se suman `/zonas`, `/zonas/[slug]`, `/proyectos/[slug]`, `/certificado-instalacion-electrica-apta` y `/politica-de-privacidad`. |
| Servicios | Quedan en código con su diseño. La base solo guarda `slug` + `nombre` para relacionar proyectos y posts. |
| Formulario | `POST /api/consultas`, que guarda en Neon y manda email; dispara `generate_lead` y después abre WhatsApp con el mensaje armado. Si la API falla, abre WhatsApp igual. |
| Reseñas | Se oculta la sección hasta tener reseñas reales. Tabla `resenas` cargable desde el panel. Sin `aggregateRating` en el JSON-LD. |
| Zonas | Las 14 localidades. Claude redacta un borrador propio por zona y Franco lo revisa. |
| API en producción | Worker routes en el mismo dominio (`/api/*`, `/admin/api/*`), sin CORS en producción. Requiere el DNS del dominio en Cloudflare. |
| Dev local | Next en `:3000` llama a `NEXT_PUBLIC_API_URL=http://localhost:8787`; CORS habilitado solo para `localhost`. Sin `rewrites` (no son compatibles con el export). |
| Panel | Páginas estáticas `/admin` dentro de `apps/web` (cliente), que consumen `/admin/api/*`. Protegido con Cloudflare Access, y el Worker valida el JWT (`Cf-Access-Jwt-Assertion`, team domain + AUD). |
| Email | Binding `send_email` de Cloudflare Email Routing, hacia la casilla de Franco (gratis). |
| GTM | `@next/third-parties` con su carga normal (`afterInteractive`). No se difiere hasta la interacción para no perder pageviews ni `gclid`. |
| Publicación | Botón global "Publicar cambios" en el panel, que llama al deploy hook de Pages ante cualquier cambio. Límite: 500 builds/mes. |

## 2. Stack

| Pieza | Tecnología |
| --- | --- |
| Web | Next 16 App Router, `output: "export"`, sin `trailingSlash` (mantiene las URLs indexadas), `images.unoptimized` → Cloudflare Pages |
| API | Hono en Cloudflare Workers (100k req/día, 10 ms CPU) |
| Base | Neon Postgres + `@neondatabase/serverless` (HTTP) + Drizzle. Ramas `main` y `dev`. |
| Imágenes | R2 con dominio propio (`img.<dominio>`); `r2.dev` no sirve para producción. |
| Auth panel | Cloudflare Access (gratis hasta 50 usuarios) |
| Medición | GTM → GA4 / Ads |
| Anti-spam | Honeypot + Turnstile, validado en el Worker con `siteverify` |

El build de `web` lee Neon con `DATABASE_URL`: producción usa la rama `main` y las previews la rama `dev`.

## 3. Estructura

```
electricidad-carlospaz/
├── apps/
│   ├── web/              # el Next actual, movido sin cambios de diseño
│   │   ├── app/
│   │   │   ├── (sitio actual)
│   │   │   ├── zonas/ , zonas/[slug]/
│   │   │   ├── proyectos/[slug]/
│   │   │   ├── certificado-instalacion-electrica-apta/
│   │   │   ├── politica-de-privacidad/
│   │   │   └── admin/    # panel (cliente), noindex
│   │   ├── lib/
│   │   │   ├── db.ts        # lectura de Neon en build
│   │   │   ├── tracking.ts  # track() + UTM/gclid
│   │   │   └── site.ts      # SITE_URL
│   │   └── public/_redirects, _headers
│   └── api/
│       ├── src/{index.ts, routes/, db/schema.ts}
│       ├── drizzle/      # migraciones
│       ├── wrangler.toml
│       └── .dev.vars     # gitignored
├── packages/shared/      # zod, tipos, NEGOCIO (teléfono, WhatsApp, horario, localidades)
├── pnpm-workspace.yaml
└── package.json          # dev: pnpm -r --parallel dev
```

## 4. Modelo de datos

```sql
create type estado as enum ('borrador', 'publicado');

create table servicios (            -- solo para relaciones; el contenido vive en código
  id serial primary key,
  slug text unique not null,
  nombre text not null,
  orden int not null default 0
);

create table zonas (
  id serial primary key,
  slug text unique not null,
  nombre text not null,
  texto text not null,               -- Markdown propio de la zona
  seo_titulo text, seo_descripcion text,
  estado estado not null default 'borrador',
  orden int not null default 0,
  updated_at timestamptz not null default now()
);

create table proyectos (
  id serial primary key,
  slug text unique not null,
  titulo text not null,
  descripcion text not null,         -- Markdown
  servicio_id int references servicios(id),
  zona_id int references zonas(id),
  fecha_trabajo date,
  fotos jsonb not null default '[]', -- [{key, anchos:[480,960,1600], ancho, alto, alt, tipo:'antes'|'despues'|'general'}]
  destacado boolean not null default false,
  estado estado not null default 'borrador',
  publicado_at timestamptz,
  updated_at timestamptz not null default now()
);

create table posts (
  id serial primary key,
  slug text unique not null,
  titulo text not null,
  extracto text not null,
  contenido text not null,           -- Markdown
  categoria text,
  portada jsonb,                     -- mismo formato que una foto
  servicio_id int references servicios(id),
  zona_id int references zonas(id),
  seo_titulo text, seo_descripcion text,
  estado estado not null default 'borrador',
  publicado_at timestamptz,
  updated_at timestamptz not null default now()
);

create table resenas (
  id serial primary key,
  nombre text not null,              -- "Marcela R."
  localidad text,
  servicio text,
  texto text not null,
  estrellas int not null check (estrellas between 1 and 5),
  fuente text,                       -- 'google' | 'whatsapp' | ...
  estado estado not null default 'borrador',
  created_at timestamptz not null default now()
);

create table consultas (
  id serial primary key,
  nombre text not null,
  telefono text not null,
  email text,
  localidad text,
  servicio text,
  tipo_propiedad text,
  urgencia text,
  mensaje text,
  pagina_origen text,
  atribucion jsonb,                  -- utm_*, gclid, gbraid, wbraid
  created_at timestamptz not null default now()
);
```

`updated_at` se actualiza con `$onUpdate` de Drizzle.

## 5. API

| Método | Ruta | Auth | Función |
| --- | --- | --- | --- |
| POST | `/api/consultas` | Pública | zod + honeypot + Turnstile → insert → email. Rate limiting con binding si hay spam. |
| GET/POST/PUT/DELETE | `/admin/api/{posts,proyectos,zonas,resenas}` | Access | CRUD |
| GET | `/admin/api/consultas` | Access | Listado de leads |
| POST | `/admin/api/uploads` | Access | Recibe WebP ya generados en el navegador y los guarda en R2 |
| POST | `/admin/api/publicar` | Access | Llama al deploy hook de Pages |

Uploads: el navegador genera los anchos con canvas. Si `toBlob('image/webp')` devuelve otro tipo (Safari), se usa JPEG. Recodificar borra el EXIF, incluido el GPS de las casas de los clientes.

## 6. SEO técnico (cambios sobre lo existente)

- Títulos por tipo: servicio `"<Servicio> en Carlos Paz y Punilla"`, zona `"Electricista en <Localidad>"`, proyecto `"<Título> en <Localidad>"`, con el template `%s | Voltis`.
- Sin barra final: Pages sirve `about.html` en `/about`; canonicals y sitemap sin barra, igual que hoy.
- `<html lang="es-AR">` (hoy dice `es`).
- JSON-LD: `areaServed` desde `packages/shared`, `Service` por servicio, `BlogPosting`, `BreadcrumbList` en páginas internas. `WebSite` sin SearchAction.
- Redirección del dominio `*.pages.dev` de producción al dominio propio. `www` → sin `www`. `/admin` con noindex y bloqueado en robots.
- Las previews de Pages ya salen con `X-Robots-Tag: noindex`.
- `sitemap.ts` generado desde la base (posts, proyectos y zonas publicados).
- `llms.txt` generado en el build para que no quede desactualizado.

## 7. Medición

`track(evento, params)` en `apps/web/lib/tracking.ts`, usado en todos los CTA. Para no tocar ~30 links, un único listener delegado captura clics en `wa.me` y `tel:` y detecta servicio y zona desde la página.

| Evento | Disparo |
| --- | --- |
| `click_whatsapp` | clic en link `wa.me` |
| `click_telefono` | clic en `tel:` |
| `generate_lead` | respuesta 2xx de `/api/consultas` |
| `ver_proyecto` | vista de `/proyectos/[slug]` |

UTM, `gclid`, `gbraid` y `wbraid` se guardan en `sessionStorage` (con try/catch) y se envían con el formulario.

## 8. Fases

### Fase 1 — Monorepo (local)
- [x] Mover el Next a `apps/web`, de npm a pnpm, y verificar que `pnpm build` genere el mismo `out/`.
- [x] `packages/shared` con los datos del negocio; reemplazar los ~30 teléfonos hardcodeados.
- [x] `apps/api` con Hono + Drizzle, schema y migraciones; `wrangler dev` en `:8787`.
- [x] Seed: servicios, 14 zonas (borradores) y los 4 posts actuales pasados a Markdown.

**Aceptación:** `pnpm dev` levanta web y API; el sitio se ve igual que hoy.

### Fase 2 — Sitio conectado
- [x] Páginas nuevas: zonas, detalle de proyecto, privacidad, certificado (Ley 10.281) y cámaras de seguridad.
- [x] Blog, proyectos, zonas, reseñas y sitemap leen de la base en el build (en `next dev` se ven también los borradores).
- [x] Formulario `/presupuesto` y `/contacto` → API → WhatsApp (honeypot + Turnstile).
- [x] Reseñas ocultas; GTM + eventos (clics también en tabla `eventos`); JSON-LD Service/BlogPosting/BreadcrumbList; `lang="es-AR"`.
- [x] `/contacto` y `/presupuesto` con title y description propios.
- [x] Lint sin errores.

**Aceptación:** build estático sin errores, Rich Results Test sin errores, PageSpeed móvil ≥ 90, eventos visibles en la vista previa de GTM.

### Fase 3 — Panel
- [x] `/admin` con CRUD de proyectos, posts, zonas y reseñas, editor Markdown con vista previa, subida de fotos a R2 (WebP en el navegador) y botón "Publicar cambios".
- [x] Panel de conversiones (formularios + clics WhatsApp/teléfono por día, página, origen y zona) y listado de consultas.
- [x] Tests automáticos (Playwright): 65 tests de SEO, contenido, navegación, formularios, tracking, celular, panel y API.
- [ ] Probar el panel en el navegador desde el celular (subida de fotos).

### Fase 4 — Puesta en producción (solo cuando Franco lo pida)
- [ ] Neon, R2, Access, Email Routing, Pages y Workers conectados a GitHub; dominio en Cloudflare.

### Fase 5 — Crecimiento (fuera del código)
- [ ] Perfil de Empresa de Google, mismo nombre/teléfono/dirección en todos lados, pedido de reseñas, Search Console mensual, Google Ads.

## 9. Pendientes de Franco

- [ ] Dominio definitivo (hoy: `electricidadcarlospaz.proyectoswebsite.com`).
- [ ] ¿Dirección física o solo área de servicio? Hoy el JSON-LD publica código postal y coordenadas.
- [ ] Reseñas reales y fotos de trabajos reales (los proyectos actuales usan imágenes de stock).
- [ ] Revisar los borradores de las 14 zonas (`apps/api/seed/zonas.ts`) antes de publicarlos.
- [ ] Razón social / CUIT y email de contacto para la política de privacidad.
- [ ] Reemplazar los 7 proyectos de referencia por trabajos reales (se borran desde el panel).

## 10. Decisiones de contenido (2026-10-08)

- Horario: L–V 8 a 19 h, sábados 8 a 13 h. Sin urgencias 24/7.
- Se mantiene "más de 500 clientes".
- Se suma Cabalango (15 localidades) y el servicio de cámaras de seguridad.
- Voltis emite el Certificado de Instalación Eléctrica Apta.
- Avisos de consultas a francohugoamador25@gmail.com (variable AVISO_DESTINO, fuera del repo).
- Sin Instagram ni Facebook por ahora.
- GTM y códigos de verificación se cargan desde /admin/configuracion.
- `llms.txt` y `llms-full.txt` se generan desde la base; robots permite rastreadores de IA.
