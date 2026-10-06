# engine/ — motor congelado (oráculo)

`Project.js` es una **foto congelada** del motor de cálculo de Viabilidad Negocios
(producto privado), tomada para que el oráculo de FinanceBench sea reproducible.

| Dato | Valor |
|---|---|
| Archivo de origen | `Backend/src/models/Project.js` del repo de Viabilidad Negocios |
| Commit de origen | `31f24a0` |
| Fecha de la copia | 2026-10-05 |
| Dependencias | `mongoose` (esquema y modelo) y `financial` (`irr`, `npv`, `paybackPeriod`) |

## Reglas

- **No se sincroniza** con el producto. Si el motor del producto cambia, este
  archivo no cambia: los resultados publicados de FinanceBench se calcularon
  con esta versión y tienen que poder reproducirse con ella.
- Si alguna vez se actualiza, es una **versión nueva del benchmark**: se anota el
  commit nuevo acá, se recalculan todas las comparaciones y se dice en el paper.
- El cálculo vive en el método `calculateMetrics()` del esquema, más un hook
  `pre('save')` que totaliza la inversión. `benchmark/scripts/aggregate.js` lo usa
  conectado a MongoDB porque lee comparaciones que guardó la app.
