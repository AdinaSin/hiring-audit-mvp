# Audit Block 4 — Financial Governance & TA Budgeting Question Blueprint, Dropdown Logic & Scoring Signals (v1.0)

## Block Purpose

This block evaluates whether financial governance enables or constrains hiring execution. It validates budget transparency, planning linkage between hiring demand and TA spend, cost visibility, vendor governance, and financial accountability. Block 4 answers the question: "Is hiring financially governed as a strategic investment or treated as an uncontrolled expense?"

## Target Respondent

CFO / Finance Director / VP Finance / Head of Finance / Finance Business Partner (whoever owns TA budget governance)

Secondary validation: Head of Talent Acquisition (for cross-check on budget process experience)

## Important Clarification: TA Budget vs Hiring Cost Budget

This block focuses on the **TA operating budget** (the cost of running the recruitment function), NOT the total salary/compensation budget for new hires. TA budget typically includes:
- Recruiter and sourcer salaries
- Agency fees
- Job boards and sourcing tools
- ATS/CRM licensing
- Assessment tools
- Employer branding spend
- Recruitment marketing
- Events and referral programs

The **hiring cost budget** (salaries of people being hired) is a separate planning exercise usually owned by business units or HR workforce planning.

## Scoring Approach (High Level)

Scoring is pattern-based. Each domain generates a signal (Green / Yellow / Red) based on combinations of answers.

Primary signals:
- TA Budget Ownership & Structure
- Budget-Plan Alignment
- Cost Visibility & Transparency
- External Spend Governance
- Financial Review Cadence
- Cost Leakage Detection
- Financial Escalation Maturity
- Hiring Cost Awareness
- Finance-TA Partnership Quality

---

## Domain 1 — TA Budget Ownership & Structure

### Q1. Is there a formally approved annual TA operating budget?

Dropdown options:
- Yes, line-item budget approved and tracked
- Yes, but high-level only (lump sum without breakdown)
- Partial (only major items like agency spend)
- No formal TA budget exists
- Not relevant

Signal focus: Budget Governance Maturity

Auto-flag rules:
- If 'No formal TA budget exists' + company size >50 → Red (Budget Absence)

---

### Q2. Who owns the TA budget?

Dropdown options:
- TA Head / VP TA with clear accountability
- HR / CHRO (TA budget is part of HR budget)
- Finance owns directly, TA has no budget authority
- Shared / unclear ownership
- No defined owner
- Not relevant

Signal focus: Accountability Clarity

Auto-flag rules:
- If 'No defined owner' → Red (Ownerless Budget)

---

### Q3. How is the TA budget structured?

Dropdown options:
- Fully itemized by cost category (headcount, tools, agencies, marketing, etc.)
- Partially itemized (major categories only)
- Single line item (total TA spend)
- No structure / ad-hoc allocation
- Not relevant

Signal focus: Budget Granularity

---

### Q4. What does the TA budget typically include? (Select all that apply)

Dropdown options (multi-select):
- TA headcount cost (recruiter/sourcer salaries)
- Agency / RPO fees
- Job boards / sourcing tools
- ATS / CRM licensing
- Assessment / testing tools
- Employer branding spend
- Recruitment marketing
- Events / career fairs
- Referral program costs
- Training / enablement for TA team
- Travel / relocation support (if TA-owned)
- Background checks / screening
- Not sure what's included

Signal focus: Budget Scope Completeness

---

## Domain 2 — Budget-Plan Alignment

### Q5. Is the TA budget derived from an approved hiring plan?

Dropdown options:
- Yes, TA budget is calculated based on hiring plan volumes and complexity
- Partially aligned (budget considers plan but not formula-driven)
- TA budget is set independently of hiring plan
- No hiring plan exists to align with
- Not relevant

Signal focus: Planning Integration

Auto-flag rules:
- If 'No hiring plan exists' → Red (Planning Absence)
- If 'TA budget set independently' + hiring plan exists → Yellow (Disconnected Planning)

---

### Q6. How is the relationship between hiring volume and TA budget managed?

Dropdown options:
- Explicit formula / ratio (e.g., cost-per-hire target, recruiter:req ratio)
- General understanding but no formula
- No defined relationship
- Not relevant

Signal focus: Capacity-Budget Logic

---

### Q7. When hiring demand increases mid-year, how is TA budget adjusted?

Dropdown options:
- Automatic adjustment based on defined triggers
- Formal re-forecast process with Finance approval
- Case-by-case negotiation
- Budget is fixed regardless of demand changes
- TA absorbs increased demand without budget change
- Not relevant

Signal focus: Budget Flexibility

Auto-flag rules:
- If 'TA absorbs without budget change' + demand volatility high → Red (Unfunded Mandate)

---

### Q8. When hiring demand decreases significantly, what happens to TA budget?

Dropdown options:
- Proportional reduction with reallocation options
- Partial clawback by Finance
- Budget remains unchanged
- No defined process
- Not relevant

Signal focus: Budget Symmetry

---

## Domain 3 — Cost Visibility & Transparency

### Q9. Does Finance have visibility into TA cost components?

Dropdown options:
- Full visibility with itemized reporting
- High-level visibility only
- Limited visibility (only total spend)
- No visibility into TA costs
- Not relevant

Signal focus: Financial Transparency

Auto-flag rules:
- If 'No visibility' → Red (Financial Blind Spot)

---

### Q10. Can you calculate cost-per-hire by role type or level?

Dropdown options:
- Yes, tracked and reported regularly
- Can calculate but not routinely tracked
- Rough estimates only
- Cannot calculate
- Not relevant

Signal focus: Unit Economics Awareness

---

### Q11. Is time-to-fill tracked and linked to cost implications?

Dropdown options:
- Yes, delay costs are quantified and reported
- Time-to-fill tracked but not linked to cost
- Time-to-fill tracked inconsistently
- Not tracked
- Not relevant

Signal focus: Delay Cost Awareness

---

### Q12. Are hiring-related cost variances explained and understood?

Dropdown options:
- Yes, variances analyzed monthly/quarterly with root cause
- Variances reported but not analyzed
- Variances noticed only when significant
- No variance tracking
- Not relevant

Signal focus: Cost Control Discipline

---

## Domain 4 — External Spend Governance

### Q13. How is agency / RPO spend governed?

Dropdown options:
- Pre-approved vendor list + spend limits + performance tracking
- Pre-approved vendors but no spend limits
- Approved case-by-case
- No governance (anyone can engage agencies)
- We don't use agencies
- Not relevant

Signal focus: Vendor Governance

Auto-flag rules:
- If 'No governance' + agency spend >20% of TA budget → Red (Uncontrolled Vendor Spend)

---

### Q14. Are agency fees benchmarked and negotiated?

Dropdown options:
- Yes, regularly benchmarked with negotiated rates
- Negotiated initially but not reviewed
- Standard rates accepted
- Not sure
- Not relevant

Signal focus: Procurement Maturity

---

### Q15. Is there visibility into agency performance vs. cost?

Dropdown options:
- Full tracking (cost per hire by agency, quality metrics, time metrics)
- Partial tracking (volume only)
- No performance tracking
- Not relevant

Signal focus: Vendor ROI Awareness

---

### Q16. How are recruitment tools and technology purchases governed?

Dropdown options:
- Formal procurement process with ROI justification
- TA proposes, Finance approves
- Ad-hoc purchasing
- No governance
- Not relevant

Signal focus: Tool Spend Control

---

## Domain 5 — Financial Review Cadence

### Q17. How often is TA spend reviewed against budget?

Dropdown options:
- Monthly
- Quarterly
- Semi-annually
- Annually only
- Ad-hoc / when issues arise
- Never
- Not relevant

Signal focus: Review Discipline

Auto-flag rules:
- If 'Never' or 'Annually only' → Red (No Financial Oversight)

---

### Q18. Who participates in TA budget reviews?

Dropdown options:
- Finance + TA Head + Business stakeholders
- Finance + TA Head only
- Finance only (TA not involved)
- TA only (Finance not involved)
- No formal reviews
- Not relevant

Signal focus: Governance Participation

---

### Q19. Are TA financial reports shared with business leadership?

Dropdown options:
- Yes, regularly as part of business reviews
- Yes, but only when requested
- No, TA financials stay within HR/Finance
- Not relevant

Signal focus: Executive Visibility

---

### Q20. What level of detail is in TA financial reports?

Dropdown options:
- Detailed (by cost category, by business unit, trends, forecasts)
- Moderate (totals by category, basic trends)
- Basic (total spend only)
- No reports exist
- Not relevant

Signal focus: Reporting Quality

---

## Domain 6 — Cost Leakage & Efficiency

### Q21. Are hiring-related cost overruns actively identified and investigated?

Dropdown options:
- Yes, systematically with root cause analysis
- Yes, but only major overruns
- Noticed but not investigated
- Not tracked
- Not relevant

Signal focus: Cost Leakage Detection

Auto-flag rules:
- If 'Not tracked' → Red (Cost Blindness)

---

### Q22. Is the cost of unfilled positions (vacancy cost) calculated?

Dropdown options:
- Yes, calculated and used in prioritization decisions
- Calculated but not actively used
- Rough estimates exist
- Not calculated
- Not relevant

Signal focus: Opportunity Cost Awareness

---

### Q23. Is the cost of bad hires (turnover within first year) tracked?

Dropdown options:
- Yes, tracked and attributed to hiring process
- Turnover tracked but not linked to hiring cost
- Not tracked
- Not relevant

Signal focus: Quality Cost Awareness

---

### Q24. Are there efficiency targets for TA (e.g., cost-per-hire reduction)?

Dropdown options:
- Yes, defined targets with accountability
- Informal expectations exist
- No targets
- Not relevant

Signal focus: Efficiency Governance

---

## Domain 7 — Financial Escalation & Decision Rights

### Q25. When TA spend significantly deviates from plan, what happens?

Dropdown options:
- Formal escalation with defined thresholds and decision process
- Informal escalation to Finance/HR leadership
- Nothing happens until year-end
- Not relevant

Signal focus: Escalation Maturity

Auto-flag rules:
- If 'Nothing happens until year-end' → Red (No Financial Controls)

---

### Q26. Who has authority to approve unplanned TA expenditure?

Dropdown options:
- Defined approval matrix by amount
- TA Head within limits, escalation above
- All requires Finance approval
- No clear authority
- Not relevant

Signal focus: Decision Rights Clarity

---

### Q27. Can TA reallocate budget between categories (e.g., from tools to agencies)?

Dropdown options:
- Yes, within defined limits
- Requires approval but generally possible
- Very difficult / frozen categories
- Not relevant

Signal focus: Budget Flexibility

---

## Domain 8 — Finance-TA Partnership

### Q28. How would you describe the Finance-TA working relationship?

Dropdown options:
- Strategic partnership (joint planning, shared goals)
- Functional partnership (regular coordination)
- Transactional (approvals and reporting only)
- Adversarial / friction
- Minimal interaction
- Not relevant

Signal focus: Partnership Quality

---

### Q29. Does Finance understand TA cost drivers?

Dropdown options:
- Yes, Finance actively engages with TA economics
- General understanding
- Limited understanding
- No understanding
- Not relevant

Signal focus: Financial Literacy Alignment

Auto-flag rules:
- If 'No understanding' → Yellow (Finance-TA Gap)

---

### Q30. Is there a Finance business partner assigned to TA/HR?

Dropdown options:
- Yes, dedicated Finance partner
- Shared Finance partner (covers multiple functions)
- No dedicated support
- Not relevant

Signal focus: Support Structure

---

### Q31. How often do Finance and TA meet to discuss hiring economics?

Dropdown options:
- Monthly or more frequently
- Quarterly
- Semi-annually
- Annually
- Only when issues arise
- Never
- Not relevant

Signal focus: Engagement Cadence

---

## Domain 9 — Compliance & Risk

### Q32. Are there controls to prevent unauthorized TA spending?

Dropdown options:
- Yes, system-enforced controls
- Manual approval controls
- Limited controls
- No controls
- Not relevant

Signal focus: Spend Controls

---

### Q33. Is TA spend auditable?

Dropdown options:
- Yes, full audit trail exists
- Partially auditable
- Not auditable
- Not relevant

Signal focus: Audit Readiness

---

### Q34. Are there compliance requirements affecting TA spend (e.g., procurement policies)?

Dropdown options:
- Yes, and TA is compliant
- Yes, but compliance is inconsistent
- Not sure
- No specific requirements
- Not relevant

Signal focus: Compliance Awareness

---

## Scoring Blueprint (Detailed)

For implementation, each domain can be scored 0–3:
- 3 (Green): Formalized, enforced, measured, transparent
- 2 (Light Green/Yellow): Exists but inconsistently enforced or partially measured
- 1 (Yellow/Orange): Mostly informal, ad-hoc, reactive
- 0 (Red): Not present / no ownership / no measurement

### Domain Scoring Weights:
- Domain 1 (Budget Ownership): Critical
- Domain 2 (Budget-Plan Alignment): Critical
- Domain 3 (Cost Visibility): High
- Domain 4 (External Spend): Medium
- Domain 5 (Review Cadence): High
- Domain 6 (Cost Leakage): Medium
- Domain 7 (Financial Escalation): High
- Domain 8 (Finance-TA Partnership): Medium
- Domain 9 (Compliance): Low

### Block 4 Overall Zone Calculation:

**Green Zone:** 
- Average score ≥ 2.3 
- AND no Red in Domains 1, 2, 5, or 7 (critical domains)
- AND Budget-Plan alignment confirmed

**Yellow Zone:**
- Average score 1.3–2.29
- OR 1–2 Red domains in non-critical areas
- OR Budget exists but poorly structured

**Red Zone:**
- Average score < 1.3
- OR 3+ Red domains
- OR Red in Domain 1 (no budget ownership)
- OR Red in Domain 2 (no budget-plan alignment)
- OR Red in both Domain 5 and 7 (no oversight + no escalation)

---

## Cross-Validation Flags (Auto-Generated)

### With Block 1 (Executive Ownership):
- If Block 1 claims "hiring is a business priority" but Block 4 shows "no TA budget exists" → **Strategic Disconnect Flag**
- If Block 1 claims "financial awareness of hiring delays" but Block 4 shows "vacancy cost not calculated" → **Financial Awareness Illusion**

### With Block 2 (TA Leadership):
- If Block 2 claims "TA budget is governed" but Block 4 shows "no budget owner" → **Governance Theatre Flag**
- If Block 2 claims "capacity model exists" but Block 4 shows "no budget-plan alignment" → **Unfunded Capacity Flag**
- If Block 2 reports "agency use" but Block 4 shows "no vendor governance" → **Uncontrolled Spend Flag**

### With Block 6 (Recruitment Operations):
- If Block 6 reports "ATS is source of truth" but Block 4 shows "cannot calculate cost-per-hire" → **Data-Finance Disconnect**
- If Block 6 reports "operational overload" but Block 4 shows "budget fixed regardless of demand" → **Unfunded Mandate Flag**

### Internal Block 4 Contradictions:
- If Q9 claims "full visibility" but Q10 shows "cannot calculate cost-per-hire" → **Visibility Illusion**
- If Q17 claims "monthly reviews" but Q21 shows "cost overruns not tracked" → **Review Theatre**
- If Q28 claims "strategic partnership" but Q29 shows "Finance doesn't understand TA cost drivers" → **Partnership Illusion**

---

## Primary Signals Generated

- Budget Ownership Signal
- Budget-Plan Alignment Signal
- Cost Transparency Signal
- Vendor Governance Signal
- Financial Oversight Signal
- Cost Efficiency Signal
- Finance Partnership Signal

---

## Global Rules

- Block 4 RED forces Block 2 and Block 6 ≤ Yellow
- Budget-plan contradiction with Block 1 triggers **Financial Governance Failure Flag**
- If Block 4 = RED → Hiring efficiency metrics cannot be trusted regardless of operational performance

---

## Usage in Final Report

- Financial Risk Heatmap
- Cost Governance Findings
- Budget-Execution Gap Analysis
- TA Investment Efficiency Assessment
- Recommendations for Financial Governance Improvement
