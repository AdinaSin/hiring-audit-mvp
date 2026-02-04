# Cross-Validation Matrix — Complete v2.0

## Purpose

Detect contradictions across all 7 blocks to:
- Reduce self-report bias
- Expose political masking
- Auto-escalate hidden risks
- Generate diagnostic flags

## Scope

Applies to all 7 audit blocks:
- Block 1: Executive Ownership
- Block 2: TA Leadership
- Block 3: Delivery & Hiring Leadership
- Block 4: Financial Governance
- Block 5: Technical Interviewing
- Block 6: Recruitment Operations
- Block 7: Reporting, Data & AI Governance

---

## Severity Scale

| Level | Symbol | Meaning | Effect |
|-------|--------|---------|--------|
| OK | ✓ | Consistent signals | No action |
| Soft | ⚠️ | Plausible mismatch | Review note, +0.5 risk factor |
| Hard | 🔴 | Direct incompatibility | Uplift 1 level |
| Force-Red | ⛔ | Non-compensable | Overall = RED |

---

## Escalation Mechanics

### Soft Contradictions (⚠️)
- Add review note to report
- Accumulate +0.5 risk factor per occurrence
- If ≥2 soft contradictions in same gate → uplift 1 level
- Stay at current level unless threshold crossed

### Hard Contradictions (🔴)
- Immediate uplift by 1 level for implicated blocks
- GREEN → YELLOW, YELLOW → RED
- Flag generated with diagnosis hint
- Triggers manual review recommendation

### Force-Red Contradictions (⛔)
- Overall status = RED regardless of scores
- Named diagnosis assigned
- Non-compensable by any other signals
- Executive escalation triggered

### Trust Weighting
If a block produces multiple contradictions:
- Reduce confidence in that block's self-report
- Prioritize validator block signals
- Note in report that block may be unreliable narrator

---

## Cross-Validation Rules (Complete)

### Block 1 (Executive) Validations

| ID | B1 Claim | Validator | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-----------|------|----------|-------------|-----------|
| CV-01 | Clear C-level hiring owner | B6: No clear ownership / vacancies stuck | Governance ↔ Execution | ⛔ | Force-Red | "Ownerless Hiring in Practice" |
| CV-02 | Annual hiring plan tracked | B2: No capacity model / formula | Governance ↔ Capacity | 🔴 | Uplift 1 | "Planning Illusion" |
| CV-03 | Regular prioritization cadence | B3: Priorities change ad-hoc | Cadence mismatch | 🔴 | Uplift 1 | "Cadence Theatre" |
| CV-04 | Exec receives meaningful reports | B6: ATS not source of truth | Visibility illusion | 🔴 | Uplift 1 | "Dashboard Fantasy" |
| CV-20 | Hiring NOT recognized as bottleneck | B6: Large backlog / stuck pipelines | Blind spot | 🔴 | Uplift 1 | "Bottleneck Denial" |
| CV-24 | Conflict resolution path exists | B3: No escalation / conflicts stall | Resolution illusion | 🔴 | Uplift 1 | "Unresolved Conflicts" |
| CV-B7-01 | Exec has visibility | B7: No C-level reports used | Visibility illusion | 🔴 | Uplift 1 | "Executive Blindness" |

### Block 2 (TA Leadership) Validations

| ID | B2 Claim | Validator | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-----------|------|----------|-------------|-----------|
| CV-05 | SLA exists and enforced | B6: No SLA tracking / escalations | SLA illusion | ⛔ | Force-Red | "SLA Theater" |
| CV-06 | Recruiter workload balanced | B6: Overloaded / queues unmanaged | Capacity contradiction | 🔴 | Uplift 1 | "Operational Overload" |
| CV-07 | Quality gates before HM stage | B3: Candidates low quality / rework | Quality mismatch | 🔴 | Uplift 1 | "Quality Misalignment" |
| CV-10 | Role intake clear | B3: Kickoff unclear / rework common | Intake mismatch | ⚠️ | Review note | "Kickoff Quality Problem" |
| CV-19 | Priorities via formal intake | B3: Delivery escalates ad-hoc | Process bypass | 🔴 | Uplift 1 | "Priority Hijacking" |
| CV-23 | Recruitment marketing adequate | B6: Single channel / pipeline dry | Channel risk | ⚠️ | Review note | "Marketing vs Reality" |
| CV-B7-02 | SLAs monitored | B7: ATS not source of truth | Data validity | 🔴 | Uplift 1 | "SLA Tracking Unreliable" |
| CV-B7-03 | Capacity model exists | B7: Cannot segment data by role | Data usability | ⚠️ | Review note | "Capacity Calculation Suspect" |

### Block 3 (Delivery) Validations

| ID | B3 Claim | Validator | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-----------|------|----------|-------------|-----------|
| CV-08 | Interview capacity sufficient | B5: Ad-hoc availability / delays | Capacity denial | ⛔ | Force-Red | "Interview Bottleneck Masked" |
| CV-09 | Feedback turnaround fast | B6: Vacancies stuck at feedback | Feedback illusion | 🔴 | Uplift 1 | "Feedback Latency Hidden" |
| CV-15 | Decisions consistent | B5: Rubric exists but not used | Evaluation mismatch | 🔴 | Uplift 1 | "Rubric Theatre" |
| CV-22 | Satisfied with TA comms | B2: Frequent scope changes | Mutual blame | ⚠️ | Review note | "Narrative Mismatch" |

### Block 4 (Finance) Validations

| ID | B4 Claim | Validator | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-----------|------|----------|-------------|-----------|
| CV-11 | Budget tied to hiring plan | B2: No demand/capacity model | Budget logic gap | 🔴 | Uplift 1 | "Unfounded Budget" |
| CV-12 | Hiring spend transparent | B2: TA can't explain cost drivers | Transparency mismatch | 🔴 | Uplift 1 | "Financial Opacity" |
| CV-13 | Vendor spend controlled | B6: Manual workarounds / tool gaps | Tooling paradox | ⚠️ | Review note | "Spend Misallocation" |
| CV-14 | Budget approvals smooth | B2: Frequent freezes / constraints | Budget volatility | ⚠️ | Review note | "Budget Instability" |
| CV-21 | No additional tooling needed | B6: Manual tracking outside ATS | Tooling denial | 🔴 | Uplift 1 | "Spreadsheet Culture" |
| CV-25 | Budget excludes recruiter salaries | B2: Planning ignores staffing needs | Scope boundary | 🔴 | Uplift 1 | "Staffing Not Budgeted" |
| CV-B7-04 | Cost-per-hire tracked | B7: Data quality low / unreliable | Cost data validity | ⚠️ | Review note | "Cost Data Unreliable" |

### Block 5 (Technical Interviewing) Validations

| ID | B5 Claim | Validator | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-----------|------|----------|-------------|-----------|
| CV-16 | Calibration sessions happen | B2: Pass rates volatile unexplained | Signal inconsistency | ⚠️ | Review note | "Calibration Ineffective" |
| CV-17 | Interviewers accountable to SLA | B6: No enforcement / no escalation | Accountability gap | ⛔ | Force-Red | "Evaluation Governance Broken" |
| CV-B7-05 | Interviewer SLAs exist | B7: Decisions not traceable | Accountability gap | 🔴 | Uplift 1 | "Interview Accountability Gap" |

### Block 6 (Operations) Validations

| ID | B6 Claim | Validator | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-----------|------|----------|-------------|-----------|
| CV-18 | ATS is single source of truth | B1: Reports inconsistent across audiences | Data integrity | ⚠️ | Review note | "Definition Drift" |
| CV-B7-06 | ATS is source of truth | B7: ATS not trusted / parallel systems | Data truth contradiction | ⛔ | Force-Red | "Data Chaos" |

### Block 7 (Data/AI) Internal Validations

| ID | B7 Claim | B7 Counter-Signal | Type | Severity | Auto-Action | Diagnosis |
|----|----------|-------------------|------|----------|-------------|-----------|
| CV-B7-07 | ATS is trusted | Data completeness <60% | Trust without substance | 🔴 | Uplift 1 | "Empty Trust" |
| CV-B7-08 | AI used operationally | Don't know what tools | Shadow AI | ⛔ | Force-Red | "Shadow AI Risk" |
| CV-B7-09 | GDPR understood | No retention policy | Compliance theatre | 🔴 | Uplift 1 | "Compliance Illusion" |
| CV-B7-10 | AI governance exists | AI decisions automated without oversight | Autonomous AI | 🔴 | Uplift 1 | "Ungoverned Automation" |

---

## Block 7 Special Amplification Rules

Block 7 has unique cross-validation behavior because it validates all other blocks:

### If B7 = RED, apply these additional effects:

| Affected Block | Effect |
|----------------|--------|
| Block 1 | Cannot be GREEN (visibility is illusion) |
| Block 2 | SLA-related claims downgraded 1 level |
| Block 4 | Cost metrics flagged "Unverified" |
| Block 6 | Operational claims flagged "Data Suspect" |
| Overall | "Low Confidence" modifier applied |

### If B7 = YELLOW (data issues):

| Affected Block | Effect |
|----------------|--------|
| Block 2 | If GREEN → cap at YELLOW |
| Block 3 | If GREEN → cap at YELLOW |
| Block 6 | If GREEN → cap at YELLOW |
| All metric claims | Require manual verification note |

---

## Contradiction Accumulation Logic

### Gate-Level Accumulation

Contradictions are counted per gate:

| Gate | Blocks | Soft Threshold | Effect |
|------|--------|----------------|--------|
| Ownership Gate | Block 1 | 2 soft | Uplift 1 level |
| Governance Gate | Blocks 2, 4 | 2 soft | Uplift 1 level |
| Execution Gate | Blocks 3, 5, 6 | 3 soft | Uplift 1 level |
| Systemic Layer | Block 7 | 2 soft | Apply DTC reduction |

### Cross-Gate Escalation

- Any hard contradiction (🔴) in any gate → immediate uplift
- Force-red (⛔) anywhere → overall RED
- 2+ hard contradictions across gates → overall RED
- Executive-level contradiction (Block 1 involved) → overall RED

---

## Implementation Checklist

For each audit:

1. **Calculate all block scores** (before cross-validation)
2. **Run all CV rules** against dropdown answers
3. **Accumulate contradictions** by severity and gate
4. **Apply soft escalations** if thresholds crossed
5. **Apply hard escalations** immediately
6. **Check force-red conditions** — if any, set overall RED
7. **Apply Block 7 amplification** based on B7 status
8. **Generate flags and diagnosis hints** for report
9. **Calculate final confidence score** with contradiction penalties

---

## Question Mapping Reference

Each CV rule should map to specific dropdown values. Example mappings:

### CV-01 Example
- B1 Source: Q3 answer = "CEO / Founder" or "COO / Business Operations"
- B6 Validator: Q6.1.2 = "No defined ownership" OR Q6.5.1 = "Stalls discovered only when escalated"
- If both conditions true → trigger CV-01

### CV-05 Example
- B2 Source: Q15 = "Yes, for most steps" AND Q16 = "Yes, monitored and visible"
- B6 Validator: Q6.4.2 = "Metrics not trusted / not available" OR Q6.5.1 = "Not tracked systematically"
- If both conditions true → trigger CV-05

(Full question mappings to be created during implementation phase)

---

## Diagnostic Output Templates

When contradictions are detected, generate these outputs:

### For Soft Contradictions (⚠️)
```
REVIEW NOTE: [Rule ID]
Possible mismatch detected between [Block X] and [Block Y].
[Block X] reports: [claim summary]
[Block Y] indicates: [counter-signal summary]
Recommendation: Verify during follow-up or Level 2 review.
Risk Factor: +0.5
```

### For Hard Contradictions (🔴)
```
WARNING: [Rule ID] - [Diagnosis Hint]
Direct contradiction detected.
[Block X] claims: [claim]
[Block Y] contradicts: [counter-signal]
Auto-Action: [Blocks affected] escalated by 1 level.
This finding requires attention regardless of local scores.
```

### For Force-Red (⛔)
```
CRITICAL: [Rule ID] - [Named Diagnosis]
Non-compensable contradiction detected.
Overall status forced to RED.
[Block X] claims: [claim]
[Block Y] proves: [counter-signal]
Executive Action Required: This structural failure cannot be averaged away.
```

---

## Version History

| Version | Changes |
|---------|---------|
| v1.0 | Initial 25 rules for Blocks 1-6 |
| v2.0 | Added Block 7 rules (CV-B7-01 through CV-B7-10), Block 7 amplification logic, accumulation rules, implementation checklist |
