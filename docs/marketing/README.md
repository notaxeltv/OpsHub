# OpsHub Marketing Assets

Ready-to-publish assets for SideProjectors and other marketplaces.

## Live demo

| Type | URL | Notes |
|------|-----|-------|
| **Temporary (cloud tunnel)** | https://oklahoma-gardens-tiger-advertising.trycloudflare.com | Active while the dev VM is running |
| **Permanent deploy** | Use [Render Blueprint](../render.yaml) | One-click deploy on Render (free tier) |

**Demo credentials**
- Email: `demo@opshub.local`
- Password: `password123`

After deploying to Render, run the seed on the API service:
```bash
npx prisma db seed
```

## Screenshots

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
| `video/demo-walkthrough.mp4` | ~21s | SideProjectors, social, listing embed |
| `video/demo-walkthrough.webm` | ~21s | Web embed (smaller) |

## Regenerate assets

```bash
# Start API + web locally
npm run dev:api
npm run dev:web

# Screenshots (1440×900)
cd apps/web && npx playwright test --config=playwright.marketing.config.ts

# Demo video
cd apps/web && npx playwright test --config=playwright.video.config.ts
cp ../../docs/marketing/video-output/**/video.webm ../../docs/marketing/video/demo-walkthrough.webm
ffmpeg -y -i ../../docs/marketing/video/demo-walkthrough.webm -c:v libx264 -pix_fmt yuv420p ../../docs/marketing/video/demo-walkthrough.mp4
```

Optional public tunnel (temporary URL):
```bash
cloudflared tunnel --url http://localhost:3000
```
