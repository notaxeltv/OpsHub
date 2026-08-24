# Inventory Module

Anagrafica materiali, movimenti magazzino IN/OUT, alert scorte minime.

**Endpoints:**
- `/inventory/products` (paginato)
- `/inventory/movements`
- `GET /inventory/alerts/low-stock`

Lo scarico automatico avviene quando una `ProductionEntry` include `productId` + `materialQuantity`.
