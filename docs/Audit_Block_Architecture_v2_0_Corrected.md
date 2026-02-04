# Audit Block Architecture — Corrected v2.0

This document defines the structural architecture of the Hiring Execution & Talent Efficiency Audit. It describes audit blocks as diagnostic lenses mapped to organizational power, accountability, and systemic risk zones.

**Note:** This version corrects the numbering inconsistency from v1.0 (which used letters A-E) to align with all other documentation (Blocks 1-7).

---

## Architecture Overview

The audit uses 7 blocks organized in three functional layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    OWNERSHIP LAYER                          │
│                      Block 1                                │
│            Executive Ownership & Governance                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   GOVERNANCE LAYER                          │
│         Block 2                    Block 4                  │
│    TA Leadership              Financial Governance          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXECUTION LAYER                           │
│    Block 3              Block 5              Block 6        │
│  Delivery &          Technical            Recruitment       │
│   Hiring            Interviewing          Operations        │
│  Leadership                                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 SYSTEMIC TRUST LAYER                        │
│                      Block 7                                │
│            Reporting, Data & AI Governance                  │
│              (Validates all other blocks)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Block 1: Executive Ownership & Governance

**Primary Roles:** CEO / COO / Business Owner / Managing Director

**Purpose:** Assess whether hiring outcomes are genuinely owned at the business level or implicitly delegated without control.

**What this block validates:**
- Existence of hiring as a business execution topic, not an HR concern
- Awareness of hiring impact on revenue, delivery, and growth timelines
- Presence of decision ownership when hiring fails
- Regular governance cadence for hiring priorities
- Financial awareness of hiring delays

**What this block does NOT test:**
- SLA definitions (Block 2)
- Operational recruitment metrics (Block 6)
- Cost structure details (Block 4)

**Key risks detected:**
- Strategic blindness to execution bottlenecks
- Delegation without accountability
- Optimistic reporting bias from downstream functions
- Political prioritization overriding business logic

**Gate Function:** Block 1 RED → System cannot exceed YELLOW

**Cross-validation targets:**
- Block 2 (TA Leadership)
- Block 4 (Financial Governance)
- Block 7 (Reporting visibility)

---

## Block 2: Talent Acquisition Leadership

**Primary Roles:** VP of Talent Acquisition / Head of Recruitment / TA Director

**Purpose:** Evaluate whether recruitment operates as a controlled system or a reactive service function.

**What this block validates:**
- Existence and enforcement of hiring processes
- Capacity planning logic and recruiter workload governance
- SLA definition and monitoring
- Ownership of bottlenecks and delays
- Cross-functional interface maturity
- Data and tooling reliability

**Key risks detected:**
- Hero-based delivery (key-person dependency)
- Process theater without control
- Reporting that masks root causes
- Capacity claims without methodology

**Gate Function:** Block 2 RED → System RED ("Ungoverned TA")

**Cross-validation targets:**
- Block 1 (Executive Ownership)
- Block 3 (Delivery)
- Block 4 (Financial Governance)
- Block 6 (Operations)

---

## Block 3: Delivery & Hiring Leadership

**Primary Roles:** Chief Delivery Officer / Head of Delivery / Engineering Directors / Hiring Managers

**Purpose:** Assess whether delivery leadership enables or obstructs hiring execution.

**What this block validates:**
- Availability and predictability of interview capacity
- Quality and timeliness of interview feedback
- Technical decision latency
- Priority alignment between delivery and hiring
- Demand definition quality at intake

**Key risks detected:**
- Interview bottlenecks disguised as recruitment failures
- Priority conflicts between delivery streams
- Silent veto power over hiring
- Feedback delays blocking pipeline flow

**Gate Function:** Block 3 RED → System RED ("Delivery Bottleneck")

**Cross-validation targets:**
- Block 2 (TA Leadership)
- Block 5 (Technical Interviewing)
- Block 6 (Operations)

---

## Block 4: Financial Governance & TA Budgeting

**Primary Roles:** CFO / Finance Director / VP Finance

**Purpose:** Determine whether hiring is financially governed as an investment rather than an expense.

**What this block validates:**
- Transparency of cost-per-hire and total hiring cost models
- Alignment between workforce planning and financial forecasting
- Visibility of hiring delays as financial risk
- TA budget ownership and structure
- Vendor and external spend governance

**Key risks detected:**
- Budget fragmentation
- Misleading efficiency metrics
- Disconnect between hiring plans and financial reality
- Uncontrolled agency spend

**Gate Function:** Block 4 RED → System RED ("Financial Opacity")

**Cross-validation targets:**
- Block 1 (Executive Ownership)
- Block 2 (TA Leadership)
- Block 6 (Operations)

---

## Block 5: Technical Interviewing & Evaluation Governance

**Primary Roles:** Head of Delivery / Engineering Director / CDO (validated by TA)

**Purpose:** Assess whether technical evaluation operates as a predictable, fair, and scalable system.

**What this block validates:**
- Existence of interviewer pool with defined capacity
- Interview availability SLAs and enforcement
- Standardized evaluation criteria
- Interviewer training and accountability
- Feedback quality and timeliness
- Decision authority and escalation paths

**Key risks detected:**
- Interview delays with no ownership
- Subjective evaluation overriding process
- Decision deadlocks and veto power without accountability
- False negatives due to calibration failures

**Gate Function:** Block 5 RED → System RED ("Evaluation Collapse")

**Cross-validation targets:**
- Block 2 (TA Leadership)
- Block 3 (Delivery Leadership)
- Block 6 (Operations)

---

## Block 6: Recruitment Operations Core

**Primary Roles:** TA Operations Lead / Head of TA / Recruitment Manager

**Purpose:** Validate whether hiring execution is repeatable, measurable, and scalable.

**What this block validates:**
- End-to-end process documentation and adherence
- Stage ownership and handoff clarity
- Intake quality and change control
- Capacity model and workload distribution
- ATS as source of truth
- Bottleneck detection and escalation
- Key-person risk and operational resilience

**Key risks detected:**
- Manual workarounds outside system
- Hero-based execution
- Data chaos preventing reliable reporting
- Rework loops destroying throughput
- Priority thrashing

**Gate Function:** Block 6 RED → Overall ≤ YELLOW ("Operational Fragility")

**Cross-validation targets:**
- Block 2 (TA Leadership)
- Block 3 (Delivery)
- Block 4 (Finance)
- Block 7 (Data integrity)

---

## Block 7: Reporting, Data & AI Governance

**Primary Roles:** TA Leadership / TA Ops / IT-Data / Compliance

**Purpose:** Validate the infrastructure of truth that all other blocks depend on.

**What this block validates:**
- Reporting coverage and quality
- Data integrity and ATS discipline
- Decision traceability and audit trails
- AI/automation inventory and governance
- GDPR and data protection compliance
- System integration and reliability

**Key risks detected:**
- Decisions made without reliable data
- Fragmented or manipulated reporting
- ATS used as storage, not decision system
- Shadow AI usage without governance
- Compliance gaps creating legal exposure

**Systemic Function:** Block 7 is NOT a gate but a multiplier:
- Block 7 RED → All metric-based claims suspect
- Block 7 YELLOW → Execution blocks capped at YELLOW
- Block 7 generates Data Trust Coefficient (0.6–1.0)

**Cross-validation targets:**
- All blocks (Block 7 validates everyone)

---

## Block Interaction Matrix

| If Block X = RED | Effect on Other Blocks |
|------------------|----------------------|
| Block 1 RED | All blocks capped at YELLOW |
| Block 2 RED | Blocks 3, 6 capped at YELLOW |
| Block 3 RED | Blocks 5, 6 capped at YELLOW |
| Block 4 RED | Blocks 2, 6 capped at YELLOW |
| Block 5 RED | Blocks 3, 6 capped at YELLOW |
| Block 6 RED | Overall outcome ≤ YELLOW |
| Block 7 RED | Block 1 capped at YELLOW; Low Confidence applied |
| Block 7 YELLOW | Blocks 2, 3, 6 capped at YELLOW |

---

## Cross-Validation Philosophy

Blocks are designed to surface systemic contradictions rather than confirm individual narratives:

- **Business vs Finance (B1 ↔ B4):** Strategy intent vs financial reality
- **Business vs TA (B1 ↔ B2):** Ownership claims vs operational constraints
- **TA vs Delivery (B2 ↔ B3):** Process capability vs interview capacity
- **Delivery vs Technical (B3 ↔ B5):** Priority claims vs evaluation behavior
- **Finance vs TA (B4 ↔ B2):** Budget assumptions vs cost drivers
- **Operations vs All (B6 ↔ All):** Execution reality vs declared processes
- **Data vs All (B7 ↔ All):** Reported metrics vs data integrity

---

## Respondent Isolation

Critical design principle: Each role completes questions independently without visibility into other roles' responses.

**Why:**
- Prevents coordination to present unified (but false) narrative
- Enables contradiction detection
- Surfaces political distortions
- Exposes gaps between declared and actual behavior

**Implementation:**
- Separate forms per role
- No shared links
- Timestamps tracked for sequence analysis
- "Perfect alignment" treated as suspicious signal

---

## Mapping to Old Architecture (v1.0)

For reference only — use Block 1-7 numbering in all new work:

| Old (v1.0) | New (v2.0) | Notes |
|------------|------------|-------|
| Block A: Business Ownership | Block 1: Executive Ownership | Renamed for clarity |
| Block B: Financial Governance | Block 4: Financial Governance | Reordered |
| Block C: TA System Ownership | Block 2: TA Leadership | Reordered |
| Block D: Delivery & Capacity | Block 3: Delivery & Hiring Leadership | Split, expanded |
| Block E: Hiring Decision Layer | Block 5: Technical Interviewing | Expanded, always included |
| (not in v1.0) | Block 6: Recruitment Operations | New block |
| (not in v1.0) | Block 7: Reporting, Data & AI | New block |

---

## Usage Guidelines

1. **All 7 blocks are mandatory** in every audit regardless of company size
2. **Block 7 is always included** (it validates all others)
3. **Block-specific questions may be reduced** for Lite tier but structure remains
4. **Cross-validation is automatic** — system detects contradictions
5. **Gate logic is non-negotiable** — cannot be overridden by good scores elsewhere
