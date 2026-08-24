# SideProjectors — Ready to publish

Copy-paste this listing. Assets are in `docs/marketing/` (English UI, latest version with i18n + dark mode).

## Live demo URL

**https://opshub-web.onrender.com/en** (after [Render Blueprint](https://render.com/deploy?repo=https://github.com/notaxeltv/OpsHub&branch=main) deploy)

> Or run locally: `docker compose up --build` → http://localhost:3000/en

**Login:** `demo@opshub.local` / `password123`

---

## Title

OpsHub — Multi-tenant B2B SaaS (CRM, Orders, Production, Inventory)

## Price

**$1,499** (fixed) or best offer from **$1,200**

## Description

OpsHub is a production-ready B2B SaaS MVP for small businesses (2–20 people) that manage customers, job orders, production, and inventory.

**Live demo:** https://opshub-web.onrender.com/en (or deploy via Render Blueprint in README)  
**Demo login:** demo@opshub.local / password123

**Features:**
- CRM with contacts, search, pagination
- Job orders with line items, status workflow, margin calculation
- Production tracking (hours + materials) with auto inventory deduction
- Inventory with stock movements and low-stock alerts
- Dashboard KPIs, CSV margin export, PDF order reports
- Multi-tenant orgs, JWT auth, refresh tokens, org switcher
- Stripe subscription billing (checkout, webhooks, plan limits)
- **5 languages** (EN/IT/FR/DE/ES) + light/dark mode + responsive mobile UI

**Stack:** Next.js 15 · NestJS · Prisma · PostgreSQL · TanStack Query · Tailwind · Docker · GitHub Actions

**Included:** Full source code, migrations, seed data, Docker Compose, CI/CD, tests, architecture docs, marketing screenshots + demo video.

**Perfect for:** Developers wanting a SaaS starter, agencies white-labeling an ops tool, founders validating a vertical product.

**Run locally:**
```bash
docker compose up --build
npm run prisma:seed -w @opshub/api
```

## Attachments

Upload these from `docs/marketing/`:

| Asset | Path |
|-------|------|
| Hero screenshot | `screenshots/03-dashboard.png` |
| Landing | `screenshots/01-landing.png` |
| Customers | `screenshots/04-customers.png` |
| Order detail | `screenshots/10-order-detail.png` |
| Inventory | `screenshots/07-inventory.png` |
| Reports | `screenshots/08-reports.png` |
| Demo video | `video/demo-walkthrough.mp4` |

## Tags

`SaaS` `B2B` `TypeScript` `Full Stack` `Next.js` `NestJS`
