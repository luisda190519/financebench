# JSON Format Specification

This document describes the two JSON formats used in the benchmark system.

---

## 1. Input-Only Format (Mode A)

Used when the JSON contains only business inputs. The app auto-calculates all metrics.

```json
{
  "meta": {
    "exportVersion": "1.0",
    "exportDate": "2025-01-15T10:30:00Z",
    "caseId": "case_0042",
    "projectType": "software",
    "difficulty": "medium",
    "seed": 42
  },
  "inputs": {
    "general": {
      "projectName": "SaaS Analytics Pro",
      "projectType": "software",
      "projectLife": 5,
      "currency": "COP",
      "taxRate": 33,
      "discountRate": 12
    },
    "investmentAssets": {
      "civilWorks": 0,
      "laborCost": 15000000,
      "fixedAssets": [
        {
          "name": "Servidores y equipos",
          "cost": 25000000,
          "salvageValue": 5000000,
          "usefulLife": 5
        }
      ],
      "customFields": []
    },
    "financing": {
      "partners": [
        { "name": "Socio Principal", "amount": 30000000, "percentage": 60 }
      ],
      "customSources": [],
      "externalLoan": 20000000,
      "interestRate": 14,
      "loanTermMonths": 36
    },
    "income": {
      "items": [
        {
          "id": "item_001",
          "name": "Suscripción mensual",
          "type": "subscription",
          "category": "services",
          "growthRate": 20,
          "periodsPerYear": 12,
          "scenarios": {
            "normal": {
              "quantity": 50,
              "sellingPrice": 500000,
              "unitCost": 50000,
              "discount": 0
            },
            "optimista": {
              "quantity": 80,
              "sellingPrice": 500000,
              "unitCost": 50000,
              "discount": 0
            },
            "pesimista": {
              "quantity": 30,
              "sellingPrice": 480000,
              "unitCost": 50000,
              "discount": 5
            },
            "controlado": {
              "quantity": 50,
              "sellingPrice": 500000,
              "unitCost": 50000,
              "discount": 0
            }
          }
        }
      ],
      "scenarios": []
    },
    "expenses": {
      "items": [
        {
          "name": "Arriendo oficina",
          "category": "rent",
          "amount": 3000000,
          "frequency": "monthly",
          "growthRate": 5
        },
        {
          "name": "Nómina desarrolladores",
          "category": "payroll",
          "amount": 12000000,
          "frequency": "monthly",
          "growthRate": 8
        }
      ]
    }
  }
}
```

### Required Fields

| Path | Type | Constraints |
|------|------|-------------|
| `inputs.general.projectName` | string | Non-empty |
| `inputs.general.projectLife` | integer | 1–50 |
| `inputs.general.taxRate` | number | 0–100 (percent) or 0–1 (fraction, auto-normalized) |
| `inputs.general.discountRate` | number | 0–100 (percent) or 0–1 (fraction, auto-normalized) |
| `inputs.income.items` OR `inputs.income.scenarios` | array | At least one must be non-empty |
| `inputs.investmentAssets` | object | Must exist |

### Optional Fields (with defaults)

| Path | Default | Notes |
|------|---------|-------|
| `inputs.general.currency` | `"COP"` | Display only |
| `inputs.financing.externalLoan` | `0` | |
| `inputs.financing.interestRate` | `0` | |
| `inputs.financing.loanTermMonths` | `12` | |
| `inputs.expenses.items` | `[]` | |

---

## 2. Complete Format (Mode B)

Used when the JSON contains both inputs AND pre-calculated analysis (e.g., LLM output).
The app recalculates from inputs and compares against the provided analysis.

```json
{
  "meta": {
    "exportVersion": "1.0",
    "exportDate": "2025-01-15T14:22:00Z",
    "projectId": "507f1f77bcf86cd799439011",
    "appVersion": "1.0.0"
  },
  "inputs": {
    "...same as Input-Only format..."
  },
  "analysis": {
    "lastCalculated": "2025-01-15T14:22:00Z",
    "scenarios": {
      "optimista": {
        "npv": 45230000,
        "irr": 28.4,
        "paybackPeriod": 2.8,
        "totalRevenue": 720000000,
        "totalExpenses": 480000000,
        "grossMargin": 33.3,
        "breakevenUnits": 15,
        "breakevenRevenue": 7500000,
        "annualData": [
          {
            "year": 1,
            "revenue": 96000000,
            "cogs": 9600000,
            "grossProfit": 86400000,
            "operatingExpenses": 60000000,
            "ebitda": 26400000,
            "depreciation": 4000000,
            "operatingProfit": 22400000,
            "interest": 2800000,
            "taxableIncome": 19600000,
            "taxes": 6468000,
            "netProfit": 13132000,
            "cashFlow": 17132000
          }
        ]
      },
      "normal": { "..." : "..." },
      "pesimista": { "..." : "..." },
      "controlado": { "..." : "..." }
    },
    "sensitivityAnalysis": {},
    "financialHealth": {}
  }
}
```

### Analysis Scenarios

Each scenario under `analysis.scenarios` must contain:

| Field | Type | Description |
|-------|------|-------------|
| `npv` | number | Net Present Value in project currency |
| `irr` | number | Internal Rate of Return as percentage (e.g., 28.4 for 28.4%) |
| `paybackPeriod` | number | Years to recover investment |
| `totalRevenue` | number | Sum of all revenues over project life |
| `totalExpenses` | number | Sum of all operating expenses over project life |
| `grossMargin` | number | Gross margin percentage |
| `breakevenUnits` | number | Units required to break even (if applicable) |
| `breakevenRevenue` | number | Revenue required to break even |
| `annualData` | array | Year-by-year financial data (see below) |

### Annual Data Row

| Field | Type | Description |
|-------|------|-------------|
| `year` | integer | Year number (1-based) |
| `revenue` | number | Gross revenue |
| `cogs` | number | Cost of goods sold |
| `grossProfit` | number | Revenue minus COGS |
| `operatingExpenses` | number | Fixed + variable operating costs |
| `ebitda` | number | Earnings before interest, taxes, depreciation, amortization |
| `depreciation` | number | Asset depreciation for this year |
| `operatingProfit` | number | EBIT |
| `interest` | number | Loan interest payments |
| `taxableIncome` | number | Income subject to tax |
| `taxes` | number | Tax amount |
| `netProfit` | number | After-tax profit |
| `cashFlow` | number | Free cash flow (net profit + depreciation) |

---

## Rate Conventions

The app accepts both fractional (0–1) and percentage (0–100) representations for rates
and auto-normalizes them on import:

```
taxRate: 0.33   → stored as 33
taxRate: 33     → stored as 33 (no change)

discountRate: 0.12  → stored as 12
discountRate: 12    → stored as 12 (no change)
```

---

## Expense Frequency Values

| Value | Meaning | Annual multiplier |
|-------|---------|------------------|
| `"monthly"` | Monthly recurring | × 12 |
| `"quarterly"` | Every 3 months | × 4 |
| `"annual"` | Once per year | × 1 |
| `"one-time"` | Non-recurring (year 1 only) | × 1 / projectLife |

---

## Income Item Types

| Value | Meaning |
|-------|---------|
| `"product"` | Physical product with unit cost |
| `"service"` | Service with selling price |
| `"subscription"` | Recurring subscription |
| `"project"` | Project-based billing |
| `"rental"` | Rental/leasing income |

---

## Error Response (on invalid import)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "inputs.general.projectLife must be between 1 and 50"
}
```
