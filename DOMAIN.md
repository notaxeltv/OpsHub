# OpsHub — Dominio

## Entità principali

### Identity & Tenant

| Entità | Descrizione |
|--------|-------------|
| `User` | Utente con email, password hash, nome |
| `Organization` | Tenant/workspace aziendale (slug, settings, piano) |
| `Membership` | Relazione user↔org con ruolo (`OWNER`, `ADMIN`, `MEMBER`) |

### CRM

| Entità | Descrizione |
|--------|-------------|
| `Customer` | Anagrafica cliente (P.IVA, CF, contatti, indirizzo) |
| `Contact` | Contatto associato a un cliente |

### Commesse

| Entità | Descrizione |
|--------|-------------|
| `Order` | Commessa/progetto con stato, date, costo orario |
| `OrderItem` | Riga commessa (descrizione, quantità, prezzo unitario) |

**Stati ordine:** `DRAFT` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` → `INVOICED`

### Produzione

| Entità | Descrizione |
|--------|-------------|
| `ProductionEntry` | Ore lavorate, costo materiali, note, collegamento ordine |

### Magazzino (opzionale)

| Entità | Descrizione |
|--------|-------------|
| `Product` | Materiale/prodotto con SKU, unità, scorta |
| `InventoryMovement` | Movimento IN/OUT con aggiornamento scorta |

### Economia

**Ricavi** = Σ (quantità × prezzo unitario) per ogni `OrderItem`

**Costi** = manodopera + materiali + spese esterne
- Manodopera = Σ (ore × tariffa oraria) per ogni `ProductionEntry`
- Materiali = Σ `materialCost` per ogni `ProductionEntry`
- Spese esterne = `Order.externalCosts`

**Margine** = Ricavi − Costi

## Flussi principali

### 1. Onboarding
```
Registrazione → Crea User + Organization + Membership(OWNER) → JWT
```

### 2. Ciclo commessa
```
Crea Customer → Crea Order(DRAFT) → Aggiungi OrderItems
→ Conferma(CONFIRMED) → Registra ProductionEntry
→ Completa(COMPLETED) → Visualizza margini → Export PDF/CSV
```

### 3. Report
```
Dashboard KPIs ← aggregazione margini per org
Report margini ← per commessa, per cliente
```

## Regole di business

1. Ogni query è filtrata per `organizationId` del tenant corrente
2. Un ordine non può essere eliminato se ha movimenti magazzino collegati (RESTRICT)
3. Movimento OUT non consentito se scorta insufficiente
4. Riferimento ordine univoco per organizzazione `(organizationId, reference)`

## TODO futuri

- [ ] Integrazione Stripe per subscription
- [ ] Auto-deduzione magazzino da production entries
- [ ] Notifiche scorte minime
- [ ] Ruoli granulari per modulo
