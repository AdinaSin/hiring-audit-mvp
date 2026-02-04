# Audit Block 7 — Reporting, Data Integrity & AI Governance Question Blueprint, Dropdown Logic & Scoring Signals (v1.0)

## Block Purpose

Block 7 evaluates whether the organization has operational visibility, data integrity, reporting maturity, and AI governance to support reliable hiring decisions. This block acts as a **systemic multiplier**: weaknesses here distort all other blocks even if processes formally exist.

**Core Principle:** Without reliable data and governed AI, all other audit findings are suspect. Block 7 validates or invalidates the confidence in Blocks 1–6.

## Target Respondents

**Primary:** Head/VP of Talent Acquisition, TA Operations Lead, HR Systems Owner

**Secondary/Validation:** CTO/IT (for AI governance), Finance (for reporting alignment), Legal/Compliance (for GDPR)

## Why Block 7 is a Systemic Multiplier

Unlike Blocks 1–6 which evaluate specific functions, Block 7 evaluates the **infrastructure of truth**. Consider:

- Block 2 claims "SLAs are monitored" → But if ATS data is unreliable, SLA tracking is meaningless
- Block 4 claims "cost-per-hire is tracked" → But if data sources are fragmented, the number is fiction
- Block 1 claims "executive visibility exists" → But if reports are manual and inconsistent, visibility is an illusion

Block 7 determines whether other blocks are measuring reality or measuring artifacts of broken systems.

## Scoring Approach (High Level)

Scoring is pattern-based. Each domain generates a signal (Green / Yellow / Red) based on combinations of answers.

**Primary Signals:**
- Reporting Coverage & Quality
- Data Integrity & ATS Discipline
- Decision Transparency
- AI/Automation Inventory
- AI Governance Maturity
- Compliance & Data Protection
- Systemic Trust Level

---

## Domain 1 — Reporting Coverage & Structure

### Q1. Does the company have standardized TA/hiring reports?

Dropdown options:
- Yes, automated dashboards updated in real-time
- Yes, automated reports on scheduled cadence (daily/weekly)
- Yes, but manually compiled
- Partial (some reports exist, inconsistent)
- No standardized reporting
- Not relevant

Signal focus: Reporting Maturity

Auto-flag rules:
- If 'No standardized reporting' → Red (Blind Management)

---

### Q2. What reporting layers exist for hiring data?

Dropdown options (multi-select):
- Executive/C-level dashboards
- TA leadership operational reports
- Hiring manager self-service views
- Finance-specific hiring reports
- Delivery/business unit reports
- No layered reporting exists

Signal focus: Reporting Reach

---

### Q3. Are hiring reports used for actual decision-making at C-level?

Dropdown options:
- Yes, regularly drive decisions (budget, priorities, escalations)
- Yes, but only for major issues
- Reports exist but rarely influence decisions
- No C-level engagement with hiring reports
- Not relevant

Signal focus: Executive Data Usage

Auto-flag rules:
- If 'No C-level engagement' → Red (Executive Blindness)

---

### Q4. What key metrics are tracked and reported?

Dropdown options (multi-select):
- Time-to-hire / Time-to-fill
- Source effectiveness / Channel ROI
- Pipeline conversion rates (stage-to-stage)
- Recruiter productivity / workload
- Cost-per-hire
- Offer acceptance rate
- Quality of hire indicators
- Hiring plan vs. actual progress
- SLA compliance rates
- Interviewer performance/availability
- Candidate experience scores
- None of the above / Not sure

Signal focus: Metric Completeness

---

### Q5. How consistent are report definitions across the organization?

Dropdown options:
- Fully standardized (same definitions everywhere)
- Mostly consistent with minor variations
- Significant variations by team/function
- No standard definitions exist
- Not relevant

Signal focus: Definition Integrity

Auto-flag rules:
- If 'No standard definitions' → Yellow (Metric Chaos)

---

## Domain 2 — Data Integrity & ATS Discipline

### Q6. Is the ATS the single source of truth for hiring pipeline data?

Dropdown options:
- Yes, ATS is mandatory and trusted
- ATS is primary but parallel trackers exist (spreadsheets, etc.)
- ATS is one of several systems with unclear primacy
- Spreadsheets/manual tracking are primary
- No ATS exists
- Not relevant

Signal focus: System of Record Clarity

Auto-flag rules:
- If 'No ATS exists' or 'Spreadsheets are primary' → Red (Data Collapse)

---

### Q7. How complete is data entry in the ATS?

Dropdown options:
- Very high (>95% of required fields populated)
- High (80-95%)
- Moderate (60-80%)
- Low (<60%)
- Not measured
- Not relevant

Signal focus: Data Completeness

---

### Q8. Is there defined ownership for ATS data quality?

Dropdown options:
- Yes, dedicated data quality owner/team
- Yes, but part-time / secondary responsibility
- Informal (individual recruiters responsible)
- No ownership defined
- Not relevant

Signal focus: Data Ownership

---

### Q9. How often is ATS data audited for accuracy?

Dropdown options:
- Regularly (monthly or more)
- Quarterly
- Annually
- Ad-hoc / when problems noticed
- Never
- Not relevant

Signal focus: Data Hygiene Discipline

---

### Q10. Are there data entry standards and enforcement mechanisms?

Dropdown options:
- Mandatory fields + validation rules + regular audits
- Mandatory fields but limited enforcement
- Guidelines exist but not enforced
- No standards
- Not relevant

Signal focus: Data Governance

---

### Q11. Can hiring data be reliably segmented (by role type, level, location, business unit)?

Dropdown options:
- Yes, fully segmentable with clean taxonomy
- Mostly, with some inconsistencies
- Difficult due to data quality issues
- Cannot segment reliably
- Not relevant

Signal focus: Data Usability

---

## Domain 3 — Decision Transparency & Audit Trail

### Q12. Are hiring decisions traceable (who decided, when, why)?

Dropdown options:
- Full audit trail in ATS/systems
- Partial trail (some decisions documented)
- Minimal documentation
- No traceability
- Not relevant

Signal focus: Decision Auditability

Auto-flag rules:
- If 'No traceability' → Yellow (Accountability Gap)

---

### Q13. Can you reconstruct the history of any given requisition?

Dropdown options:
- Yes, complete history available
- Mostly, with some gaps
- Difficult / requires manual research
- Cannot reconstruct
- Not relevant

Signal focus: Process Transparency

---

### Q14. Are rejection reasons for candidates systematically captured?

Dropdown options:
- Yes, standardized reasons required
- Yes, but free-text only
- Inconsistently captured
- Not captured
- Not relevant

Signal focus: Decision Quality Data

---

## Domain 4 — AI & Automation Inventory

### Q15. Is AI or automation used in any part of the hiring process?

Dropdown options:
- Yes, strategically across multiple stages
- Yes, operationally in specific areas
- Experimenting / piloting
- No AI/automation in use
- Not sure what's in use
- Not relevant

Signal focus: AI Adoption Level

---

### Q16. Where is AI/automation currently used? (Select all that apply)

Dropdown options (multi-select):
- Job description writing/optimization
- Candidate sourcing / matching
- Resume screening / parsing
- Chatbots for candidate engagement
- Interview scheduling
- Assessment / skills testing
- Video interview analysis
- Background checks
- Offer generation / negotiation support
- Predictive analytics (quality of hire, flight risk)
- Workforce planning / demand forecasting
- None / not applicable

Signal focus: AI Footprint

---

### Q17. Is there a complete inventory of AI tools used in hiring?

Dropdown options:
- Yes, documented and maintained
- Partial inventory exists
- No formal inventory
- Not sure what AI tools are in use
- Not relevant

Signal focus: AI Visibility

Auto-flag rules:
- If 'Not sure what AI tools are in use' → Red (Shadow AI Risk)

---

### Q18. Are AI tools vendor-provided, built in-house, or both?

Dropdown options:
- Primarily vendor/SaaS tools
- Primarily in-house developed
- Mix of both
- Not sure
- Not applicable

Signal focus: AI Source Awareness

---

## Domain 5 — AI Governance & Risk Management

### Q19. Is there a formal AI governance policy for hiring?

Dropdown options:
- Yes, comprehensive policy documented and enforced
- Yes, basic guidelines exist
- Informal understanding only
- No policy exists
- Not relevant

Signal focus: AI Governance Maturity

Auto-flag rules:
- If AI is used (Q15 = Yes) AND 'No policy exists' → Red (Ungoverned AI)

---

### Q20. Is human oversight required for AI-influenced hiring decisions?

Dropdown options:
- Yes, always (AI recommends, humans decide)
- Yes, for final decisions only
- Sometimes, depends on the stage
- No, AI decisions are automated
- Not applicable
- Not relevant

Signal focus: Human-in-the-Loop

Auto-flag rules:
- If 'AI decisions are automated' for screening/rejection → Red (Autonomous AI Risk)

---

### Q21. Can candidates request explanation of AI-influenced decisions?

Dropdown options:
- Yes, process exists and is communicated
- Yes, but process is unclear
- No formal process
- Not applicable
- Not relevant

Signal focus: AI Transparency to Candidates

---

### Q22. Is AI bias testing performed?

Dropdown options:
- Yes, regularly with documented results
- Yes, but irregularly
- One-time assessment only
- No bias testing
- Not applicable
- Not relevant

Signal focus: AI Fairness

Auto-flag rules:
- If AI used for screening AND 'No bias testing' → Yellow (Bias Risk)

---

### Q23. Is there accountability assigned for AI outcomes in hiring?

Dropdown options:
- Yes, clear owner for AI governance and outcomes
- Shared responsibility defined
- IT/vendor responsibility assumed
- No accountability defined
- Not applicable
- Not relevant

Signal focus: AI Accountability

---

### Q24. Are there defined criteria for approving new AI tools in hiring?

Dropdown options:
- Yes, formal evaluation and approval process
- Informal review process
- No criteria (tools adopted ad-hoc)
- Not relevant

Signal focus: AI Procurement Governance

---

## Domain 6 — Compliance & Data Protection

### Q25. Are GDPR / data protection requirements understood for hiring data?

Dropdown options:
- Yes, fully understood with documented compliance
- Generally understood but not fully documented
- Partial understanding
- Limited / no understanding
- Not applicable (non-EU, no equivalent requirements)
- Not relevant

Signal focus: Compliance Awareness

---

### Q26. Is there a defined data retention policy for candidate data?

Dropdown options:
- Yes, documented with automated enforcement
- Yes, documented but manual enforcement
- Informal understanding only
- No retention policy
- Not relevant

Signal focus: Data Retention Governance

Auto-flag rules:
- If GDPR applies AND 'No retention policy' → Red (Compliance Risk)

---

### Q27. Do candidates provide explicit consent for data processing?

Dropdown options:
- Yes, documented consent with audit trail
- Yes, but consent process inconsistent
- Implied consent only
- No formal consent process
- Not relevant

Signal focus: Consent Management

---

### Q28. Are candidate data access rights supported (access, correction, deletion)?

Dropdown options:
- Yes, process exists and tested
- Yes, but process is slow/manual
- Limited support
- Not supported
- Not relevant

Signal focus: Data Rights Compliance

---

### Q29. Is there a data breach response plan that includes hiring data?

Dropdown options:
- Yes, hiring data explicitly covered
- General plan exists, hiring data implied
- No breach response plan
- Not relevant

Signal focus: Incident Readiness

---

### Q30. Who is responsible for hiring data compliance?

Dropdown options:
- Dedicated compliance/DPO role
- Legal/HR shared responsibility
- TA leadership assumed responsible
- No defined responsibility
- Not relevant

Signal focus: Compliance Ownership

---

## Domain 7 — Integration & System Health

### Q31. How well do hiring systems integrate with each other?

Dropdown options:
- Fully integrated (ATS, HRIS, Finance, etc.)
- Mostly integrated with some manual bridges
- Limited integration (significant manual data transfer)
- No integration (siloed systems)
- Not relevant

Signal focus: System Integration

---

### Q32. How often do system issues disrupt hiring operations?

Dropdown options:
- Rarely (once a quarter or less)
- Occasionally (monthly)
- Frequently (weekly)
- Constantly (daily issues)
- Not tracked
- Not relevant

Signal focus: System Reliability

---

### Q33. Is there technical support for hiring systems?

Dropdown options:
- Dedicated support with defined SLAs
- Shared IT support
- Vendor support only
- Limited / no support
- Not relevant

Signal focus: Support Infrastructure

---

---

## Scoring Blueprint (Detailed)

For implementation, each domain can be scored 0–3:
- 3 (Green): Formalized, enforced, measured, governed
- 2 (Light Green/Yellow): Exists but inconsistently enforced or partially measured
- 1 (Yellow/Orange): Mostly informal, ad-hoc, reactive
- 0 (Red): Not present / no ownership / no measurement / chaos

### Domain Scoring Weights:
- Domain 1 (Reporting): Critical
- Domain 2 (Data Integrity): Critical
- Domain 3 (Decision Transparency): High
- Domain 4 (AI Inventory): Medium (Critical if AI is used)
- Domain 5 (AI Governance): Critical if AI is used, Low if not
- Domain 6 (Compliance): High
- Domain 7 (System Health): Medium

### Block 7 Overall Zone Calculation:

**Green Zone:**
- Average score ≥ 2.3
- AND ATS is source of truth (Q6 = Yes)
- AND Reporting is standardized (Q1 ≠ No)
- AND if AI used, governance exists (Q19 ≠ No policy)
- AND compliance ownership defined (Q30 ≠ No defined responsibility)

**Yellow Zone:**
- Average score 1.3–2.29
- OR ATS exists but parallel systems in use
- OR AI used with partial governance
- OR Compliance partially understood

**Red Zone:**
- Average score < 1.3
- OR No ATS / spreadsheets primary (Q6 = Red options)
- OR No standardized reporting (Q1 = No)
- OR AI used without governance (Q15 = Yes AND Q19 = No policy)
- OR Shadow AI detected (Q17 = Not sure)
- OR Critical compliance gaps (Q26 = No retention + GDPR applies)

---

## Systemic Amplification Rules

Block 7 uniquely affects other blocks through amplification:

### If Block 7 = RED:
- Block 1 cannot be GREEN (executive visibility is an illusion)
- Block 2 SLA claims downgraded by 1 level
- Block 4 cost metrics flagged as "Unverified"
- Block 6 operational claims flagged as "Data Suspect"
- Overall audit receives "Low Confidence" modifier

### If Block 7 = YELLOW:
- Blocks 2, 3, 6 GREEN → capped at YELLOW
- All metric-based claims require manual verification note

### If Block 7 = GREEN:
- Stabilizes other blocks (no amplification)
- Increases overall audit confidence score

---

## Cross-Validation Flags (Auto-Generated)

### With Block 1 (Executive Ownership):
- If Block 1 claims "executive visibility exists" but Block 7 shows "no C-level reports used" → **Visibility Illusion Flag**

### With Block 2 (TA Leadership):
- If Block 2 claims "SLAs are monitored" but Block 7 shows "ATS is not source of truth" → **SLA Tracking Unreliable Flag**
- If Block 2 claims "capacity model exists" but Block 7 shows "cannot segment data by role" → **Capacity Calculation Suspect Flag**

### With Block 4 (Financial Governance):
- If Block 4 claims "cost-per-hire tracked" but Block 7 shows "data quality low" → **Cost Data Unreliable Flag**

### With Block 5 (Technical Interviewing):
- If Block 5 claims "interviewer SLAs exist" but Block 7 shows "decisions not traceable" → **Interview Accountability Gap Flag**

### With Block 6 (Recruitment Operations):
- If Block 6 claims "ATS is source of truth" but Block 7 shows otherwise → **Data Truth Contradiction Flag** (Critical)

### Internal Block 7 Contradictions:
- If Q6 claims "ATS is trusted" but Q7 shows "data completeness <60%" → **Trust Without Substance**
- If Q15 shows "AI used" but Q17 shows "don't know what tools" → **Shadow AI**
- If Q25 claims "GDPR understood" but Q26 shows "no retention policy" → **Compliance Theatre**

---

## Primary Signals Generated

- Data Reliability Signal
- Reporting Maturity Signal
- AI Governance Signal
- Compliance Readiness Signal
- System Health Signal
- **Systemic Trust Coefficient** (unique to Block 7)

---

## Data Trust Coefficient (DTC)

Block 7 produces a Data Trust Coefficient (0.6–1.0) that modifies confidence in other blocks:

| Block 7 Status | DTC Value | Effect |
|----------------|-----------|--------|
| GREEN | 1.0 | Full confidence |
| YELLOW (minor issues) | 0.85 | Moderate confidence |
| YELLOW (data issues) | 0.75 | Low confidence |
| RED | 0.6 | Minimal confidence |

**Application:** Final Block Score = Base Score × DTC

---

## Usage in Final Report

- Data & Reporting Maturity Assessment
- AI Governance Risk Map
- Compliance Readiness Statement
- Systemic Trust Level indicator
- **Confidence Modifier** applied to all other findings
- Recommendations for Data, Reporting, and AI Governance improvements

---

## Special Considerations

### For Companies Not Using AI:
- Domains 4–5 are scored as "Not Applicable"
- Block 7 score calculated from Domains 1–3, 6–7 only
- No AI-related flags generated

### For Startups/Small Companies (<50 employees):
- Some questions may be "Not Relevant"
- Reduced weight on formal governance questions
- Emphasis on data basics (ATS usage, basic reporting)

### For Regulated Industries:
- Domain 6 (Compliance) weight increases
- Additional scrutiny on audit trail completeness
- AI explainability requirements elevated
