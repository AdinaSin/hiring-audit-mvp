# Hiring Audit — Quick Start Guide
## Get Running in 15 Minutes

---

## Choose Your Path

| Path | Time | Cost | Best For |
|------|------|------|----------|
| **A. Standalone HTML** | 5 min | Free | Demo, testing |
| **B. Tally + Sheets** | 15 min | Free | Small volume |
| **C. n8n + Airtable** | 1 hour | ~$50/mo | Production |

---

## Path A: Standalone HTML (5 minutes)

### Step 1: Open the Form
```
Open: hiring_audit_forms_standalone.html
In: Any web browser
```

### Step 2: Fill Out Audit
- Complete all 7 blocks
- Click "Calculate Scores"
- View results

### Step 3: Export Data
- Click "Export JSON"
- Use data for manual PDF generation

**Done!** ✅

---

## Path B: Tally + Google Sheets (15 minutes)

### Step 1: Create Tally Forms (5 min)

1. Go to [tally.so](https://tally.so)
2. Create account (free)
3. Create new form for each block
4. Copy questions from `all_blocks_questions_csv.csv`

**Quick Question Setup:**
```
Block 1: 8 questions (Executive Ownership)
Block 2: 6 questions (TA Leadership)
Block 3: 4 questions (Delivery)
Block 4: 4 questions (Finance)
Block 5: 3 questions (Technical)
Block 6: 8 questions (Operations)
Block 7: 4 questions (Reporting)
```

### Step 2: Create Google Sheet (3 min)

Create sheet with columns:
```
A: audit_id
B: block_id
C: timestamp
D: b1_q1
E: b1_q2
... (continue for all questions)
```

### Step 3: Connect Tally → Sheets (5 min)

1. In Tally: Settings → Integrations
2. Select Google Sheets
3. Connect your spreadsheet
4. Map fields

### Step 4: Add Scoring Formulas (2 min)

In your sheet, add:
```
=AVERAGE(D2:K2)  // Block 1 average
=IF(L2>=2.3,"GREEN",IF(L2>=1.5,"YELLOW","RED"))  // Status
```

**Done!** ✅

---

## Path C: n8n + Airtable (1 hour)

### Step 1: Setup Airtable (10 min)

1. Create Airtable account
2. Create base: "Hiring Audit"
3. Create 3 tables:

**Audits Table:**
| Field | Type |
|-------|------|
| audit_id | Text (Primary) |
| company_name | Text |
| status | Single Select |
| created_at | Date |

**Responses Table:**
| Field | Type |
|-------|------|
| response_id | Text |
| audit_id | Link to Audits |
| block_id | Single Select |
| responses | Long Text |

**Results Table:**
| Field | Type |
|-------|------|
| audit_id | Link to Audits |
| overall_status | Single Select |
| confidence_score | Number |

### Step 2: Setup n8n (10 min)

**Option A: n8n Cloud**
1. Sign up at [n8n.io](https://n8n.io)
2. Create instance

**Option B: Local Docker**
```bash
docker run -d --name n8n -p 5678:5678 n8nio/n8n
```

### Step 3: Import Workflow (5 min)

1. Go to n8n dashboard
2. Click Import
3. Upload `n8n_workflow_scoring_engine.json`
4. Configure Airtable credentials

### Step 4: Setup Forms (15 min)

1. Create Tally forms (see Path B)
2. Add webhook integration:
   ```
   URL: https://your-n8n.com/webhook/audit/submit
   Method: POST
   ```

### Step 5: Test (10 min)

1. Submit test form
2. Check Airtable for data
3. Check n8n execution log
4. Verify scoring results

### Step 6: Setup PDF (10 min)

**Local:**
```bash
pip install reportlab
python audit_report_generator.py
```

**Cloud Function:**
Deploy `audit_report_generator.py` to:
- Google Cloud Functions
- AWS Lambda
- Vercel

**Done!** ✅

---

## Verify Your Setup

### Checklist

- [ ] Forms accept submissions
- [ ] Data stored correctly
- [ ] Scoring calculates (check thresholds)
- [ ] PDF generates
- [ ] Email delivers (if configured)

### Test Scenarios

**Test 1: All Green**
```json
{
  "b1_q1": 3, "b1_q2": 3, "b1_q3": 3, ...
}
Expected: overall_status = "green", confidence >= 80
```

**Test 2: Block 1 RED**
```json
{
  "b1_q1": 0, "b1_q2": 1, "b1_q3": 0, ...
}
Expected: overall_status = "red" (Gate 0 failure)
```

**Test 3: SLA Contradiction (CV-05)**
```json
{
  "b2_q3": 3,  // Claims SLA
  "b6_q5": 1   // No enforcement
}
Expected: contradiction detected, force-red
```

---

## Quick Reference

### Scoring Thresholds

| Score Range | Status |
|-------------|--------|
| ≥ 2.3 | 🟢 GREEN |
| 1.5 – 2.29 | 🟡 YELLOW |
| < 1.5 | 🔴 RED |

### Gate Rules

| Condition | Result |
|-----------|--------|
| Block 1 RED | Overall RED |
| Block 2 RED | Overall RED |
| Block 4 RED | Overall RED |
| 2+ Yellows | Overall YELLOW |

### Key Files

| File | Purpose |
|------|---------|
| `hiring_audit_forms_standalone.html` | Browser-based form |
| `all_blocks_questions_csv.csv` | Question list for import |
| `scoring_engine.js` | JavaScript scoring logic |
| `audit_report_generator.py` | PDF generation |
| `n8n_workflow_scoring_engine.json` | n8n workflow |

---

## Need Help?

1. **Check deployment_guide.md** for detailed instructions
2. **Run integration_test.py** to verify scoring logic
3. **Review e2e_workflow_test.py** for full flow example

---

*Quick Start Guide v1.0*
