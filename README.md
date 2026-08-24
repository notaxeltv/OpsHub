# OpsHub

**B2B operations platform** for small businesses: lightweight CRM, orders, production tracking, inventory, margins, and reports. Multi-tenant SaaS MVP with a production-ready stack.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/notaxeltv/OpsHub&branch=main)

## Features

- **Multi-tenant** — organizations, members, role-based access
- **CRM** — customers, contacts, search & pagination
- **Orders** — line items, status workflow, PDF export
- **Production** — time & material logging per order
- **Inventory** — materials, stock movements, low-stock alerts, auto-deduct from production
- **Reports** — margin calculation per order, CSV export
- **Dashboard** — KPI overview
- **i18n** — English, Italian, French, German, Spanish (`/en`, `/it`, `/fr`, `/de`, `/es`)
- **Theming** — light / dark / system
- **Responsive** — mobile drawer navigation, scrollable tables

## Live demo

| Environment | URL |
|-------------|-----|
| **Render** (recommended) | Deploy via [Blueprint](render.yaml) → `https://opshub-web.onrender.com/en` |
| **Local** | http://localhost:3000/en |

**Demo credentials**

- Email: `demo@opshub.local`
- Password: `password123`

Seed demo data: `npm run prisma:seed -w @opshub/api`

## Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind, shadcn/ui, TanStack Query, next-intl, next-themes |
| **Backend** | NestJS, Prisma, PostgreSQL |
| **Dev tooling** | [Graphify](https://github.com/Graphify-Labs/graphify) (codebase knowledge graph) |
| **Deploy** | Docker, GitHub Actions, Render Blueprint |

## Quick start

### Docker (recommended)

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000/en |
| API | http://localhost:3001/api |
| Health | http://localhost:3001/api/health |

### Local development

```bash
# 1. Start PostgreSQL
docker compose up db -d

# 2. Install dependencies
npm install

# 3. Configure env
cp apps/api/.env.example apps/api/.env

# 4. Run migrations
npm run prisma:deploy -w @opshub/api

# 5. Seed demo data (optional)
npm run prisma:seed -w @opshub/api

# 6. Start dev servers
npm run dev:api   # port 3001
npm run dev:web   # port 3000
```

Open http://localhost:3000/en (or `/it`, `/fr`, `/de`, `/es`).

## Deploy to Render

1. Click **Deploy to Render** above, or open:
   https://render.com/deploy?repo=https://github.com/notaxeltv/OpsHub&branch=main
2. Confirm the Blueprint (`render.yaml`) — creates PostgreSQL + API + Web services
3. Wait ~10–15 minutes for the first build
4. Visit `https://opshub-web.onrender.com/en`

For CI deploys, add GitHub secrets `RENDER_API_KEY`, `RENDER_SERVICE_ID_WEB`, `RENDER_SERVICE_ID_API` and use `.github/workflows/render-deploy.yml`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all workspaces in dev mode |
| `npm run dev:api` | Start NestJS API (port 3001) |
| `npm run dev:web` | Start Next.js web (port 3000) |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run lint` | Lint |
| `npm run typecheck` | Type check |
| `npm run graphify` | Generate knowledge graph |

### Marketing assets

```bash
npm run dev:api & npm run dev:web &
npm run prisma:seed -w @opshub/api

cd apps/web
npm run marketing:screenshots   # Playwright screenshots (EN)
npm run marketing:video         # Demo walkthrough video (~34s)
```

Output: `docs/marketing/screenshots/` and `docs/marketing/video/`. See [docs/marketing/README.md](docs/marketing/README.md).

## Graphify (codebase navigation)

```bash
pip install graphifyy
npm run graphify                        # generate knowledge graph
npm run graphify:query -- "auth tenant" # targeted query
```

See [docs/GRAPHIFY.md](docs/GRAPHIFY.md).

## Tests

```bash
npm run test -w @opshub/api          # API unit tests
npm run test:e2e -w @opshub/api      # API e2e (requires DB)
npm run test:e2e -w @opshub/web      # Playwright frontend (auth)
```

## Documentation

| Doc | Description |
|-----|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical choices and modules |
| [DOMAIN.md](DOMAIN.md) | Domain entities and flows |
| [docs/GRAPHIFY.md](docs/GRAPHIFY.md) | Graphify integration |
| [docs/SIDEPROJECTORS.md](docs/SIDEPROJECTORS.md) | SideProjectors listing guide |
| [docs/marketing/](docs/marketing/) | Screenshots, demo video, listing copy |

## Adding a backend module

1. Create `apps/api/src/<module>/`
2. Add `*.module.ts`, `*.service.ts`, `*.controller.ts`, `dto/`
3. Import in `app.module.ts`
4. Add entities in `prisma/schema.prisma` with `organizationId`
5. Run `npm run prisma:migrate -w @opshub/api`
6. Update graph: `npm run graphify:update`

## MVP checklist

- [x] Registration + organization creation
- [x] Auth middleware + automatic refresh token
- [x] Organization switcher
- [x] Customers, contacts, orders (CRUD + pagination)
- [x] Production logging (time & materials)
- [x] Inventory with auto-deduct and low-stock alerts
- [x] Margin reports + CSV/PDF export
- [x] Dashboard KPIs
- [x] Demo seed data
- [x] API e2e + Playwright frontend tests
- [x] 5 languages + dark mode + responsive layout
- [x] Sentry integration (`SENTRY_DSN`)
- [x] Docker + Render deploy + GHCR images

## License

Proprietary — OpsHub
