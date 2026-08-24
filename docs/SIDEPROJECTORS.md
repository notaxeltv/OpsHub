# SideProjectors Listing — OpsHub

Guida per pubblicare OpsHub su [SideProjectors](https://sideprojectors.com) come vendita di codebase/MVP SaaS.

## Listing copy (English)

### Title

**OpsHub — Multi-tenant B2B SaaS (CRM, Orders, Production, Inventory)**

### Tagline

Production-ready operations platform for small businesses. Full source code.

### Description

OpsHub is a complete B2B SaaS MVP for companies that manage customers, job orders, production, and inventory (ideal for workshops, agencies, and small manufacturers with 2–20 people).

**What it does:**
- CRM with contacts, search, and pagination
- Job orders with line items, status workflow, and margin calculation
- Production tracking (hours + materials) with automatic inventory deduction
- Inventory with stock movements and low-stock alerts
- Dashboard KPIs, CSV margin export, PDF order reports
- Multi-tenant organizations with JWT auth, refresh tokens, and org switcher
- Stripe subscription billing (checkout, webhooks, plan limits)

**Tech stack:**
Next.js 15 · NestJS · Prisma · PostgreSQL · TanStack Query · Tailwind/shadcn · Stripe · Docker · GitHub Actions

**Perfect for:**
- Developers who want a SaaS starter instead of building from scratch
- Agencies white-labeling an internal ops tool
- Founders validating a vertical ops product

**Run locally:**
```bash
docker compose up --build
npm run prisma:seed -w @opshub/api
```

**Demo credentials:**
- Email: `demo@opshub.local`
- Password: `password123`

**Live demo:** Deploy via [Render Blueprint](https://render.com/deploy?repo=https://github.com/notaxeltv/OpsHub&branch=main) → `https://opshub-web.onrender.com/en` (or run locally with `docker compose up --build`)

### Suggested price

| Tier | Price | Notes |
|------|-------|-------|
| Codebase only | **$1,200 – $1,800** | No live demo URL, buyer runs locally |
| With live demo + handoff call | **$1,800 – $2,500** | Deployed demo increases conversion |
| With customization package | **$2,500+** | e.g. branding, extra module, deploy help |

Start at **$1,499** fixed price or **$1,200** auction with reserve.

### Category tags

`SaaS` · `B2B` · `Developer Tools` · `TypeScript` · `Full Stack`

---

## What's included

- Full monorepo source (MIT-style transfer — confirm license with buyer)
- `apps/api` — NestJS REST API, Prisma, 8 domain modules
- `apps/web` — Next.js 15 frontend with auth, dashboard, CRUD pages
- Prisma schema, migrations, demo seed data
- Docker Compose (web + api + postgres)
- CI: lint, typecheck, test, build
- Deploy workflow: Docker images to GHCR
- Tests: API unit + e2e, Playwright auth e2e
- Docs: `README.md`, `ARCHITECTURE.md`, `DOMAIN.md`
- Graphify dev tooling integration (optional bonus for AI-assisted dev)

## What's NOT included (set expectations)

- No paying customers or MRR
- No production deployment (buyer deploys; GHCR workflow provided)
- No privacy policy / terms of service pages
- Stripe must be configured with buyer's own keys
- Granular per-module roles (documented as future work in `DOMAIN.md`)

---

## Pre-launch checklist

- [x] Public marketing landing at `/`
- [x] Demo seed (`demo@opshub.local` / `password123`)
- [x] **Live demo URL** — [Render blueprint](https://render.com/deploy?repo=https://github.com/notaxeltv/OpsHub&branch=main) (`https://opshub-web.onrender.com/en`) or local Docker
- [x] **Screenshots** (10) in `docs/marketing/screenshots/`
- [x] **Demo video** (~56s) in `docs/marketing/video/demo-walkthrough.mp4`
- [ ] Stripe test mode on production demo (optional)
- [ ] GitHub repo access or zip delivery method decided

See [docs/marketing/README.md](marketing/README.md) and [LISTING_COPY.md](marketing/LISTING_COPY.md) for publish-ready copy.

### Screenshot suggestions

1. Landing page (`/`)
2. Dashboard KPIs
3. Customer list with pagination
4. Order detail with margin
5. Production entry form
6. Inventory with low-stock alert
7. Reports / CSV export
8. Settings / subscription UI

---

## Deploy demo (optional, high impact)

Quick options for a live demo:

**Railway / Render**
1. PostgreSQL add-on
2. Deploy API from `apps/api` Dockerfile
3. Deploy web from `apps/web` Dockerfile
4. Set env: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`
5. Run migrations + seed on first deploy

**Docker on VPS**
```bash
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma db seed
```

Document the demo URL in the SideProjectors listing and pin credentials in the description.

---

## Due diligence FAQ (for buyers)

**Q: Is this multi-tenant?**  
A: Yes. Every domain entity is scoped by `organizationId`. Users can belong to multiple orgs.

**Q: How is auth handled?**  
A: JWT access token (15m) + refresh token (7d). Frontend stores token in cookie `opshub_token`.

**Q: Can I add new modules?**  
A: Yes. Follow `ARCHITECTURE.md` — NestJS module + Prisma model + Next.js page.

**Q: Tests?**  
A: `npm run test -w @opshub/api` (unit + e2e with DB). Playwright: `npm run test:e2e -w @opshub/web`.

**Q: License?**  
A: Proprietary by default — transfer full rights to buyer on sale (update `README` license section).

---

## After sale — suggested improvements

Priority backlog if you keep developing before/after listing:

1. Live demo + privacy/terms pages
2. Granular roles per module
3. Email notifications (order status, low stock)
4. Onboarding wizard for new orgs
5. Mobile-responsive polish on complex tables

---

## Links

- Repo: https://github.com/notaxeltv/OpsHub
- Branch: `main`
