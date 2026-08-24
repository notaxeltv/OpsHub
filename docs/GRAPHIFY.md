# Graphify — Knowledge Graph per OpsHub

OpsHub integra [Graphify](https://github.com/Graphify-Labs/graphify) come **strumento di sviluppo** per navigare il monorepo con meno token e meno letture manuali di file.

## Installazione

```bash
pip install graphifyy
npm run graphify:install-cursor   # skill Cursor in .cursor/rules/
npm run graphify                  # genera graphify-out/
```

## Comandi

| Comando | Descrizione |
|---------|-------------|
| `npm run graphify` | Build completo (solo codice, senza API key LLM) |
| `npm run graphify:update` | Aggiorna il grafo dopo modifiche al codice |
| `npm run graphify:query -- "auth tenant"` | Query mirata sul grafo |

## Output

```
graphify-out/
├── graph.html          # grafo interattivo
├── graph.json          # grafo persistente
├── GRAPH_REPORT.md     # hub, community, domande suggerite
└── cache/              # cache AST (non committare)
```

## Uso con Cursor

La regola `.cursor/rules/graphify.mdc` istruisce l'agente a usare `graphify query` prima di esplorare il codebase con Read/Grep.

Dopo ogni modifica significativa al codice:

```bash
npm run graphify:update
```

## Note

- Graphify è **tooling dev**, non parte del runtime SaaS.
- Con `--code-only` non serve alcuna API key (estrazione AST locale).
- Per includere documenti/PDF serve una chiave LLM (`GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`, ecc.).
