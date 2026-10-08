# Voltis

Monorepo pnpm. Plan y decisiones en [PLAN.md](PLAN.md).

- `apps/web`: Next (export estático) → Cloudflare Pages. Ver @apps/web/AGENTS.md
- `apps/api`: Hono en Cloudflare Workers + Drizzle/Neon.
- `packages/shared`: datos del negocio, schemas zod y tipos compartidos.

Trabajo solo local: no hacer push ni deploy sin pedido explícito.
