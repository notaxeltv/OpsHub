# Billing Module

Integrazione Stripe per subscription SaaS.

**Endpoints:**
- `GET /billing/status` — piano corrente, limiti e utilizzo
- `POST /billing/checkout` — crea sessione Stripe Checkout (OWNER/ADMIN)
- `POST /billing/webhook` — webhook Stripe (pubblico, raw body)

**Piani e limiti:** vedi `plan-limits.ts`

Configura `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`.
