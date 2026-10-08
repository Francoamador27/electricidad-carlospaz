# Despliegue en Cloudflare

Guía para pasar la rama `monorepo` a producción en **`electricidadcarlospaz.proyectoswebsite.com`**.

> **Orden importante:** primero configurá Cloudflare (pasos 1 a 6) y recién después uní `monorepo`
> con `master` (paso 7). Si el código nuevo llega a `master` con la configuración vieja de Pages,
> el build falla.

## 1. Neon (base de datos)

1. Proyecto **Voltis** → **Roles** → `neondb_owner` → **Reset password**. (La contraseña anterior
   quedó expuesta durante el desarrollo.)
2. **Connect** → copiá la connection string nueva (con pooling). Es `DATABASE_URL` en los pasos 5 y 6.
3. Actualizá también `apps/api/.dev.vars` y `apps/web/.env.local` en tu PC.

## 2. Dominio en Cloudflare

El sitio es un subdominio de `proyectoswebsite.com`, así que **`proyectoswebsite.com` tiene que estar
en tu cuenta de Cloudflare** (Add a site → cambiar los nameservers donde lo compraste). La API, el
panel y las fotos se sirven como rutas de `electricidadcarlospaz.proyectoswebsite.com`.

## 3. Servicios de Cloudflare

| Servicio | Dónde | Qué hacer | Qué anotar |
| --- | --- | --- | --- |
| **R2** (fotos) | R2 → Create bucket | Nombre `voltis-imagenes`. No hace falta dominio propio: las fotos se sirven por `/img/*` del Worker | — |
| **Turnstile** (antispam) | Turnstile → Add widget | Hostname `electricidadcarlospaz.proyectoswebsite.com`, modo Managed | Site key y Secret key |
| **Email Routing** (avisos) | `proyectoswebsite.com` → Email → Email Routing | Activar. Destination addresses → agregar y verificar `francohugoamador25@gmail.com` | — |

## 4. Cloudflare Access (login del panel)

1. **Zero Trust** → Settings → anotá el *team domain* (`algo.cloudflareaccess.com`).
2. Access → Applications → **Add an application** → Self-hosted.
   - Dominio: `electricidadcarlospaz.proyectoswebsite.com`, ruta `admin*`.
   - Policy: Allow → Emails → tu email (y el de quien deba entrar).
3. En la aplicación creada, copiá el **Application Audience (AUD) Tag**.

## 5. Pages (sitio web)

Workers & Pages → tu proyecto de Pages → **Settings**:

**Build**

| Campo | Valor |
| --- | --- |
| Root directory | *(vacío)* |
| Build command | `pnpm --filter @voltis/web build` |
| Build output directory | `apps/web/out` |

**Variables de entorno** (Production)

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | connection string de Neon |
| `NEXT_PUBLIC_SITE_URL` | `https://electricidadcarlospaz.proyectoswebsite.com` |
| `NEXT_PUBLIC_API_URL` | *(no la definas: la API vive en el mismo dominio)* |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | site key de Turnstile |
| `NEXT_PUBLIC_IMG_URL` | `https://electricidadcarlospaz.proyectoswebsite.com/img` |
| `NODE_VERSION` | `22` |

**Custom domains** → agregá `electricidadcarlospaz.proyectoswebsite.com` (si ya está, dejalo).

**Builds → Deploy hooks** → Add deploy hook (rama `master`) → copiá la URL.

## 6. Worker (API)

Workers & Pages → **Create** → Import a repository → este repo.

| Campo | Valor |
| --- | --- |
| Root directory | `apps/api` |
| Deploy command | `npx wrangler deploy` |

`apps/api/wrangler.toml` ya tiene las rutas (`/api/*`, `/admin/api/*`, `/img/*`), el bucket R2 y el
envío de emails configurados para este dominio. No hay que tocarlo.

**Settings → Variables and Secrets** (tipo *Secret*):

| Secreto | Valor |
| --- | --- |
| `DATABASE_URL` | connection string de Neon |
| `TURNSTILE_SECRET` | secret key de Turnstile |
| `AVISO_DESTINO` | `francohugoamador25@gmail.com` |
| `ACCESS_TEAM_DOMAIN` | `algo.cloudflareaccess.com` |
| `ACCESS_AUD` | AUD tag de Access |
| `PAGES_DEPLOY_HOOK_URL` | URL del deploy hook de Pages |

**Nunca** cargues `ADMIN_SIN_AUTH` en producción.

## 7. Pasar a producción

Uní la rama `monorepo` con `master` (Pull request en GitHub → Merge). Cloudflare construye el sitio
y la API automáticamente.

## 8. Verificar

- [ ] `https://electricidadcarlospaz.proyectoswebsite.com` carga; `/sitemap.xml`, `/robots.txt` y `/llms.txt` responden.
- [ ] Formulario de presupuesto → llega el email y aparece en Panel → Consultas.
- [ ] `/admin` pide el código por email y deja entrar solo a los emails permitidos.
- [ ] Subir una foto a un proyecto → **Publicar cambios** → en 1–2 minutos se ve en el sitio.
- [ ] `https://<proyecto>.pages.dev` redirige al dominio (Pages → Custom domains).
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) móvil ≥ 90 y [prueba de resultados enriquecidos](https://search.google.com/test/rich-results) sin errores.

## 9. Google, Meta y Bing

Desde **Panel → Configuración** (cada campo tiene su paso a paso):

1. Google Tag Manager: crear contenedor, cargar el ID. Dentro de GTM: etiqueta de GA4 y eventos
   `generate_lead`, `click_whatsapp`, `click_telefono`.
2. Search Console: verificar con la etiqueta HTML y enviar `/sitemap.xml`.
3. Bing Webmaster Tools: importar desde Search Console (Bing alimenta a ChatGPT y Copilot).
4. Después de cada cambio en Configuración: **Publicar cambios**.
