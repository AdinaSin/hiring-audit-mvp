# Hiring Audit Automation Specification
## n8n / Make.com Workflow Design v1.0

---

## Overview

This document specifies the complete automation workflow for the Hiring Execution & Talent Efficiency Audit. The workflow handles:
1. Form submission ingestion
2. Response validation
3. Scoring calculation
4. Cross-validation contradiction detection
5. Recommendation selection
6. PDF report generation
7. Delivery to client

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUDIT AUTOMATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Tally/Typeform]  ──webhook──►  [n8n/Make]  ──►  [Airtable/Sheets]         │
│       Forms                       Processor        Data Store                │
│                                      │                                       │
│                                      ▼                                       │
│                              ┌───────────────┐                               │
│                              │ Scoring Engine │                              │
│                              └───────────────┘                               │
│                                      │                                       │
│                                      ▼                                       │
│                              ┌───────────────┐                               │
│                              │Cross-Validator│                               │
│                              └───────────────┘                               │
│                                      │                                       │
│                                      ▼                                       │
│                              ┌───────────────┐                               │
│                              │ Recommendation│                               │
│                              │   Selector    │                               │
│                              └───────────────┘                               │
│                                      │                                       │
│                                      ▼                                       │
│                              ┌───────────────┐                               │
│                              │ PDF Generator │──►  [Cloud Storage]          │
│                              └───────────────┘          │                    │
│                                                         ▼                    │
│                                                   [Email/Slack]              │
│                                                     Delivery                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Workflow Triggers

### Trigger 1: Form Submission (per block)
- **Source:** Tally.so / Typeform webhook
- **Event:** Form submission completed
- **Data:** Form responses JSON

### Trigger 2: Audit Completion Check
- **Source:** Scheduled (every 15 min) or webhook
- **Event:** All required blocks submitted for an audit_id
- **Action:** Initiate scoring pipeline

### Trigger 3: Manual Trigger
- **Source:** Admin action
- **Event:** Force re-score or regenerate report
- **Data:** audit_id

---

## Data Schema

### Audit Record (Airtable/Sheets)
```json
{
  "audit_id": "AUD-2025-001",
  "company_name": "TechCorp Inc.",
  "company_size": "201-500",
  "company_type": "IT Product",
  "audit_tier": "standard",
  "buyer_email": "buyer@company.com",
  "created_at": "2025-02-03T10:00:00Z",
  "status": "in_progress",
  "blocks_completed": ["config", "block1", "block2"],
  "blocks_pending": ["block3", "block4", "block5", "block6", "block7"],
  "scoring_status": "pending",
  "report_url": null
}
```

### Response Record (per block submission)
```json
{
  "response_id": "RES-001",
  "audit_id": "AUD-2025-001",
  "block_id": "block1",
  "respondent_email": "ceo@company.com",
  "respondent_role": "CEO",
  "submitted_at": "2025-02-03T11:00:00Z",
  "responses": {
    "b1_q1": 3,
    "b1_q2": 2,
    "b1_q3": 1,
    "b1_q4": 2,
    "b1_q5": 2,
    "b1_q6": 1,
    "b1_q7": 2,
    "b1_q8": 3
  },
  "raw_answers": {
    "b1_q1": "Yes, part of annual plan",
    "b1_q2": "Partially aligned"
  }
}
```

### Scoring Result Record
```json
{
  "scoring_id": "SCR-001",
  "audit_id": "AUD-2025-001",
  "calculated_at": "2025-02-03T12:00:00Z",
  "block_statuses": {
    "block1": "yellow",
    "block2": "yellow",
    "block3": "red",
    "block4": "yellow",
    "block5": "yellow",
    "block6": "red",
    "block7": "yellow"
  },
  "block_scores": {
    "block1": 2.0,
    "block2": 1.8,
    "block3": 1.2,
    "block4": 1.9,
    "block5": 1.7,
    "block6": 1.1,
    "block7": 1.6
  },
  "overall_status": "red",
  "confidence_score": 58,
  "gate_failures": ["Block 3 RED: Interview Bottleneck", "Block 6 RED: Operational Fragility"],
  "contradictions": ["CV-05", "CV-08"],
  "flags": ["Interview Bottleneck Masked", "Key-Person Failure"],
  "data_trust_coefficient": 0.85
}
```

---

## n8n Workflow Nodes

### Workflow 1: Form Submission Handler

```yaml
name: "Audit Form Submission Handler"
trigger:
  type: webhook
  path: /audit/submit
  method: POST

nodes:
  - name: "Parse Webhook"
    type: "Set"
    parameters:
      values:
        audit_id: "={{ $json.hidden.audit_id }}"
        block_id: "={{ $json.hidden.block_id }}"
        respondent_email: "={{ $json.respondent_email }}"
        responses: "={{ $json.responses }}"

  - name: "Transform Responses"
    type: "Code"
    parameters:
      jsCode: |
        // Map form answers to scores
        const scoreMap = {
          // Block 1 mappings
          "Yes, part of annual plan": 3,
          "Partially (high-level targets)": 2,
          "No, planned reactively": 1,
          "No formal planning exists": 0,
          "Not relevant": -1,
          // ... more mappings
        };
        
        const responses = $input.all()[0].json.responses;
        const scored = {};
        
        for (const [questionId, answer] of Object.entries(responses)) {
          if (typeof answer === 'number') {
            scored[questionId] = answer;
          } else {
            scored[questionId] = scoreMap[answer] ?? 0;
          }
        }
        
        return [{ json: { ...items[0].json, scored_responses: scored } }];

  - name: "Save to Airtable"
    type: "Airtable"
    parameters:
      operation: "create"
      table: "Responses"
      fields:
        audit_id: "={{ $json.audit_id }}"
        block_id: "={{ $json.block_id }}"
        respondent_email: "={{ $json.respondent_email }}"
        responses: "={{ JSON.stringify($json.scored_responses) }}"
        submitted_at: "={{ $now.toISO() }}"

  - name: "Update Audit Status"
    type: "Airtable"
    parameters:
      operation: "update"
      table: "Audits"
      filters:
        audit_id: "={{ $json.audit_id }}"
      fields:
        blocks_completed: "={{ $json.blocks_completed.concat([$json.block_id]) }}"

  - name: "Check Completion"
    type: "IF"
    parameters:
      conditions:
        - value1: "={{ $json.blocks_completed.length }}"
          operation: "equal"
          value2: 8  # config + 7 blocks

  - name: "Trigger Scoring"
    type: "HTTP Request"
    parameters:
      method: "POST"
      url: "={{ $env.SCORING_WEBHOOK_URL }}"
      body:
        audit_id: "={{ $json.audit_id }}"
```

### Workflow 2: Scoring Engine

```yaml
name: "Audit Scoring Engine"
trigger:
  type: webhook
  path: /audit/score
  method: POST

nodes:
  - name: "Fetch All Responses"
    type: "Airtable"
    parameters:
      operation: "list"
      table: "Responses"
      filters:
        audit_id: "={{ $json.audit_id }}"

  - name: "Calculate Block Scores"
    type: "Code"
    parameters:
      jsCode: |
        const responses = $input.all();
        const blockScores = {};
        const blockStatuses = {};
        
        // Thresholds
        const GREEN_THRESHOLD = 2.3;
        const RED_THRESHOLD = 1.5;
        
        // Critical questions that force RED if score = 0
        const criticalQuestions = {
          block1: ['b1_q3', 'b1_q4', 'b1_q7'],
          block2: ['b2_q3', 'b2_q5', 'b2_q6'],
          block3: ['b3_q2', 'b3_q3'],
          block4: ['b4_q1', 'b4_q2', 'b4_q4'],
          block5: ['b5_q1', 'b5_q2'],
          block6: ['b6_q5', 'b6_q8'],
          block7: ['b7_q1', 'b7_q2']
        };
        
        for (const response of responses) {
          const blockId = response.json.block_id;
          const scores = JSON.parse(response.json.responses);
          
          // Calculate average (excluding -1 = not relevant)
          const validScores = Object.entries(scores)
            .filter(([k, v]) => v !== -1)
            .map(([k, v]) => v);
          
          if (validScores.length === 0) continue;
          
          const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
          blockScores[blockId] = Math.round(avg * 100) / 100;
          
          // Check for critical RED
          const criticals = criticalQuestions[blockId] || [];
          const hasCriticalRed = criticals.some(q => scores[q] === 0);
          
          // Determine status
          if (hasCriticalRed || avg < RED_THRESHOLD) {
            blockStatuses[blockId] = 'red';
          } else if (avg < GREEN_THRESHOLD) {
            blockStatuses[blockId] = 'yellow';
          } else {
            blockStatuses[blockId] = 'green';
          }
        }
        
        return [{
          json: {
            audit_id: $input.first().json.audit_id,
            block_scores: blockScores,
            block_statuses: blockStatuses
          }
        }];

  - name: "Apply Gate Rules"
    type: "Code"
    parameters:
      jsCode: |
        const data = $input.first().json;
        const statuses = data.block_statuses;
        const gateFailures = [];
        
        // Gate 0: Block 1 RED → Overall RED
        if (statuses.block1 === 'red') {
          gateFailures.push('GATE 0: Executive Ownership failure - Ownerless Hiring');
        }
        
        // Gate 1: Block 2 or 4 RED → Overall RED
        if (statuses.block2 === 'red') {
          gateFailures.push('GATE 1: TA Leadership failure - Ungoverned TA');
        }
        if (statuses.block4 === 'red') {
          gateFailures.push('GATE 1: Financial Governance failure - Financial Opacity');
        }
        
        // Execution gates
        if (statuses.block3 === 'red') {
          gateFailures.push('Execution: Interview Bottleneck');
        }
        if (statuses.block5 === 'red') {
          gateFailures.push('Execution: Evaluation Collapse');
        }
        if (statuses.block6 === 'red') {
          gateFailures.push('Execution: Operational Fragility');
        }
        
        // Calculate overall status
        let overallStatus = 'green';
        if (gateFailures.length > 0) {
          overallStatus = 'red';
        } else {
          const yellowCount = Object.values(statuses).filter(s => s === 'yellow').length;
          if (yellowCount >= 2) {
            overallStatus = 'yellow';
          }
        }
        
        // Data Trust Coefficient (Block 7 impact)
        let dtc = 1.0;
        if (statuses.block7 === 'red') {
          dtc = 0.7;
        } else if (statuses.block7 === 'yellow') {
          dtc = 0.85;
        }
        
        return [{
          json: {
            ...data,
            gate_failures: gateFailures,
            overall_status: overallStatus,
            data_trust_coefficient: dtc
          }
        }];

  - name: "Run Cross-Validation"
    type: "Code"
    parameters:
      jsCode: |
        // Cross-validation rules
        const cvRules = [
          {
            id: 'CV-01',
            name: 'Ownerless Hiring',
            source: { block: 'block1', question: 'b1_q3', condition: '>=2' },
            validator: { block: 'block6', question: 'b6_q2', condition: '<=1' },
            severity: 'force-red'
          },
          {
            id: 'CV-05',
            name: 'SLA Theatre',
            source: { block: 'block2', question: 'b2_q3', condition: '>=2' },
            validator: { block: 'block6', question: 'b6_q5', condition: '<=1' },
            severity: 'force-red'
          },
          {
            id: 'CV-08',
            name: 'Interview Bottleneck Masked',
            source: { block: 'block3', question: 'b3_q2', condition: '>=2' },
            validator: { block: 'block5', question: 'b5_q2', condition: '<=1' },
            severity: 'force-red'
          },
          // Add more rules...
        ];
        
        const data = $input.first().json;
        const allResponses = $node["Fetch All Responses"].json;
        const contradictions = [];
        const flags = [];
        
        // Build response lookup
        const responseLookup = {};
        for (const r of allResponses) {
          responseLookup[r.block_id] = JSON.parse(r.responses);
        }
        
        // Check each rule
        for (const rule of cvRules) {
          const sourceResponses = responseLookup[rule.source.block];
          const validatorResponses = responseLookup[rule.validator.block];
          
          if (!sourceResponses || !validatorResponses) continue;
          
          const sourceValue = sourceResponses[rule.source.question];
          const validatorValue = validatorResponses[rule.validator.question];
          
          // Check contradiction
          const sourceMatch = eval(`${sourceValue} ${rule.source.condition}`);
          const validatorMatch = eval(`${validatorValue} ${rule.validator.condition}`);
          
          if (sourceMatch && validatorMatch) {
            contradictions.push(rule.id);
            flags.push(rule.name);
          }
        }
        
        // Escalate if contradictions found
        let updatedStatus = data.overall_status;
        if (contradictions.some(c => cvRules.find(r => r.id === c)?.severity === 'force-red')) {
          updatedStatus = 'red';
        }
        
        return [{
          json: {
            ...data,
            contradictions,
            flags,
            overall_status: updatedStatus
          }
        }];

  - name: "Calculate Confidence Score"
    type: "Code"
    parameters:
      jsCode: |
        const data = $input.first().json;
        
        // Base score from block statuses
        const scoreMap = { green: 90, yellow: 60, red: 30 };
        const blockScores = Object.values(data.block_statuses)
          .map(s => scoreMap[s] || 50);
        
        let confidence = blockScores.reduce((a, b) => a + b, 0) / blockScores.length;
        
        // Deductions
        confidence -= data.contradictions.length * 3;
        confidence -= data.gate_failures.length * 5;
        
        // Apply DTC
        confidence *= data.data_trust_coefficient;
        
        // Bounds
        confidence = Math.max(0, Math.min(100, Math.round(confidence)));
        
        return [{
          json: {
            ...data,
            confidence_score: confidence
          }
        }];

  - name: "Save Scoring Results"
    type: "Airtable"
    parameters:
      operation: "create"
      table: "Scoring_Results"
      fields:
        audit_id: "={{ $json.audit_id }}"
        block_statuses: "={{ JSON.stringify($json.block_statuses) }}"
        block_scores: "={{ JSON.stringify($json.block_scores) }}"
        overall_status: "={{ $json.overall_status }}"
        confidence_score: "={{ $json.confidence_score }}"
        gate_failures: "={{ JSON.stringify($json.gate_failures) }}"
        contradictions: "={{ JSON.stringify($json.contradictions) }}"
        flags: "={{ JSON.stringify($json.flags) }}"
        calculated_at: "={{ $now.toISO() }}"

  - name: "Trigger Recommendation Selection"
    type: "HTTP Request"
    parameters:
      method: "POST"
      url: "={{ $env.RECOMMENDATIONS_WEBHOOK_URL }}"
      body: "={{ $json }}"
```

### Workflow 3: Recommendation Selector

```yaml
name: "Recommendation Selector"
trigger:
  type: webhook
  path: /audit/recommendations
  method: POST

nodes:
  - name: "Load Recommendation Library"
    type: "Code"
    parameters:
      jsCode: |
        // Recommendation library (embedded or fetched from external source)
        const recommendations = {
          'B1-R01': {
            risk_name: 'Ownerless Hiring',
            trigger: { block: 'block1', condition: 'status === "red" || score <= 1.5' },
            quick_wins: [
              { id: 'B1-R01-QW1', text: 'Designate interim hiring owner (CEO/COO) for 90 days', owner: 'CEO', effort: '1 day' },
              { id: 'B1-R01-QW2', text: 'Add hiring status to weekly leadership agenda', owner: 'COO/EA', effort: '2 hours' }
            ],
            structural: [
              { id: 'B1-R01-S1', text: 'Define RACI matrix for hiring decisions', owner: 'HR + Business', effort: '1 week' }
            ]
          },
          'B2-R03': {
            risk_name: 'Capacity Blindness',
            trigger: { block: 'block2', condition: 'status === "red" || status === "yellow"' },
            quick_wins: [
              { id: 'B2-R03-QW1', text: 'Count active roles per recruiter today', owner: 'TA Lead', effort: '2 hours' },
              { id: 'B2-R03-QW2', text: 'Define maximum active load benchmark (8-12 roles)', owner: 'TA Lead', effort: '2 hours' }
            ],
            structural: [
              { id: 'B2-R03-S1', text: 'Build capacity model: roles by complexity × recruiter', owner: 'TA Ops', effort: '2 weeks' }
            ]
          },
          'B3-R01': {
            risk_name: 'Interview Bottleneck',
            trigger: { block: 'block3', condition: 'status === "red"' },
            quick_wins: [
              { id: 'B3-R01-QW1', text: 'Identify top 5 interviewers by volume', owner: 'TA + Delivery', effort: '2 hours' },
              { id: 'B3-R01-QW2', text: 'Block 4 interview slots per week for key interviewers', owner: 'Delivery Lead', effort: '1 day' }
            ],
            structural: [
              { id: 'B3-R01-S1', text: 'Define interviewer pool with capacity commitments', owner: 'Delivery + TA', effort: '2 weeks' }
            ]
          },
          'B6-R03': {
            risk_name: 'Key-Person Failure',
            trigger: { block: 'block6', condition: 'status === "red"' },
            quick_wins: [
              { id: 'B6-R03-QW1', text: 'Identify all roles with single-owner dependency', owner: 'TA Lead', effort: '4 hours' },
              { id: 'B6-R03-QW2', text: 'Assign backup for every critical pipeline', owner: 'TA Lead', effort: '1 day' }
            ],
            structural: [
              { id: 'B6-R03-S1', text: 'Implement buddy system', owner: 'TA Lead', effort: '2 weeks' }
            ]
          },
          'B7-R02': {
            risk_name: 'Shadow AI',
            trigger: { block: 'block7', flags: ['Shadow AI'] },
            quick_wins: [
              { id: 'B7-R02-QW1', text: 'Survey all TA team: What AI tools do you use?', owner: 'TA Lead', effort: '1 day' }
            ],
            structural: [
              { id: 'B7-R02-S1', text: 'Create AI tool inventory and approval process', owner: 'TA + IT + Legal', effort: '2 weeks' }
            ]
          }
        };
        
        return [{ json: { recommendations, ...items[0].json } }];

  - name: "Select Applicable Recommendations"
    type: "Code"
    parameters:
      jsCode: |
        const data = $input.first().json;
        const library = data.recommendations;
        const statuses = data.block_statuses;
        const flags = data.flags || [];
        
        const selectedQuickWins = [];
        const selectedStructural = [];
        
        for (const [riskId, rec] of Object.entries(library)) {
          const trigger = rec.trigger;
          let applies = false;
          
          // Check block status condition
          if (trigger.block && trigger.condition) {
            const status = statuses[trigger.block];
            const score = data.block_scores?.[trigger.block] || 0;
            applies = eval(trigger.condition);
          }
          
          // Check flags
          if (trigger.flags) {
            applies = applies || trigger.flags.some(f => flags.includes(f));
          }
          
          if (applies) {
            selectedQuickWins.push(...rec.quick_wins.map(qw => ({
              ...qw,
              risk_id: riskId,
              risk_name: rec.risk_name
            })));
            selectedStructural.push(...rec.structural.map(s => ({
              ...s,
              risk_id: riskId,
              risk_name: rec.risk_name
            })));
          }
        }
        
        // Prioritize and limit
        const prioritizedQW = selectedQuickWins.slice(0, 7);
        const prioritizedStructural = selectedStructural.slice(0, 5);
        
        return [{
          json: {
            audit_id: data.audit_id,
            block_statuses: data.block_statuses,
            block_scores: data.block_scores,
            overall_status: data.overall_status,
            confidence_score: data.confidence_score,
            gate_failures: data.gate_failures,
            contradictions: data.contradictions,
            flags: data.flags,
            quick_wins: prioritizedQW,
            structural_recommendations: prioritizedStructural
          }
        }];

  - name: "Save Recommendations"
    type: "Airtable"
    parameters:
      operation: "update"
      table: "Scoring_Results"
      filters:
        audit_id: "={{ $json.audit_id }}"
      fields:
        quick_wins: "={{ JSON.stringify($json.quick_wins) }}"
        structural_recommendations: "={{ JSON.stringify($json.structural_recommendations) }}"

  - name: "Trigger PDF Generation"
    type: "HTTP Request"
    parameters:
      method: "POST"
      url: "={{ $env.PDF_GENERATOR_URL }}"
      body: "={{ $json }}"
```

### Workflow 4: PDF Generation & Delivery

```yaml
name: "PDF Generation & Delivery"
trigger:
  type: webhook
  path: /audit/generate-pdf
  method: POST

nodes:
  - name: "Fetch Audit Details"
    type: "Airtable"
    parameters:
      operation: "list"
      table: "Audits"
      filters:
        audit_id: "={{ $json.audit_id }}"

  - name: "Prepare Report Data"
    type: "Code"
    parameters:
      jsCode: |
        const scoring = $input.first().json;
        const audit = $node["Fetch Audit Details"].json[0];
        
        const reportData = {
          company_name: audit.company_name,
          report_date: new Date().toISOString().split('T')[0],
          audit_tier: audit.audit_tier,
          block_statuses: scoring.block_statuses,
          block_scores: scoring.block_scores,
          overall_status: scoring.overall_status,
          confidence_score: scoring.confidence_score,
          gate_failures: scoring.gate_failures,
          contradictions: scoring.contradictions,
          flags: scoring.flags,
          quick_wins: scoring.quick_wins,
          structural_recommendations: scoring.structural_recommendations
        };
        
        // Determine report level based on tier
        const levelMap = { lite: 1, standard: 2, premium: 3 };
        reportData.level = levelMap[audit.audit_tier] || 1;
        
        return [{ json: reportData }];

  - name: "Call PDF Generator API"
    type: "HTTP Request"
    parameters:
      method: "POST"
      url: "={{ $env.PDF_API_URL }}/generate"
      headers:
        Content-Type: "application/json"
      body: "={{ $json }}"
      responseFormat: "file"

  - name: "Upload to Cloud Storage"
    type: "Google Drive"  # or S3, Dropbox, etc.
    parameters:
      operation: "upload"
      name: "={{ 'Hiring_Audit_' + $json.audit_id + '_' + $json.report_date + '.pdf' }}"
      parentFolder: "Audit Reports"
      binaryProperty: "data"

  - name: "Update Audit Record"
    type: "Airtable"
    parameters:
      operation: "update"
      table: "Audits"
      filters:
        audit_id: "={{ $json.audit_id }}"
      fields:
        status: "completed"
        report_url: "={{ $json.webViewLink }}"
        completed_at: "={{ $now.toISO() }}"

  - name: "Send Email Notification"
    type: "Send Email"
    parameters:
      to: "={{ $node['Fetch Audit Details'].json[0].buyer_email }}"
      subject: "Your Hiring Execution Audit Report is Ready"
      text: |
        Dear {{ $node['Fetch Audit Details'].json[0].company_name }},
        
        Your Hiring Execution & Talent Efficiency Audit report is now ready.
        
        Overall Status: {{ $json.overall_status.toUpperCase() }}
        Confidence Score: {{ $json.confidence_score }}/100
        
        Download your report here:
        {{ $json.webViewLink }}
        
        Key Findings:
        {{ $json.gate_failures.length > 0 ? '⚠️ ' + $json.gate_failures.join('\n⚠️ ') : '✓ No critical gate failures detected' }}
        
        This report is valid for 90 days. For questions or to discuss recommendations, 
        please contact us.
        
        Best regards,
        Hiring Audit Team
```

---

## Make.com Equivalent Modules

For Make.com, the equivalent modules would be:

| n8n Node | Make.com Module |
|----------|-----------------|
| Webhook | Webhooks > Custom Webhook |
| Code (JS) | Tools > Set Variable + JSON |
| Airtable | Airtable > Create/Update/Search Records |
| HTTP Request | HTTP > Make a Request |
| Send Email | Email > Send an Email |
| Google Drive | Google Drive > Upload a File |
| IF | Router + Filters |

---

## Environment Variables

```env
# Webhooks
FORM_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/audit/submit
SCORING_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/audit/score
RECOMMENDATIONS_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/audit/recommendations
PDF_GENERATOR_URL=https://your-pdf-api.com

# Data Storage
AIRTABLE_API_KEY=your_airtable_key
AIRTABLE_BASE_ID=your_base_id

# Cloud Storage
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key
FROM_EMAIL=audit@yourdomain.com
```

---

## Airtable Schema

### Table: Audits
| Field | Type | Notes |
|-------|------|-------|
| audit_id | Text (Primary) | Auto-generated |
| company_name | Text | |
| company_size | Single Select | Options from config |
| company_type | Single Select | |
| audit_tier | Single Select | lite/standard/premium |
| buyer_email | Email | |
| status | Single Select | pending/in_progress/completed |
| blocks_completed | Multiple Select | |
| report_url | URL | |
| created_at | DateTime | |
| completed_at | DateTime | |

### Table: Responses
| Field | Type | Notes |
|-------|------|-------|
| response_id | Text (Primary) | |
| audit_id | Link to Audits | |
| block_id | Single Select | config, block1-7 |
| respondent_email | Email | |
| respondent_role | Text | |
| responses | Long Text | JSON string |
| submitted_at | DateTime | |

### Table: Scoring_Results
| Field | Type | Notes |
|-------|------|-------|
| scoring_id | Text (Primary) | |
| audit_id | Link to Audits | |
| block_statuses | Long Text | JSON |
| block_scores | Long Text | JSON |
| overall_status | Single Select | green/yellow/red |
| confidence_score | Number | 0-100 |
| gate_failures | Long Text | JSON array |
| contradictions | Long Text | JSON array |
| flags | Long Text | JSON array |
| quick_wins | Long Text | JSON |
| structural_recommendations | Long Text | JSON |
| calculated_at | DateTime | |

---

## Testing Checklist

- [ ] Form webhook receives data correctly
- [ ] Response transformation produces valid scores
- [ ] Block status calculation matches manual calculation
- [ ] Gate rules apply correctly
- [ ] Cross-validation detects known contradictions
- [ ] Confidence score in valid range (0-100)
- [ ] Recommendations selected match risks
- [ ] PDF generates without errors
- [ ] Email delivers to correct recipient
- [ ] Report URL is accessible

---

## Error Handling

1. **Missing responses:** If a block is missing, exclude from scoring but flag as "Incomplete Audit"
2. **Invalid scores:** Default to 0 if score cannot be parsed
3. **PDF generation failure:** Retry 3 times, then notify admin
4. **Email failure:** Queue for retry, log error
5. **Webhook timeout:** Return 202 Accepted, process async

---

## Monitoring & Alerts

Set up alerts for:
- Form submission failure rate > 5%
- Scoring calculation errors
- PDF generation failures
- Email delivery failures
- Audit completion rate < 80% (forms started but not finished)

---

*Version 1.0 — Automation Specification*
