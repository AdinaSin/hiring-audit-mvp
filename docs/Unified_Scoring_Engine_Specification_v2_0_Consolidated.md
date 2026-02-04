# Unified Scoring Engine Specification v2.0 (Consolidated)

## Document Purpose

This document is the **single source of truth** for all scoring logic in the Hiring Execution & Talent Efficiency Audit. It consolidates and supersedes:
- Unified_Scoring_Engine_Spec_v1.0
- Unified_Scoring_Engine_Spec_v1.1_with_Block_7
- Unified_Scoring_Engine_Weights_and_Amplification_Rules_v2.0
- Unified_Hiring_Health_Model_Gates_Escalations_Diagnoses_v1.0

All implementation should reference this document only.

---

## Core Design Principles

1. **No block is evaluated in isolation** — cross-validation is mandatory
2. **Gates override averages** — some conditions are non-compensable
3. **Contradictions are more important than scores** — misalignment reveals truth
4. **GREEN is earned, not averaged** — requires passing both score thresholds AND gate conditions
5. **Block 7 is a systemic multiplier** — affects confidence in all other blocks

---

## Block Architecture Overview

| Block | Name | Layer | Role |
|-------|------|-------|------|
| Block 1 | Executive Ownership | Gate 0 (Ownership) | GATEKEEPER — controls system stability |
| Block 2 | TA Leadership | Gate 1 (Governance) | EXECUTION BRAIN — capacity & process |
| Block 3 | Delivery & Hiring Leadership | Gate 2 (Execution) | DEMAND INTERFACE — intake & feedback |
| Block 4 | Financial Governance | Gate 1 (Governance) | COST CONTROL — budget & transparency |
| Block 5 | Technical Interviewing | Gate 2 (Execution) | BOTTLENECK LAYER — evaluation system |
| Block 6 | Recruitment Operations | Gate 2 (Execution) | STABILITY FOUNDATION — operational core |
| Block 7 | Reporting, Data & AI | Systemic Multiplier | TRUST LAYER — validates all other blocks |

---

## Scoring Mechanics

### Question-Level Scoring (0–3 Scale)

Each question produces a score:

| Score | Meaning | Pattern |
|-------|---------|---------|
| 3 | Green | Formalized, enforced, measured, cross-functional |
| 2 | Yellow-Green | Exists but inconsistently enforced or partially measured |
| 1 | Yellow-Orange | Mostly informal, ad-hoc, reactive |
| 0 | Red | Not present, no ownership, denial, dysfunction |

### Domain-Level Scoring

Each block has multiple domains. Domain score = average of questions in domain.

Domain status:
- GREEN: domain average ≥ 2.3
- YELLOW: domain average 1.3–2.29
- RED: domain average < 1.3 OR any critical question = 0

### Block-Level Scoring

Block score = weighted average of domain scores.

**Universal Block Status Thresholds:**

| Status | Threshold | Additional Conditions |
|--------|-----------|----------------------|
| GREEN | Average ≥ 2.3 | AND no RED domains in critical areas |
| YELLOW | Average 1.5–2.29 | OR 1-2 RED domains in non-critical areas |
| RED | Average < 1.5 | OR 3+ RED domains OR RED in any critical domain |

**Critical Domains by Block:**

| Block | Critical Domains |
|-------|-----------------|
| Block 1 | Ownership (Q3), Visibility (Q5-6), Governance Cadence (Q11-12) |
| Block 2 | Planning (D1), SLA (D5), Capacity (D6), Data (D9) |
| Block 3 | Demand Definition (D1), Interview Capacity (D3), Feedback (D4) |
| Block 4 | Budget Ownership (D1), Budget-Plan Alignment (D2), Review Cadence (D5) |
| Block 5 | Ownership (Q1), Capacity (Q2), SLA (Q3), Evaluation Framework (Q4) |
| Block 6 | Process (6.1), Data/ATS (6.4), Bottleneck Detection (6.5) |
| Block 7 | Reporting (D1), Data Integrity (D2), AI Governance (D5 if AI used) |

---

## Gate Logic (Non-Compensable Conditions)

Gates are binary pass/fail conditions that cannot be compensated by good scores elsewhere.

### Gate 0: Ownership Gate (Block 1)

**Condition:** Block 1 must not be RED

**If Block 1 = RED:**
- Overall system status = RED (forced)
- Diagnosis: "Ownerless Hiring"
- All other blocks capped at YELLOW (cannot be GREEN)

**If Block 1 = YELLOW:**
- If any other block = YELLOW or RED → escalate overall by one level
- Amplifies instability in the system

**Rationale:** Without executive ownership, all other improvements are politically contestable and will regress under pressure.

### Gate 1: Governance Gates (Blocks 2 & 4)

**Condition:** Neither Block 2 nor Block 4 can be RED

**If Block 2 = RED:**
- Overall system status = RED (forced)
- Diagnosis: "Ungoverned TA"
- Blocks 3 and 6 capped at YELLOW

**If Block 4 = RED:**
- Overall system status = RED (forced)
- Diagnosis: "Unfunded / Non-transparent TA"
- Blocks 2 and 6 capped at YELLOW

**Rationale:** TA cannot execute without capacity governance (Block 2) and cannot be trusted without financial transparency (Block 4).

### Gate 2: Execution Gates (Blocks 3, 5, 6)

**Condition:** No execution block can be RED without triggering overall RED

**If Block 3 = RED:**
- Overall system status = RED
- Diagnosis: "Delivery Bottleneck"
- Blocks 5 and 6 capped at YELLOW

**If Block 5 = RED:**
- Overall system status = RED
- Diagnosis: "Evaluation Collapse"
- Blocks 3 and 6 capped at YELLOW

**If Block 6 = RED:**
- Overall system status = RED
- Diagnosis: "Operational Fragility"
- Overall audit outcome ≤ YELLOW regardless of other blocks

**Rationale:** Any execution failure creates bottlenecks that cascade through the system.

### Systemic Multiplier: Block 7

Block 7 does not function as a gate but as a **confidence modifier**.

**Data Trust Coefficient (DTC):**

| Block 7 Status | DTC | Application |
|----------------|-----|-------------|
| GREEN | 1.0 | Full confidence in all metrics |
| YELLOW (minor) | 0.85 | Moderate confidence |
| YELLOW (data issues) | 0.75 | Low confidence, verification recommended |
| RED | 0.6 | Minimal confidence, all metrics suspect |

**Block 7 Amplification Rules:**

If Block 7 = RED:
- Block 1 cannot be GREEN (executive visibility is illusion)
- Block 2 SLA claims downgraded by 1 level
- Block 4 cost metrics flagged "Unverified"
- Block 6 operational claims flagged "Data Suspect"
- Overall audit receives "Low Confidence" modifier

If Block 7 = YELLOW:
- Blocks 2, 3, 6 capped at YELLOW (if they were GREEN)
- All metric-based claims require manual verification note

---

## Cross-Validation Logic

### Severity Classification

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| OK | ✓ | Aligned signals | No escalation |
| Soft Contradiction | ⚠️ | Plausible mismatch | Review note, +0.5 risk factor |
| Hard Contradiction | 🔴 | Direct incompatibility | Uplift 1 level |
| Force-Red | ⛔ | Non-compensable conflict | Overall = RED |

### Contradiction Accumulation Rules

1. **Single soft contradiction (⚠️):** Note added, no status change
2. **Two soft contradictions in same gate:** Escalate 1 level
3. **Any hard contradiction (🔴):** Immediate escalation 1 level for involved blocks
4. **Force-Red (⛔):** Overall status = RED, no compensation possible
5. **Executive contradiction (involving Block 1):** Force overall RED

### Key Cross-Validation Rules

| Rule ID | Source Claim | Validator Signal | Severity | Auto-Action |
|---------|--------------|------------------|----------|-------------|
| CV-01 | B1: Clear owner exists | B6: No ownership/vacancies stuck | ⛔ | Force-Red: "Ownerless Hiring in Practice" |
| CV-02 | B1: Annual plan exists | B2: No capacity model | 🔴 | Uplift 1: "Planning Illusion" |
| CV-05 | B2: SLA enforced | B6: No SLA tracking | ⛔ | Force-Red: "SLA Theater" |
| CV-06 | B2: Workload balanced | B6: Recruiters overloaded | 🔴 | Uplift 1: "Operational Overload" |
| CV-08 | B3: Interview capacity OK | B5: Ad-hoc availability | ⛔ | Force-Red: "Interview Bottleneck Masked" |
| CV-11 | B4: Budget tied to plan | B2: No demand model | 🔴 | Uplift 1: "Unfounded Budget" |
| CV-17 | B5: Interviewer SLA exists | B6: No escalation for delays | ⛔ | Force-Red: "Evaluation Governance Broken" |
| CV-20 | B1: Hiring not a bottleneck | B6: Large backlog exists | 🔴 | Uplift 1: "Bottleneck Denial" |

(Full matrix of 25 rules in Cross_Validation_Matrix_All_6_Blocks_v1.0)

---

## Overall Status Calculation

### Step 1: Calculate Block Scores

For each block:
1. Calculate question scores (0–3)
2. Calculate domain averages
3. Calculate block average
4. Apply block status thresholds
5. Check for critical domain failures

### Step 2: Apply Gates

In order:
1. Check Gate 0 (Block 1)
2. Check Gate 1 (Blocks 2 & 4)
3. Check Gate 2 (Blocks 3, 5, 6)

If any gate fails → set forced status

### Step 3: Apply Block 7 Multiplier

1. Calculate Block 7 status
2. Determine DTC
3. Apply amplification rules
4. Adjust confidence modifier

### Step 4: Run Cross-Validation

1. Check all cross-validation rules
2. Accumulate contradictions
3. Apply escalations

### Step 5: Determine Final Status

**GREEN (Healthy Hiring System):**
- All blocks ≥ YELLOW
- At least 5 blocks GREEN
- No gate failures
- No force-red contradictions
- Block 7 ≥ YELLOW
- ≤ 2 soft contradictions

**YELLOW (Managed Risk):**
- No RED blocks
- No gate failures
- 1-3 YELLOW blocks acceptable
- ≤ 1 hard contradiction (already escalated)
- Block 7 can be YELLOW

**YELLOW-HIGH (Near-Red):**
- 2+ YELLOW in Governance + Execution gates
- Or Block 1 = YELLOW with any other block YELLOW/RED
- Treatment: Recommend urgent attention

**RED (Structural Failure):**
- Any block = RED
- Any gate failure
- Any force-red contradiction
- 2+ hard contradictions
- Block 7 RED with any other operational issue

---

## Executive Diagnosis Outputs

When overall status = RED, one of these diagnoses is assigned:

| Diagnosis | Trigger Condition |
|-----------|-------------------|
| Ownerless Hiring | Block 1 RED |
| Illusion of Control | Block 1 GREEN/YELLOW but Block 6 RED or major contradictions |
| Ungoverned TA | Block 2 RED |
| Delivery Bottleneck | Block 3 RED |
| Financial Opacity | Block 4 RED |
| Evaluation Collapse | Block 5 RED |
| Operational Fragility | Block 6 RED |
| Systemic Visibility Failure | Block 7 RED with cascading effects |
| Governance Theatre | Multiple contradictions detected |
| Political Hiring | Multiple blocks show "loudest voice wins" pattern |

---

## Confidence Score

In addition to status, the audit produces a Confidence Score (0–100):

**Base Score:** Average of all block scores × 33.3

**Modifiers:**
- Block 7 DTC: multiply by DTC
- Each soft contradiction: -2 points
- Each hard contradiction: -5 points
- Each force-red: -15 points
- All blocks GREEN: +10 bonus

**Confidence Bands:**
- 85–100: High confidence
- 70–84: Moderate confidence
- 50–69: Low confidence
- <50: Minimal confidence

---

## Implementation Notes

### Determinism Guarantee

Given the same inputs, the engine will **always** produce the same output. No subjective interpretation is allowed at scoring level.

### Scoring Priority Order

1. Force-red conditions (highest priority)
2. Gate failures
3. Hard contradictions
4. Block scores
5. Soft contradictions
6. Block 7 modifiers
7. Confidence calculation

### Edge Cases

**All blocks GREEN, but contradictions exist:**
- Contradictions override local scores
- Apply escalation rules
- Result may be YELLOW or RED despite scores

**Block 7 RED, all others GREEN:**
- Block 7 amplification applies
- Other blocks downgraded
- Overall likely YELLOW with Low Confidence modifier

**Small company (no dedicated roles):**
- Some blocks may be "Not Applicable"
- Gate logic applies only to applicable blocks
- Confidence adjusted for reduced data

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | Initial | Basic scoring without Block 7 |
| v1.1 | +Block 7 | Added DTC, Block 7 amplification |
| v2.0 | Consolidated | Unified all versions, resolved contradictions, added confidence score |

---

## Appendix: Quick Reference Card

```
GATE CHECK ORDER:
1. Block 1 RED? → Force RED ("Ownerless Hiring")
2. Block 2 RED? → Force RED ("Ungoverned TA")
3. Block 4 RED? → Force RED ("Financial Opacity")
4. Block 3 RED? → Force RED ("Delivery Bottleneck")
5. Block 5 RED? → Force RED ("Evaluation Collapse")
6. Block 6 RED? → Force RED ("Operational Fragility")
7. Block 7 RED? → Apply amplification, not force-red

ESCALATION RULES:
- 1 hard contradiction → +1 level
- 2+ contradictions → Force RED
- Block 1 YELLOW + any other YELLOW → +1 level
- 2+ YELLOW in Governance+Execution → YELLOW-HIGH

BLOCK CAPS:
- Block 1 RED → all others ≤ YELLOW
- Block 2 RED → Blocks 3, 6 ≤ YELLOW
- Block 3 RED → Blocks 5, 6 ≤ YELLOW
- Block 4 RED → Blocks 2, 6 ≤ YELLOW
- Block 5 RED → Blocks 3, 6 ≤ YELLOW
- Block 6 RED → Overall ≤ YELLOW
- Block 7 YELLOW → Blocks 2, 3, 6 ≤ YELLOW
- Block 7 RED → Block 1 ≤ YELLOW, Low Confidence
```
