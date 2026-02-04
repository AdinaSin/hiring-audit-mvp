# Hiring Execution & Talent Efficiency Audit
## Complete Diagnostic System

[![Tests](https://img.shields.io/badge/tests-9%2F9%20passed-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0-blue)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

---

## What Is This?

An automated diagnostic system that audits hiring execution across 7 organizational dimensions, detects cross-functional contradictions, and generates actionable recommendations.

**Not** an ATS. **Not** HR consulting. **Not** a dashboard.  
This is a **diagnostic engine** that reveals structural failures in hiring systems.

---

## How It Works

```
[Forms] → [Scoring] → [Cross-Validation] → [Recommendations] → [PDF Report]
   │          │              │                    │                │
   │          │              │                    │                │
   ▼          ▼              ▼                    ▼                ▼
7 Blocks   Gate Rules   Contradiction      Risk-Based         Level 1/2/3
37 Q's     0-3 Scale      Detection        Selection           Reports
```

---

## Audit Blocks

| Block | Name | What It Measures |
|-------|------|------------------|
| 1 | Executive Ownership | Strategic ownership, planning, visibility |
| 2 | TA Leadership | Capacity, SLAs, process discipline |
| 3 | Delivery Leadership | Interview capacity, feedback, priorities |
| 4 | Financial Governance | Budget transparency, cost control |
| 5 | Technical Interviewing | Evaluation standards, accountability |
| 6 | Recruitment Operations | Process stability, ATS discipline |
| 7 | Reporting & AI | Data integrity, automation governance |

---

## Key Features

### Cross-Validation
Detects contradictions between what different roles claim:
- SLA Theatre (claims SLAs, no enforcement)
- Interview Bottleneck Masked (claims capacity, delays exist)
- Ownerless Hiring (claims ownership, no mandate)

### Gate Rules
Non-compensable failures that force overall RED:
- Block 1 RED → Overall RED (no ownership)
- Block 2 RED → Overall RED (ungoverned TA)
- Block 4 RED → Overall RED (financial opacity)

### Confidence Score
0-100 score adjusted for:
- Block statuses
- Contradictions detected
- Gate failures
- Data quality (Block 7)

---

## Quick Start

### Option 1: Standalone (5 min)
```
Open: hiring_audit_forms_standalone.html
Fill: All 7 blocks
Click: Calculate Scores
```

### Option 2: Automated (1 hour)
```bash
# 1. Setup n8n
docker run -d -p 5678:5678 n8nio/n8n

# 2. Import workflow
# Upload: n8n_workflow_scoring_engine.json

# 3. Setup Airtable
# Create tables from schema in deployment_guide.md

# 4. Connect forms
# Point Tally webhooks to n8n
```

### Option 3: Test the Logic
```bash
python tests/integration_test.py
# Expected: 9/9 tests passed
```

---

## File Structure

```
/
├── form_specifications/
│   ├── all_blocks_questions_csv.csv      # All questions for import
│   ├── hiring_audit_forms_standalone.html # Browser-based form
│   └── audit_forms_spec_complete.json    # Full spec with scoring
│
├── recommendation_library/
│   ├── Recommendation_Library_v1_0.md    # Full recommendation catalog
│   ├── Recommendation_Quick_Reference.md # Cheat sheet
│   └── recommendation_library.json       # For automation
│
├── report_generator/
│   └── audit_report_generator.py         # PDF generation (Python)
│
├── automation/
│   ├── n8n_make_automation_spec.md       # Full automation spec
│   ├── n8n_workflow_scoring_engine.json  # Ready-to-import workflow
│   └── scoring_engine.js                 # Standalone JS engine
│
├── tests/
│   ├── integration_test.py               # Unit + scenario tests
│   └── e2e_workflow_test.py              # Full workflow simulation
│
├── docs/
│   ├── deployment_guide.md               # Full deployment guide
│   ├── quick_start.md                    # 15-minute setup
│   └── README.md                         # This file
│
└── sample_reports/
    ├── sample_audit_report_L1.pdf        # Level 1 example
    ├── sample_audit_report_L2.pdf        # Level 2 example
    └── sample_audit_report_L3.pdf        # Level 3 example
```

---

## Report Levels

| Level | Name | Includes |
|-------|------|----------|
| L1 | Diagnostic | Status map, gate failures, contradictions |
| L2 | + Design | Quick wins, structural recommendations |
| L3 | + Roadmap | Implementation phases, success metrics |

---

## Scoring Logic

### Block Status
```
Score ≥ 2.3  → GREEN (healthy)
Score 1.5-2.29 → YELLOW (at risk)
Score < 1.5  → RED (critical)
```

### Critical Questions
Some questions force RED if scored 0:
- b1_q3 (ownership clarity)
- b2_q3 (SLA definition)
- b6_q5 (pipeline transparency)

### Cross-Validation
```javascript
if (b2_q3 >= 2 && b6_q5 <= 1) {
  // CV-05: SLA Theatre
  // Force overall to RED
}
```

---

## API Usage

### Scoring Engine (JavaScript)
```javascript
const { runAuditScoring } = require('./scoring_engine.js');

const result = runAuditScoring({
  audit_id: 'AUD-001',
  responses: {
    b1_q1: 3, b1_q2: 2, // ...
  }
});

console.log(result.overall_status);  // 'green' | 'yellow' | 'red'
console.log(result.confidence_score); // 0-100
```

### PDF Generator (Python)
```python
from audit_report_generator import HiringAuditReportGenerator

generator = HiringAuditReportGenerator(
    audit_data=data,
    output_path='report.pdf',
    level=2
)
generator.generate()
```

---

## Test Results

```
======================================================================
SUMMARY
======================================================================
Total Tests: 9
Passed: 9 ✅
Failed: 0 ❌
Pass Rate: 100.0%

SCENARIO DETAILS
----------------------------------------------------------------------
Healthy Company (All Green):
  Overall Status: GREEN
  Confidence: 90/100
  Block Statuses: 🟢🟢🟢🟢🟢🟢🟢

Critical Failure (Multiple RED):
  Overall Status: RED
  Confidence: 0/100
  Block Statuses: 🔴🔴🔴🔴🔴🔴🔴
  Gate Failures: ['Ownerless Hiring', 'Ungoverned TA', ...]

SLA Theatre (CV-05 Contradiction):
  Overall Status: RED
  Confidence: 52/100
  Contradictions: ['CV-05']
```

---

## Requirements

### Minimum
- Web browser (for standalone form)
- Python 3.10+ with reportlab (for PDF)

### Recommended
- n8n or Make.com
- Airtable or Google Sheets
- Tally.so or Typeform

### Enterprise
- Node.js backend
- PostgreSQL
- Cloud functions (GCP/AWS/Azure)

---

## Next Steps

1. **Test:** Run `integration_test.py`
2. **Demo:** Open `hiring_audit_forms_standalone.html`
3. **Deploy:** Follow `deployment_guide.md`
4. **Customize:** Modify thresholds in `scoring_engine.js`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2025 | Initial release |

---

*© 2025 Hiring Audit System. All rights reserved.*
