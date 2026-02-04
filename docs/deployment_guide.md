# Hiring Execution & Talent Efficiency Audit
## Deployment Guide v1.0

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Prerequisites](#3-prerequisites)
4. [Deployment Options](#4-deployment-options)
5. [Quick Start (5 minutes)](#5-quick-start)
6. [Full Production Setup](#6-full-production-setup)
7. [Configuration Reference](#7-configuration-reference)
8. [Testing & Validation](#8-testing--validation)
9. [Troubleshooting](#9-troubleshooting)
10. [Maintenance](#10-maintenance)

---

## 1. System Overview

### What This System Does

The Hiring Audit system is an automated diagnostic tool that:
- Collects structured responses from multiple organizational roles
- Calculates block-level and overall hiring health scores
- Detects cross-functional contradictions
- Generates prioritized recommendations
- Produces professional PDF reports

### Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Intake Forms** | Data collection | HTML/Tally/Typeform |
| **Scoring Engine** | Score calculation | JavaScript/Python |
| **Cross-Validator** | Contradiction detection | JavaScript/Python |
| **Recommendation Selector** | Fix prioritization | JavaScript/Python |
| **PDF Generator** | Report creation | Python/ReportLab |
| **Orchestrator** | Workflow automation | n8n/Make.com |
| **Data Store** | Response storage | Airtable/Sheets |

### Data Flow

```
[Client] → [Form] → [Webhook] → [Orchestrator] → [Scoring] → [PDF] → [Email]
                                      ↓
                                 [Data Store]
```

---

## 2. Architecture

### Minimal Architecture (MVP)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Tally.so  │────▶│   Zapier    │────▶│Google Sheets│
│    Forms    │     │  (webhook)  │     │  (storage)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Manual    │
                    │  Scoring +  │
                    │    PDF      │
                    └─────────────┘
```

### Standard Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Tally.so  │────▶│    n8n      │────▶│  Airtable   │
│    Forms    │     │ (workflow)  │     │  (storage)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Scoring    │────▶│    PDF      │
                    │   Engine    │     │  Generator  │
                    └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Email /   │
                                        │   Storage   │
                                        └─────────────┘
```

### Enterprise Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Custom     │────▶│   API       │────▶│  PostgreSQL │
│  Frontend   │     │  Backend    │     │  Database   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Scoring  │ │  Cross   │ │   Rec    │
        │ Service  │ │ Validate │ │ Selector │
        └──────────┘ └──────────┘ └──────────┘
              │            │            │
              └────────────┼────────────┘
                           ▼
                    ┌─────────────┐
                    │    PDF      │
                    │   Service   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Email   │ │   S3     │ │  Slack   │
        │  (SES)   │ │ Storage  │ │  Notify  │
        └──────────┘ └──────────┘ └──────────┘
```

---

## 3. Prerequisites

### Minimum Requirements

- [ ] Domain for hosting (optional for MVP)
- [ ] Email account for notifications
- [ ] One of: Tally.so, Typeform, or Google Forms account
- [ ] One of: Google Sheets, Airtable, or Notion account

### Recommended Requirements

- [ ] n8n Cloud or self-hosted instance
- [ ] Python 3.10+ environment for PDF generation
- [ ] Cloud storage (Google Drive, S3, Dropbox)
- [ ] SMTP service (SendGrid, Mailgun, SES)

### Enterprise Requirements

- [ ] Kubernetes cluster or cloud hosting
- [ ] PostgreSQL database
- [ ] Redis for caching
- [ ] CI/CD pipeline
- [ ] Monitoring (Datadog, NewRelic)

---

## 4. Deployment Options

### Option A: No-Code (Fastest)

**Time:** 30 minutes  
**Cost:** $0-50/month  
**Best for:** Testing, small volume

| Component | Tool | Setup |
|-----------|------|-------|
| Forms | Tally.so (free) | Import questions |
| Storage | Google Sheets | Create from template |
| Automation | Zapier (free tier) | Connect form → sheet |
| Scoring | Manual | Use spreadsheet formulas |
| PDF | Manual | Use template |

### Option B: Low-Code (Recommended)

**Time:** 2-4 hours  
**Cost:** $50-150/month  
**Best for:** Production use, medium volume

| Component | Tool | Setup |
|-----------|------|-------|
| Forms | Tally.so Pro | Import questions |
| Storage | Airtable | Create from schema |
| Automation | n8n Cloud | Import workflow |
| Scoring | n8n Code node | Use scoring_engine.js |
| PDF | Python API | Deploy generator |

### Option C: Full Custom (Enterprise)

**Time:** 1-2 weeks  
**Cost:** $500+/month  
**Best for:** High volume, customization needs

| Component | Tool | Setup |
|-----------|------|-------|
| Forms | Custom React app | Deploy frontend |
| Storage | PostgreSQL | Migrate schema |
| Automation | Custom Node.js | Deploy backend |
| Scoring | Microservice | Containerize |
| PDF | Microservice | Containerize |

---

## 5. Quick Start

### 5-Minute Setup (Option A)

#### Step 1: Create Form

1. Go to [tally.so](https://tally.so)
2. Create new form
3. Copy questions from `form_specifications/all_blocks_questions_csv.csv`
4. Set up hidden fields: `audit_id`, `block_id`

#### Step 2: Create Storage

1. Go to Google Sheets
2. Create new spreadsheet
3. Add columns:
   ```
   audit_id | block_id | timestamp | b1_q1 | b1_q2 | ... | b7_q4
   ```

#### Step 3: Connect Form to Storage

1. In Tally: Settings → Integrations → Google Sheets
2. Connect your spreadsheet
3. Map form fields to columns

#### Step 4: Test

1. Submit test form
2. Verify data appears in spreadsheet
3. Use scoring formulas (see Section 7)

---

## 6. Full Production Setup

### 6.1 Forms Setup (Tally.so)

#### Create Config Form

```yaml
Form: Audit Configuration
Hidden Fields:
  - audit_id: {{uuid}}
  - form_type: config

Questions:
  1. Company name (text)
  2. Company size (dropdown): <50, 51-200, 201-500, 501-1000, 1000+
  3. Company type (dropdown): IT Product, IT Services, Agency, Non-IT
  4. Audit tier (dropdown): lite, standard, premium
  5. Buyer email (email)
```

#### Create Block Forms (1-7)

For each block, create a form with:
- Hidden fields: `audit_id`, `block_id`
- Questions from CSV specification
- Scoring values in hidden fields

#### Webhook Configuration

```yaml
Tally Webhook Settings:
  URL: https://your-n8n.com/webhook/audit/submit
  Method: POST
  Headers:
    Content-Type: application/json
    X-API-Key: {{your_api_key}}
```

### 6.2 Airtable Setup

#### Create Base

1. Create new Airtable base: "Hiring Audit"
2. Create tables:

**Table: Audits**
```
| Field | Type | Notes |
|-------|------|-------|
| audit_id | Text (Primary) | Auto-generated UUID |
| company_name | Text | |
| company_size | Single Select | |
| company_type | Single Select | |
| audit_tier | Single Select | lite/standard/premium |
| buyer_email | Email | |
| status | Single Select | pending/in_progress/scoring/completed |
| blocks_completed | Multiple Select | config, block1-7 |
| created_at | DateTime | Auto |
| completed_at | DateTime | |
| report_url | URL | |
```

**Table: Responses**
```
| Field | Type | Notes |
|-------|------|-------|
| response_id | Text (Primary) | |
| audit_id | Link to Audits | |
| block_id | Single Select | |
| respondent_email | Email | |
| responses | Long Text | JSON |
| submitted_at | DateTime | |
```

**Table: Results**
```
| Field | Type | Notes |
|-------|------|-------|
| result_id | Text (Primary) | |
| audit_id | Link to Audits | |
| block_statuses | Long Text | JSON |
| block_scores | Long Text | JSON |
| overall_status | Single Select | green/yellow/red |
| confidence_score | Number | 0-100 |
| gate_failures | Long Text | JSON |
| contradictions | Long Text | JSON |
| recommendations | Long Text | JSON |
| calculated_at | DateTime | |
```

### 6.3 n8n Setup

#### Install n8n

**Option 1: n8n Cloud**
```
1. Sign up at https://n8n.io
2. Create new instance
3. Note webhook URL
```

**Option 2: Self-Hosted (Docker)**
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your_password \
  n8nio/n8n
```

**Option 3: Self-Hosted (npm)**
```bash
npm install n8n -g
n8n start
```

#### Import Workflows

1. Go to n8n dashboard
2. Import `n8n_workflow_scoring_engine.json`
3. Configure credentials:
   - Airtable API key
   - Email SMTP settings
   - Cloud storage credentials

#### Configure Environment Variables

```bash
# n8n Environment
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base_id
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key
FROM_EMAIL=audit@yourdomain.com
PDF_API_URL=https://your-pdf-api.com
STORAGE_BUCKET=your-bucket
```

### 6.4 PDF Generator Setup

#### Deploy as Cloud Function (Recommended)

**Google Cloud Functions:**

```bash
# Create requirements.txt
cat > requirements.txt << EOF
reportlab==4.0.4
functions-framework==3.*
EOF

# Create main.py
cat > main.py << 'EOF'
import functions_framework
from audit_report_generator import HiringAuditReportGenerator
import json
import base64

@functions_framework.http
def generate_report(request):
    data = request.get_json()
    
    generator = HiringAuditReportGenerator(
        audit_data=data,
        output_path='/tmp/report.pdf',
        level=data.get('level', 2)
    )
    generator.generate()
    
    with open('/tmp/report.pdf', 'rb') as f:
        pdf_content = base64.b64encode(f.read()).decode()
    
    return {'pdf': pdf_content, 'filename': f"audit_{data['audit_id']}.pdf"}
EOF

# Deploy
gcloud functions deploy generate-audit-report \
  --runtime python310 \
  --trigger-http \
  --allow-unauthenticated \
  --memory 512MB
```

**AWS Lambda:**

```bash
# Package
pip install reportlab -t ./package
cd package && zip -r ../deployment.zip .
cd .. && zip deployment.zip audit_report_generator.py lambda_handler.py

# Deploy via AWS CLI or Console
aws lambda create-function \
  --function-name audit-pdf-generator \
  --runtime python3.10 \
  --handler lambda_handler.handler \
  --zip-file fileb://deployment.zip \
  --memory-size 512
```

#### Deploy as Docker Container

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY audit_report_generator.py .
COPY server.py .

EXPOSE 8080
CMD ["python", "server.py"]
```

```python
# server.py
from flask import Flask, request, send_file
from audit_report_generator import HiringAuditReportGenerator
import tempfile
import os

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
        generator = HiringAuditReportGenerator(
            audit_data=data,
            output_path=f.name,
            level=data.get('level', 2)
        )
        generator.generate()
        
        return send_file(f.name, mimetype='application/pdf')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

```bash
# Build and run
docker build -t audit-pdf-generator .
docker run -p 8080:8080 audit-pdf-generator
```

### 6.5 Email Delivery Setup

#### SendGrid Configuration

```python
# email_sender.py
import sendgrid
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType

def send_audit_report(to_email, company_name, pdf_content, report_url):
    sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
    
    message = Mail(
        from_email='audit@yourdomain.com',
        to_emails=to_email,
        subject=f'Your Hiring Audit Report - {company_name}',
        html_content=f'''
        <h2>Your Hiring Audit Report is Ready</h2>
        <p>Dear {company_name} team,</p>
        <p>Your Hiring Execution & Talent Efficiency Audit report has been generated.</p>
        <p><a href="{report_url}">Download Report</a></p>
        <p>If you have questions about your results, please contact us.</p>
        '''
    )
    
    # Attach PDF
    attachment = Attachment(
        FileContent(pdf_content),
        FileName(f'Hiring_Audit_{company_name}.pdf'),
        FileType('application/pdf')
    )
    message.attachment = attachment
    
    response = sg.send(message)
    return response.status_code
```

---

## 7. Configuration Reference

### 7.1 Scoring Thresholds

```javascript
// scoring_config.js
module.exports = {
  // Block status thresholds
  GREEN_THRESHOLD: 2.3,    // avg >= 2.3 → GREEN
  YELLOW_THRESHOLD: 1.5,   // avg >= 1.5 → YELLOW
  // below 1.5 → RED
  
  // Confidence score weights
  STATUS_SCORES: {
    green: 90,
    yellow: 60,
    red: 30,
    gray: 50
  },
  
  // Penalties
  CONTRADICTION_PENALTY: 3,  // per contradiction
  GATE_FAILURE_PENALTY: 5,   // per gate failure
  
  // Data Trust Coefficient (Block 7 impact)
  DTC: {
    green: 1.0,
    yellow: 0.85,
    red: 0.7
  }
};
```

### 7.2 Gate Rules

```javascript
// Gate 0: Ownership Gate
if (block1 === 'red') → overall = 'red'

// Gate 1: Governance Gates  
if (block2 === 'red') → overall = 'red'
if (block4 === 'red') → overall = 'red'

// Execution Gates
if (block3 === 'red') → overall = 'red'
if (block5 === 'red') → overall = 'red'
if (block6 === 'red') → overall = 'red'

// Yellow escalation
if (yellowCount >= 2) → overall = 'yellow'
```

### 7.3 Cross-Validation Rules

| Rule ID | Name | Source | Validator | Severity |
|---------|------|--------|-----------|----------|
| CV-01 | Ownerless Hiring | b1_q3 >= 2 | b6_q2 <= 1 | force-red |
| CV-05 | SLA Theatre | b2_q3 >= 2 | b6_q5 <= 1 | force-red |
| CV-08 | Interview Bottleneck | b3_q2 >= 2 | b5_q2 <= 1 | force-red |
| CV-02 | Planning Illusion | b1_q1 >= 2 | b2_q5 <= 1 | hard |
| CV-06 | Capacity Denial | b2_q5 >= 2 | b6_q8 <= 1 | hard |

### 7.4 Recommendation Triggers

| Rec ID | Risk Name | Trigger Condition |
|--------|-----------|-------------------|
| B1-R01 | Ownerless Hiring | block1 = red OR score < 1.5 |
| B2-R02 | SLA Theatre | CV-05 detected |
| B2-R03 | Capacity Blindness | block2 = yellow OR red |
| B3-R01 | Interview Bottleneck | block3 = red |
| B6-R01 | Operational Fragility | block6 = red |

---

## 8. Testing & Validation

### 8.1 Run Integration Tests

```bash
# Clone test files
git clone [your-repo] && cd tests

# Install dependencies
pip install reportlab

# Run unit + scenario tests
python integration_test.py

# Run full E2E workflow
python e2e_workflow_test.py
```

### 8.2 Expected Test Results

```
======================================================================
SUMMARY
======================================================================
Total Tests: 9
Passed: 9 ✅
Failed: 0 ❌
Pass Rate: 100.0%
```

### 8.3 Manual Validation Checklist

- [ ] Submit test form → data appears in storage
- [ ] All 7 block forms working
- [ ] Scoring calculates correctly (compare with manual)
- [ ] Gate rules apply (Block 1 RED → Overall RED)
- [ ] Contradictions detected (test CV-05 scenario)
- [ ] PDF generates without errors
- [ ] Email delivers with attachment
- [ ] Report URL is accessible

### 8.4 Load Testing

```bash
# Using k6
k6 run --vus 10 --duration 30s load_test.js

# Expected: 
# - Form submission: < 500ms p95
# - Scoring: < 1s p95
# - PDF generation: < 5s p95
```

---

## 9. Troubleshooting

### Common Issues

#### Form submissions not arriving

```
Symptoms: No data in storage after form submit
Causes:
  1. Webhook URL incorrect
  2. API key invalid
  3. n8n workflow not active

Solutions:
  1. Check webhook URL in form settings
  2. Verify API key in n8n credentials
  3. Activate workflow in n8n
```

#### Scoring returns unexpected results

```
Symptoms: Overall status doesn't match expectations
Causes:
  1. Critical question scored 0 (forces RED)
  2. Cross-validation contradiction detected
  3. Gate rule triggered

Solutions:
  1. Check block_details.hasCriticalRed
  2. Review contradictions array
  3. Review gate_failures array
```

#### PDF generation fails

```
Symptoms: No PDF created, error in logs
Causes:
  1. ReportLab not installed
  2. Memory limit exceeded
  3. Invalid input data

Solutions:
  1. pip install reportlab
  2. Increase function memory to 512MB+
  3. Validate input JSON schema
```

#### Email not delivered

```
Symptoms: No email received
Causes:
  1. SMTP credentials invalid
  2. Sender domain not verified
  3. Recipient in spam

Solutions:
  1. Test SMTP credentials separately
  2. Verify domain in SendGrid/SES
  3. Check spam folder, add to whitelist
```

### Debug Mode

Enable verbose logging in n8n:

```bash
# Environment variable
LOG_LEVEL=debug

# Or in workflow
console.log(JSON.stringify($json, null, 2));
```

---

## 10. Maintenance

### 10.1 Regular Tasks

| Task | Frequency | Description |
|------|-----------|-------------|
| Backup data | Daily | Export Airtable/Sheets |
| Review logs | Weekly | Check for errors |
| Update dependencies | Monthly | pip/npm updates |
| Test full flow | Monthly | Run E2E tests |
| Review recommendations | Quarterly | Update library |

### 10.2 Monitoring

#### Key Metrics

```yaml
Metrics to track:
  - Form submission success rate (target: > 99%)
  - Scoring calculation time (target: < 1s)
  - PDF generation time (target: < 5s)
  - Email delivery rate (target: > 98%)
  - Audit completion rate (target: > 80%)
```

#### Alerts

```yaml
Set alerts for:
  - Webhook failure rate > 5%
  - Scoring errors
  - PDF generation failures
  - Email delivery failures
  - Unusual audit abandonment
```

### 10.3 Backup & Recovery

```bash
# Airtable backup
airtable-export --base $BASE_ID --output ./backups/

# n8n workflow backup
n8n export:workflow --all --output=./backups/workflows/

# Database backup (if using PostgreSQL)
pg_dump hiring_audit > backup_$(date +%Y%m%d).sql
```

### 10.4 Scaling

| Volume | Architecture | Notes |
|--------|--------------|-------|
| < 100/month | No-code/Low-code | Single instance |
| 100-1000/month | Standard | Add caching |
| 1000+/month | Enterprise | Microservices, load balancer |

---

## Appendix A: File Inventory

```
/outputs/
├── form_specifications/
│   ├── all_blocks_questions_csv.csv
│   ├── hiring_audit_forms_standalone.html
│   └── audit_forms_spec_complete.json
├── recommendation_library/
│   ├── Recommendation_Library_v1_0.md
│   ├── Recommendation_Quick_Reference.md
│   └── recommendation_library.json
├── report_generator/
│   └── audit_report_generator.py
├── automation/
│   ├── n8n_make_automation_spec.md
│   ├── n8n_workflow_scoring_engine.json
│   └── scoring_engine.js
├── tests/
│   ├── integration_test.py
│   └── e2e_workflow_test.py
└── docs/
    └── deployment_guide.md
```

---

## Appendix B: API Reference

### Scoring API

```http
POST /api/score
Content-Type: application/json

{
  "audit_id": "AUD-001",
  "responses": {
    "b1_q1": 3,
    "b1_q2": 2,
    ...
  }
}

Response:
{
  "overall_status": "yellow",
  "confidence_score": 72,
  "block_statuses": {...},
  "gate_failures": [...],
  "contradictions": [...],
  "recommendations": [...]
}
```

### PDF Generation API

```http
POST /api/generate-pdf
Content-Type: application/json

{
  "company_name": "TechCorp",
  "report_date": "2025-02-03",
  "level": 2,
  "block_statuses": {...},
  ...
}

Response:
{
  "pdf": "base64_encoded_content",
  "filename": "audit_AUD-001.pdf"
}
```

---

## Support

For technical issues:
- Check this deployment guide
- Review troubleshooting section
- Run integration tests
- Check n8n execution logs

---

*Deployment Guide v1.0 — Last updated: February 2025*
