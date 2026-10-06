# 01 — Initial Investment & Depreciation

**Domain:** Asset valuation, investment aggregation, straight-line depreciation
**File:** `Backend/src/models/Project.js` — lines 231–273 (pre-save hook), 284–304 (calculateInitialInvestment), 367–415 (calculateDepreciation)
**References:** IAS 16 *Property, Plant and Equipment*; NIIF (Colombian adoption of IFRS)

---

## A. Initial Investment

### Current Implementation

```javascript
// Pre-save hook (lines ~231–273) — also writes investmentAssets.initialInvestment
projectSchema.pre('save', async function(next) {
  const inv = this.investmentAssets || {};
  const fixedAssetsTotal = (inv.fixedAssets || []).reduce(
    (sum, asset) => sum + (parseFloat(asset.value) || 0), 0);
  const customFieldsTotal = (inv.customFields || []).reduce(
    (sum, field) => sum + (parseFloat(field.value) || 0), 0);
  this.investmentAssets.initialInvestment =
    (parseFloat(inv.civilWorks) || 0) + (parseFloat(inv.laborCost) || 0) +
    (parseFloat(inv.materials) || 0) + (parseFloat(inv.licenses) || 0) +
    (parseFloat(inv.furniture) || 0) + (parseFloat(inv.cash) || 0) +
    (parseFloat(inv.bank) || 0) + (parseFloat(inv.inventory) || 0) +
    fixedAssetsTotal + customFieldsTotal;
});

// Inside calculateMetrics() — same formula, independent recalculation
const calculateInitialInvestment = () => { /* identical formula */ };
const initialInvestment = calculateInitialInvestment();
```

### Canonical Formula

**IAS 16.16:** An item of PPE should be measured at cost, which comprises:
- Purchase price
- Directly attributable costs (installation, testing, professional fees)
- Initial estimate of dismantlement/restoration obligations

For startup viability modeling, the investment base is:

```
I₀ = Σ(civilWorks + laborCost + materials + licenses + furniture
        + cash + bank + inventory + fixedAssets + customFields)
```

### Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Aggregation formula | 🟢 Compliant | All nine components correctly summed |
| NaN guard (`parseFloat || 0`) | 🟢 Compliant | All reads protected |
| Dual calculation paths | 🟡 Warning | `pre('save')` and `calculateMetrics()` both compute independently |
| Non-depreciable items in investment | 🟢 Compliant | `cash`, `bank`, `inventory` correctly excluded from depreciation |

### Findings

#### F-01.2 — 🟡 Warning: Dual Calculation Paths

The `initialInvestment` scalar is computed in two places:
1. `pre('save')` hook writes it to `investmentAssets.initialInvestment`
2. Local `calculateInitialInvestment()` inside `calculateMetrics()` recomputes from scratch

If a project document is loaded from MongoDB without re-saving (e.g., loaded for read-only reporting), the stored `initialInvestment` may be stale if `investmentAssets` fields were updated without triggering `save`. The `calculateMetrics()` local recalculation is authoritative but its result is never persisted back to `investmentAssets.initialInvestment`.

**Impact:** Low — only affects displays that read `investmentAssets.initialInvestment` directly (e.g., BalanceSheet.jsx line 65) rather than the computed value. NPV/IRR are unaffected since `calculateMetrics()` always uses its own recomputed value.

**Proposed fix:** Remove the duplicate calculation from `pre('save')`. After `calculateMetrics()` runs, write `this.investmentAssets.initialInvestment = initialInvestment;` to keep a single authoritative source.

### Test Cases

| TC | Input | Expected `initialInvestment` |
|----|-------|------------------------------|
| TC-01-A | `civilWorks=5M, furniture=2M, fixedAssets=[{value:3M}], all others 0` | 10,000,000 |
| TC-01-B | `cash=500K, bank=200K, inventory=300K, all others 0` | 1,000,000 |
| TC-01-C | `investmentAssets = undefined` | 0 (no error) |
| TC-01-D | `fixedAssets=[{value:'abc'}, {value:1M}]` | 1,000,000 (parseFloat guard) |

---

## B. Depreciation

### Current Implementation

```javascript
// Project.js lines 367–415
const calculateDepreciation = () => {
  const depreciationByYear = {};
  for (let year = 0; year < projectLife; year++) depreciationByYear[year] = 0;

  project.investmentAssets?.fixedAssets?.forEach(asset => {
    const assetValue = parseFloat(asset.value) || 0;
    const usefulLife = Math.max(1, parseInt(asset.usefulLife) || 1);
    if (assetValue > 0) {
      const annualDepreciation = assetValue / usefulLife;
      const depreciationYears = Math.min(usefulLife, projectLife);
      for (let year = 0; year < depreciationYears; year++) {
        depreciationByYear[year] += annualDepreciation;
      }
    }
  });
  // Same logic repeated for customFields with isDepreciable flag
  return depreciationByYear;
};
```

**Asset schema (lines 4–8):**
```javascript
const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
  usefulLife: { type: Number, required: true, default: 5 },
  description: { type: String, default: '' }
  // NO salvageValue field
});
```

### Canonical Formula

**IAS 16.50:** The depreciable amount of an asset **shall be allocated on a systematic basis over its useful life**.

**IAS 16.6 (definition):** Depreciable amount = cost of an asset **less its residual (salvage) value**.

**Straight-line depreciation:**
```
AnnualDepreciation = (AssetCost − SalvageValue) / UsefulLife
```

**IAS 16.62:** The residual value and useful life of an asset shall be reviewed at least at the end of each annual reporting period.

**NIIF para PYMES, Sección 17:** Same requirements apply for small/medium enterprises.

### Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Straight-line method | 🟢 Compliant | `assetValue / usefulLife` is correct method |
| Assets with usefulLife > projectLife | 🟢 Compliant | `Math.min(usefulLife, projectLife)` caps depreciation correctly |
| usefulLife = 0 guard | 🟢 Compliant | `Math.max(1, parseInt(...) \|\| 1)` prevents division by zero |
| Salvage/residual value | 🔴 Non-compliant | Not modeled at all — violates IAS 16.50 |
| Terminal salvage recovery cash flow | 🔴 Missing | Not modeled |
| Non-depreciable investment items | 🟢 Compliant | `cash`, `bank`, `inventory` not in `fixedAssets[]` |
| Custom fields depreciation | 🟢 Compliant | `isDepreciable` flag gates correctly; defaults to 5-year life |
| Two assets with different useful lives | 🟢 Compliant | Each asset depreciated independently; amounts sum correctly |

### Findings

#### F-03.1 — 🟢 Compliant: Straight-Line Formula

The formula `annualDepreciation = assetValue / usefulLife` is correct for zero-salvage-value assets and is the most common convention for startup viability modeling.

#### F-03.2 — 🟡 Warning [RESEARCH CRITICAL]: Salvage Value Not Modeled

**Issue:** `assetSchema` has no `salvageValue` field. The full IAS 16 formula is:

```
AnnualDepreciation = (AssetCost − SalvageValue) / UsefulLife
```

The benchmark's `JSON_FORMAT.md` includes `"salvageValue"` in the asset input schema. Any benchmark case where `salvageValue > 0` will produce overstated depreciation (and therefore understated EBIT, understated taxes partially, and incorrect NPV).

**Numeric example:**
- Asset cost: 25,000,000 COP, useful life: 5 years, salvage value: 5,000,000 COP
- Current output: `25M / 5 = 5,000,000/year`
- IAS 16 correct: `(25M − 5M) / 5 = 4,000,000/year`
- Overstatement: 1,000,000 COP/year × (taxRate savings partially offset) → EBIT understated by 1M/year → NPV error ≈ `1M × (1−t) × annuity_factor`

**Proposed fix:**

1. Add `salvageValue` to schema:
```javascript
const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
  usefulLife: { type: Number, required: true, default: 5 },
  salvageValue: { type: Number, default: 0 },   // ← ADD THIS
  description: { type: String, default: '' }
});
```

2. Update depreciation calculation:
```javascript
const salvage = Math.max(0, parseFloat(asset.salvageValue) || 0);
const depreciableAmount = Math.max(0, assetValue - salvage);
const annualDepreciation = depreciableAmount / usefulLife;
```

3. Add salvage recovery as a positive terminal cash flow in the final year of the asset's life (or project life, whichever comes first). Add a `salvageRecovery` accumulator in `calculateMetrics()` and include it in the year-n `unleveredCashFlow` and `leveredCashFlow`.

#### F-03.3 — 🟡 Warning: Depreciation Base for Benchmarking

For assets where `usefulLife > projectLife`, the asset is only partially depreciated within the project horizon. There is no terminal book-value adjustment (which would appear as a terminal cash inflow in a rigorous DCF). This is acceptable for a startup tool but should be noted for research accuracy.

### Test Cases

| TC | Input | Expected Annual Depreciation |
|----|-------|------------------------------|
| TC-03-A | `value=10M, usefulLife=5, salvageValue=2M, projectLife=5` | `(10M-2M)/5 = 1,600,000/yr` (current: 2,000,000 — **FAILS**) |
| TC-03-B | `value=10M, usefulLife=5, salvageValue=0, projectLife=5` | `10M/5 = 2,000,000/yr` (no regression) |
| TC-03-C | `value=6M, usefulLife=3, projectLife=5` | Years 1–3: 2M/yr; Years 4–5: 0/yr |
| TC-03-D | `assets=[{v:6M,life:3},{v:10M,life:5}], projectLife=5` | Y1-3: 4M/yr; Y4-5: 2M/yr |
| TC-03-E | `value=5M, usefulLife=0` (bad input) | `usefulLife = max(1,0\|\|1) = 1`, depreciation = 5M in year 1 |
| TC-03-F | `value=5M, usefulLife=10, projectLife=5` | 0.5M/yr for years 1–5 only |

---

*References:*
- IAS 16.16, 16.50, 16.62 — IASB IFRS Foundation
- NIIF para PYMES, Sección 17.19–17.20
- Congreso de Colombia, Decreto 2649/1993 (pre-NIIF) and NIIF adoption
