# OpsHub Marketing Assets

Ready-to-publish assets for SideProjectors and other marketplaces. **UI language: English (`/en`).**

## Live demo

| Type | URL | Notes |
|------|-----|-------|
| **Render (recommended)** | https://opshub-web.onrender.com/en | Deploy via [Blueprint](../../render.yaml) |
| **Local** | http://localhost:3000/en | `docker compose up --build` |

**Demo credentials**
- Email: `demo@opshub.local`
- Password: `password123`

### Deploy to Render (permanent)

1. Open: https://render.com/deploy?repo=https://github.com/notaxeltv/OpsHub&branch=main
2. Click **Deploy Blueprint** (creates PostgreSQL + API + Web)
3. Wait ~10–15 min for first build
4. Your demo URL will be: `https://opshub-web.onrender.com/en`

Optional CI deploy: add GitHub secrets `RENDER_API_KEY`, `RENDER_SERVICE_ID_WEB`, `RENDER_SERVICE_ID_API` and run `.github/workflows/render-deploy.yml`.

## Screenshots (English, latest UI)

| File | Page |
|------|------|
| `screenshots/01-landing.png` | Marketing landing |
| `screenshots/02-login.png` | Sign in |
| `screenshots/03-dashboard.png` | Dashboard KPIs |
| `screenshots/04-customers.png` | Customer list |
| `screenshots/05-orders.png` | Order list |
| `screenshots/06-production.png` | Production activity |
| `screenshots/07-inventory.png` | Inventory & materials |
| `screenshots/08-reports.png` | Margin reports |
| `screenshots/09-settings.png` | Settings & billing |
| `screenshots/10-order-detail.png` | Order detail + margins |

## Video

| File | Duration | Use |
|------|----------|-----|
| `video/demo-walkthrough.mp4` | ~34s | SideProjectors, social, listing embed |
| `video/demo-walkthrough.webm` | ~34s | Web embed |

## Regenerate assets (English)

```bash
npm run dev:api & npm run dev:web &
npm run prisma:seed -w @opshub/api

cd apps/web
npm run marketing:screenshots
npm run marketing:video

cp ../../docs/marketing/video-output/**/video.webm ../../docs/marketing/video/demo-walkthrough.webm
ffmpeg -y -i ../../docs/marketing/video/demo-walkthrough.webm -c:v libx264 -pix_fmt yuv420p ../../docs/marketing/video/demo-walkthrough.mp4
```

Uses locale `/en` and waits for real data before capturing.
