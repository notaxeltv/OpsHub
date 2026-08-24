# OpsHub — Architettura

## Panoramica

OpsHub è un SaaS B2B multi-tenant per PMI (2–20 persone) che gestiscono clienti, commesse, produzione e margini. Il progetto è un **monorepo npm** con due applicazioni:

```
opshub/
├── apps/api/          # NestJS REST API
├── apps/web/          # Next.js 15 frontend
├── packages/config/   # Config TypeScript/ESLint condivisa
├── scripts/           # Script dev (graphify, ecc.)
└── graphify-out/      # Knowledge graph (generato, non committato)
```

## Scelte tecnologiche

### Prisma vs Drizzle → **Prisma**

| Criterio | Prisma | Drizzle |
|----------|--------|---------|
| Integrazione NestJS | Eccellente (`PrismaService` globale) | Richiede più boilerplate |
| Migrazioni | Mature, SQL generato | Buone ma meno tooling |
| Relazioni multi-tenant | Decoratori + indici composti chiari | Equivalente |
| DX team | Schema dichiarativo, Prisma Studio | SQL-first, più controllo |

**Scelta:** Prisma per velocità di sviluppo MVP, migrazioni affidabili e type-safety end-to-end.

### REST vs GraphQL → **REST**

- CRUD dominio ben definito, nessuna necessità di query ad-hoc complesse
- Caching HTTP standard, più semplice per TanStack Query
- GraphQL previsto come evoluzione futura se servono dashboard altamente personalizzabili

### Auth → **JWT + Refresh Token**

- Access token breve (15m) in header `Authorization`
- Refresh token (7d) in body, salvato in DB
- Header `x-organization-id` per contesto tenant

### Graphify (tooling dev)

[Graphify](https://github.com/Graphify-Labs/graphify) è integrato come skill Cursor per navigare il codebase con un knowledge graph AST-based, riducendo token e letture manuali. Vedi `docs/GRAPHIFY.md`.

## Moduli backend

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Auth      │────▶│  Organizations   │────▶│   Users     │
└─────────────┘     └──────────────────┘     └─────────────┘
       │                     │
       ▼                     ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Customers  │────▶│     Orders       │────▶│ Production  │
└─────────────┘     └──────────────────┘     └─────────────┘
                            │                        │
                            ▼                        ▼
                    ┌──────────────┐         ┌─────────────┐
                    │   Reports    │         │  Inventory  │
                    └──────────────┘         └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Billing    │  (TODO: Stripe)
                    └──────────────┘
```

## Multi-tenant

Ogni entità di dominio ha `organizationId` con indice composto `(organizationId, id)`. Il `TenantGuard` verifica membership e popola `request.tenant` prima di ogni handler protetto.

## Logging e osservabilità

- Log strutturato su stdout via `LoggingInterceptor`
- `HttpExceptionFilter` centralizzato
- Pronto per Sentry: variabile `SENTRY_DSN` in `.env.example`

## Export

- CSV: `GET /api/reports/margins/export/csv`
- PDF: `GET /api/reports/orders/:id/pdf` (pdfkit)

## Testing

- Unit: `margin.service.spec.ts` (calcolo margini)
- E2E: `test/app.e2e-spec.ts` (register → customer → dashboard)

## Deploy

- Docker Compose per sviluppo locale
- GitHub Actions: CI (lint, typecheck, test) + Deploy (build immagini Docker)
