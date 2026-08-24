# OpsHub

Sistema operativo SaaS B2B multi-tenant per piccole attività: CRM leggero, commesse, produzione, margini e report.

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind, shadcn/ui, TanStack Query, Zod
- **Backend:** NestJS, Prisma, PostgreSQL
- **Dev tooling:** [Graphify](https://github.com/Graphify-Labs/graphify) (knowledge graph per navigazione codebase)

## Avvio rapido

### Con Docker (consigliato)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:3001/api
- Health: http://localhost:3001/api/health

### Sviluppo locale

```bash
# 1. Avvia PostgreSQL
docker compose up db -d

# 2. Installa dipendenze
npm install

# 3. Configura env
cp apps/api/.env.example apps/api/.env

# 4. Migrazioni
npm run prisma:deploy -w @opshub/api

# 5. Avvia in dev
npm run dev:api   # porta 3001
npm run dev:web   # porta 3000
```

## Graphify (navigazione codebase)

```bash
pip install graphifyy
npm run graphify              # genera knowledge graph
npm run graphify:query -- "auth tenant"  # query mirata
```

Vedi [docs/GRAPHIFY.md](docs/GRAPHIFY.md).

## Script

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia tutti i workspace in dev |
| `npm run build` | Build produzione |
| `npm run test` | Test unitari |
| `npm run lint` | Lint |
| `npm run typecheck` | Type check |
| `npm run graphify` | Genera knowledge graph |

## Test

```bash
npm run test -w @opshub/api          # unit test
npm run test:e2e -w @opshub/api      # e2e (richiede DB)
```

## Documentazione

- [ARCHITECTURE.md](ARCHITECTURE.md) — scelte tecniche e moduli
- [DOMAIN.md](DOMAIN.md) — entità e flussi di dominio
- [docs/GRAPHIFY.md](docs/GRAPHIFY.md) — integrazione Graphify

## Aggiungere un nuovo modulo backend

1. Crea cartella `apps/api/src/<modulo>/`
2. Aggiungi `*.module.ts`, `*.service.ts`, `*.controller.ts`, `dto/`
3. Importa in `app.module.ts`
4. Aggiungi entità in `prisma/schema.prisma` con `organizationId`
5. Esegui `npm run prisma:migrate -w @opshub/api`
6. Aggiorna il grafo: `npm run graphify:update`

## MVP funzionante

- ✅ Registrazione + creazione organizzazione
- ✅ Auth middleware frontend + refresh token automatico
- ✅ Organization switcher nell'header
- ✅ CRUD clienti con paginazione e ricerca
- ✅ CRUD contatti per cliente
- ✅ CRUD commesse con righe, modifica e cambio stato
- ✅ Registrazione ore/materiali (produzione)
- ✅ Pagina magazzino (materiali + movimenti)
- ✅ Calcolo margini per commessa
- ✅ Dashboard KPI
- ✅ Export CSV margini, PDF commessa
- ✅ Seed dati demo (`npm run prisma:seed -w @opshub/api`)
- ✅ Test e2e API + Playwright frontend (auth)
- ✅ Subscription Stripe (checkout, webhook, enforcement piani)
- ✅ Magazzino: auto-scarico da produzione + alert scorte minime
- ✅ Sentry integrato (con `SENTRY_DSN`)
- ✅ Deploy: push immagini su GHCR

## Licenza

Proprietario — OpsHub
