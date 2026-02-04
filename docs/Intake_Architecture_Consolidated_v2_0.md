# Intake Architecture — Consolidated v2.0

## Purpose

This document defines the complete intake architecture for the Hiring Execution & Talent Efficiency Audit. It includes:
1. Company configuration intake (determines audit scope)
2. Role-based form assignments (who answers what)
3. Question routing logic (which blocks activate based on context)

---

## Part 1: Company Configuration Intake

This form is completed by the **audit buyer** (typically HR/TA leadership or C-level) before audit begins.

### Section A: Company Identity

**A1. Company type**
- IT Product Company
- IT Services / Outsourcing
- Recruitment Agency / RPO
- Non-IT Company
- Mixed / Hybrid

**A2. Primary business model**
- SaaS / Subscription
- Professional Services
- Mixed (product + services)
- Other

**A3. Industry focus**
- Technology
- Financial Services
- Healthcare
- Manufacturing
- Retail / E-commerce
- Other: [specify]

**A4. Primary hiring geography**
- Single country
- Regional (multiple countries, same region)
- Global

**A5. Company size (total headcount)**
- 1-50 employees
- 51-200 employees
- 201-500 employees
- 501-1000 employees
- 1001-5000 employees
- 5000+ employees

---

### Section B: Hiring Scale & Pattern

**B1. Average monthly hiring volume (new hires)**
- 1-5 per month
- 6-15 per month
- 16-30 per month
- 31-50 per month
- 50+ per month

**B2. Typical hiring pattern**
- Mostly planned (>70% from annual plan)
- Mixed (40-70% planned)
- Mostly reactive (<40% planned)

**B3. Dominant seniority level hired**
- Junior (0-2 years experience)
- Mid-level (3-5 years)
- Senior (5-10 years)
- Executive / Leadership
- Mixed across levels

**B4. Percentage of urgent/unplanned hires**
- <10%
- 10-25%
- 26-50%
- >50%

---

### Section C: Talent Acquisition Function

**C1. Is there a dedicated TA function?**
- Yes, dedicated TA department
- Partial (some dedicated, some shared)
- No, HR handles recruitment
- External only (RPO/agencies)

**C2. Number of recruiters (internal)**
- 0 (no internal recruiters)
- 1-3
- 4-10
- 11-25
- 25+

**C3. Number of sourcers (if separate)**
- 0 / Not separate
- 1-3
- 4-10
- 10+

**C4. Use of external agencies**
- Never
- Sometimes (<20% of hires)
- Often (20-50% of hires)
- Heavily (>50% of hires)

---

### Section D: Hiring Stakeholders

**D1. Roles directly involved in hiring decisions** (multi-select)
- [ ] Recruiter(s)
- [ ] Sourcer(s)
- [ ] Hiring Manager(s)
- [ ] Technical Interviewer(s)
- [ ] Team Lead(s)
- [ ] Department Head(s)
- [ ] Delivery Manager / CDO
- [ ] HR / HRBP
- [ ] CEO / Founder
- [ ] External Agencies

**D2. Is there a dedicated Delivery/Engineering leadership layer involved in hiring?**
- Yes, formally involved
- Partially / depends on role
- No, Hiring Managers decide directly

**D3. Who typically makes final hiring decisions?**
- Hiring Manager alone
- Hiring Manager + HR/TA approval
- Panel/Committee
- Department Head
- CEO/Founder (for all roles)
- Varies by level

---

### Section E: Enabling Functions

**E1. Which functions influence hiring execution?** (multi-select)
- [ ] Compensation & Benefits
- [ ] Marketing / Employer Branding
- [ ] Finance (budget approvals)
- [ ] Legal / Compliance
- [ ] Procurement / Vendor Management
- [ ] IT / Security
- [ ] None specifically

---

### Section F: Audit Configuration

**F1. Desired audit depth**
- Lite (diagnostic only, ~50 questions)
- Standard (full diagnostic, ~100 questions)
- Premium (full diagnostic + deep dive, ~150 questions + interviews)

**F2. Functions to include in audit**
- [ ] Talent Acquisition
- [ ] Delivery / Engineering
- [ ] Finance
- [ ] All of the above

**F3. Preferred output format**
- PDF Report only
- PDF + Executive Presentation
- PDF + Consultation Session

**F4. Timeline preference**
- Standard (2-3 weeks)
- Expedited (1 week)
- Flexible

---

## Part 2: Role-to-Block Mapping

Based on intake responses, the system assigns forms to specific roles.

### Role Assignment Matrix

| Role | Primary Blocks | Conditional |
|------|---------------|-------------|
| CEO / COO / Founder | Block 1 | Always if company >50 |
| CFO / Finance Director | Block 4 | If F2 includes Finance |
| VP/Head of TA | Blocks 2, 7 | Always if TA function exists |
| TA Operations Lead | Block 6 | If role exists |
| Head of Delivery / CDO | Block 3 | If D2 = Yes |
| Engineering Director | Block 5 | If IT company or IT hiring >30% |
| CHRO / HR Director | Block 1 (partial), Block 2 (validation) | If no dedicated TA |

### Small Company Adjustments (<50 employees)

| Standard Role | Likely Combined With | Adjusted Assignment |
|---------------|---------------------|---------------------|
| CEO | All executive functions | Block 1 + Block 4 (partial) |
| Founder/HR Lead | TA + HR | Block 2 + Block 6 |
| Tech Lead | Delivery + Interviewing | Block 3 + Block 5 |

### Role Isolation Rules

- Each role receives a separate, unique form link
- No role can see questions intended for other roles
- No role can see other roles' responses
- Timestamps are tracked for sequence analysis

---

## Part 3: Block Activation Logic

Not all blocks are activated for every audit. Activation depends on intake.

### Always Active
- Block 6 (Recruitment Operations) — always
- Block 7 (Reporting, Data, AI) — always

### Conditionally Active

| Block | Activation Condition |
|-------|---------------------|
| Block 1 | Company >50 OR revenue >$5M |
| Block 2 | TA function exists (C1 ≠ "No") |
| Block 3 | D2 = "Yes" OR D2 = "Partial" |
| Block 4 | F2 includes Finance OR company >200 |
| Block 5 | IT company OR IT hiring >30% OR D1 includes "Technical Interviewer" |

### Lite Tier Reductions

For Lite audits (F1 = Lite):
- Use Matrix Canon questions only (8 per block)
- Skip Domain-level detailed questions
- Total: ~56 questions across 7 blocks

### Premium Tier Additions

For Premium audits (F1 = Premium):
- Full Blueprint questions (all domains)
- Additional open-ended clarification questions
- Follow-up interview scheduling
- Total: ~150 questions + interview slots

---

## Part 4: Question Conditional Logic

Within each block, some questions may be skipped based on context.

### Block 2 Conditionals

| If... | Then skip... |
|-------|--------------|
| C3 = 0 (no sourcers) | Q24-Q27 (sourcer capacity) |
| B1 < 6/month | Q21-Q23 (volume-based capacity) |

### Block 4 Conditionals

| If... | Then skip... |
|-------|--------------|
| C4 = Never (no agencies) | Q13-Q15 (vendor governance) |
| A5 < 50 | Reduce formality expectations in scoring |

### Block 5 Conditionals

| If... | Then skip... |
|-------|--------------|
| A1 ≠ IT | Reduce technical depth, focus on process |
| No technical interviewers (D1) | Skip Q4-Q6 (evaluation framework details) |

### Block 7 Conditionals

| If... | Then skip... |
|-------|--------------|
| Q15 = "No AI" | Skip Q16-Q24 (AI governance) |
| A4 = Single country + non-EU | Reduce GDPR emphasis |

---

## Part 5: Form Technical Specifications

### Form Structure per Role

Each form should include:

1. **Introduction section**
   - Audit purpose explanation
   - Confidentiality statement
   - Time estimate
   - Instructions

2. **Context questions** (2-3)
   - Role confirmation
   - Tenure in role
   - Direct reports count

3. **Block questions**
   - Presented by domain
   - Dropdown/multi-select format
   - "Not relevant" option where appropriate

4. **Completion section**
   - Optional comments field
   - Submission confirmation

### Question Format Standards

**Dropdown (single select):**
```
Question text here?
○ Option A
○ Option B
○ Option C
○ Not relevant / Don't know
```

**Multi-select:**
```
Question text here? (Select all that apply)
☐ Option A
☐ Option B
☐ Option C
☐ None of the above
```

### "Not Relevant" Handling

- "Not relevant" is a valid response in some contexts
- Multiple "Not relevant" answers from same role = flag for review
- "Not relevant" in critical questions = treated as Yellow signal
- For small companies: "Not relevant" tolerance is higher

---

## Part 6: Intake-to-Report Flow

```
┌──────────────────┐
│  Configuration   │
│     Intake       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Role Assignment │
│    & Routing     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Form Links     │
│   Generated      │
└────────┬─────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ CEO   │ │  TA   │ │Finance│ │Delivery│
│ Form  │ │ Form  │ │ Form  │ │ Form  │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │        │        │
    └────┬────┴────────┴────────┘
         │
         ▼
┌──────────────────┐
│  Data Collection │
│   (Airtable/     │
│   Google Sheets) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Scoring Engine  │
│  (Automated)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Cross-Validation │
│   (Automated)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Report Generation│
│   (PDF/DOCX)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Delivery      │
│  (Email/Portal)  │
└──────────────────┘
```

---

## Part 7: Respondent Instructions Template

### Email to Respondents

```
Subject: Hiring Audit - Your Input Required [{Company Name}]

Dear {Respondent Name},

You have been identified as a key respondent for the Hiring Execution & 
Talent Efficiency Audit for {Company Name}.

Your role: {Role Title}
Estimated time: {15-30} minutes
Deadline: {Date}

IMPORTANT:
- Your responses are confidential and will not be attributed individually
- Please answer based on actual practice, not aspirational goals
- If a question doesn't apply to your context, select "Not relevant"
- Complete the form in one session if possible

Your unique form link: {Unique URL}

This link is specific to you. Please do not share it with others.

Questions? Contact {Audit Admin Email}

Thank you for your participation.
```

### Form Introduction Text

```
HIRING EXECUTION & TALENT EFFICIENCY AUDIT
Confidential Respondent Form

Purpose: This audit evaluates hiring effectiveness as a business system, 
not individual performance. Your honest input helps identify systemic 
improvements.

Instructions:
1. Answer based on what actually happens, not what should happen
2. Select the option that best matches current reality
3. "Not relevant" is a valid answer when appropriate
4. Your responses are analyzed in aggregate with other roles
5. Contradictions between roles are expected and informative

Time required: Approximately {X} minutes

Your responses will be kept confidential. Individual attribution will 
not appear in the final report.

[Begin Assessment →]
```

---

## Part 8: Data Collection Schema

### Master Response Table Structure

| Field | Type | Description |
|-------|------|-------------|
| audit_id | string | Unique audit identifier |
| company_name | string | From configuration intake |
| respondent_id | string | Unique per respondent |
| role | enum | CEO/CFO/TA/Delivery/etc. |
| block | enum | Block 1-7 |
| question_id | string | e.g., "B2_Q15" |
| response_value | string/array | Selected option(s) |
| response_score | integer | 0-3 mapped score |
| timestamp | datetime | When answered |
| completion_status | enum | partial/complete |

---

## Part 9: Validation Rules

### Completeness Checks

Before scoring, validate:

1. **All required roles responded**
   - Block 1: Executive role required if company >50
   - Block 2: TA role required if TA function exists
   - Block 4: Finance role required if included in scope

2. **Minimum completion threshold**
   - Each form: >80% questions answered
   - "Not relevant" cannot exceed 30% of answers per form

3. **Response consistency**
   - Same respondent: no contradictory answers within form
   - Timestamp gaps: flag if >24h between start and completion

### Red Flags for Manual Review

- All answers are "perfect" (3s) — suspicious consistency
- Completion time <5 minutes for full form — likely not thoughtful
- Multiple "Not relevant" for clearly relevant questions
- Identical answers from different roles — possible coordination

---

## Part 10: Privacy & Compliance

### Data Handling

- Responses stored for audit duration + 90 days
- No long-term retention without explicit consent
- Individual responses not shared with employer
- Only aggregate findings in report

### GDPR Considerations

- Consent obtained before form access
- Right to withdraw (removes their data from analysis)
- Data processing agreement with audit buyer
- No sensitive personal data collected

### Anonymization

- Report shows role perspectives, not names
- Contradictions described by role, not person
- Quotes (if any) are anonymized

---

## Appendix: Question Count Summary by Tier

| Block | Lite (Matrix Canon) | Standard | Premium |
|-------|---------------------|----------|---------|
| Block 1 | 8 | 12 | 12 + interview |
| Block 2 | 8 | 42 | 42 + interview |
| Block 3 | 8 | 20 | 20 + interview |
| Block 4 | 8 | 34 | 34 + interview |
| Block 5 | 8 | 12 | 12 + interview |
| Block 6 | 8 | 11 | 11 + interview |
| Block 7 | 8 | 33 | 33 + interview |
| **Total** | **56** | **~164** | **~164 + 7 interviews** |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | Initial | Basic intake structure |
| v1.1 | Update | Added configuration logic |
| v2.0 | Consolidated | Full role mapping, conditional logic, data schema, privacy section |
