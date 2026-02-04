import React, { useState, useEffect } from 'react';

// Form data structure for all blocks
const auditBlocks = {
  config: {
    title: "Audit Configuration",
    description: "Configure your audit scope and identify respondents",
    sections: [
      {
        title: "Company Identity",
        questions: [
          {
            id: "company_type",
            text: "Company type",
            type: "select",
            options: [
              "IT Product Company",
              "IT Services / Outsourcing", 
              "Recruitment Agency / RPO",
              "Non-IT Company",
              "Mixed / Hybrid"
            ]
          },
          {
            id: "company_size",
            text: "Company size (total headcount)",
            type: "select",
            options: [
              "1-50 employees",
              "51-200 employees",
              "201-500 employees",
              "501-1000 employees",
              "1001-5000 employees",
              "5000+ employees"
            ]
          },
          {
            id: "hiring_geography",
            text: "Primary hiring geography",
            type: "select",
            options: [
              "Single country",
              "Regional (multiple countries)",
              "Global"
            ]
          }
        ]
      },
      {
        title: "Hiring Scale",
        questions: [
          {
            id: "monthly_volume",
            text: "Average monthly hiring volume",
            type: "select",
            options: [
              "1-5 per month",
              "6-15 per month",
              "16-30 per month",
              "31-50 per month",
              "50+ per month"
            ]
          },
          {
            id: "hiring_pattern",
            text: "Typical hiring pattern",
            type: "select",
            options: [
              "Mostly planned (>70% from annual plan)",
              "Mixed (40-70% planned)",
              "Mostly reactive (<40% planned)"
            ]
          }
        ]
      },
      {
        title: "TA Function",
        questions: [
          {
            id: "ta_function",
            text: "Is there a dedicated TA function?",
            type: "select",
            options: [
              "Yes, dedicated TA department",
              "Partial (some dedicated, some shared)",
              "No, HR handles recruitment",
              "External only (RPO/agencies)"
            ]
          },
          {
            id: "recruiter_count",
            text: "Number of recruiters (internal)",
            type: "select",
            options: [
              "0 (no internal recruiters)",
              "1-3",
              "4-10",
              "11-25",
              "25+"
            ]
          }
        ]
      },
      {
        title: "Audit Depth",
        questions: [
          {
            id: "audit_tier",
            text: "Desired audit depth",
            type: "select",
            options: [
              "Lite (diagnostic only, ~50 questions)",
              "Standard (full diagnostic, ~100 questions)",
              "Premium (full + deep dive, ~150 questions)"
            ]
          }
        ]
      }
    ]
  },
  block1: {
    title: "Block 1: Executive Ownership",
    role: "CEO / COO / Business Owner",
    description: "Assess whether hiring is owned and governed at business level",
    sections: [
      {
        title: "Planning & Ownership",
        questions: [
          {
            id: "b1_q1",
            text: "Is hiring formally included in your annual business planning?",
            type: "select",
            options: [
              { value: 3, label: "Yes, hiring is part of the annual business plan" },
              { value: 2, label: "Partially (high-level targets without detailed planning)" },
              { value: 1, label: "No, hiring is planned reactively" },
              { value: 0, label: "No formal hiring planning exists" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Planning Maturity"
          },
          {
            id: "b1_q2",
            text: "At what level is hiring planning aligned with business goals?",
            type: "select",
            options: [
              { value: 3, label: "Fully aligned with business goals" },
              { value: 2, label: "Partially aligned" },
              { value: 1, label: "Weakly aligned" },
              { value: 0, label: "Not aligned at all" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Business Integration"
          },
          {
            id: "b1_q3",
            text: "Who owns the hiring outcome at the business level?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "CEO / Founder" },
              { value: 3, label: "COO / Business Operations" },
              { value: 2, label: "Head of HR / TA" },
              { value: 1, label: "Shared ownership (no single owner)" },
              { value: 0, label: "No clear owner" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Accountability Clarity",
            autoFlag: "No clear owner → RED"
          }
        ]
      },
      {
        title: "Visibility & Reporting",
        questions: [
          {
            id: "b1_q4",
            text: "Is hiring success discussed as a business responsibility?",
            type: "select",
            options: [
              { value: 3, label: "Business responsibility" },
              { value: 2, label: "Mixed (depends on situation)" },
              { value: 1, label: "Mostly HR / TA responsibility" },
              { value: 0, label: "Support function issue" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Organizational Framing"
          },
          {
            id: "b1_q5",
            text: "How often does business leadership review hiring reports?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Monthly" },
              { value: 2, label: "Quarterly" },
              { value: 1, label: "Ad-hoc (only when issues arise)" },
              { value: 0, label: "Rarely or Never" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Visibility Discipline"
          },
          {
            id: "b1_q6",
            text: "What level of visibility does leadership have into hiring progress?",
            type: "select",
            options: [
              { value: 3, label: "Clear visibility into progress, risks, and delays" },
              { value: 2, label: "High-level overview only" },
              { value: 1, label: "Limited visibility" },
              { value: 0, label: "No real visibility" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Risk Awareness"
          }
        ]
      },
      {
        title: "Financial Awareness",
        questions: [
          {
            id: "b1_q7",
            text: "Does the business understand where money is lost due to hiring delays?",
            type: "select",
            options: [
              { value: 3, label: "Yes, we clearly understand key loss areas" },
              { value: 2, label: "We have a general understanding" },
              { value: 1, label: "We suspect losses but cannot identify specifics" },
              { value: 0, label: "No clear understanding" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Financial Literacy"
          },
          {
            id: "b1_q8",
            text: "Are hiring delays discussed in the context of revenue/delivery impact?",
            type: "select",
            options: [
              { value: 3, label: "Regularly" },
              { value: 2, label: "Sometimes" },
              { value: 1, label: "Rarely" },
              { value: 0, label: "Never" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Business Consequence Linkage"
          }
        ]
      },
      {
        title: "Governance & Decision Logic",
        questions: [
          {
            id: "b1_q9",
            text: "Is hiring considered a potential bottleneck for business execution?",
            type: "select",
            options: [
              { value: 3, label: "Yes, and it is actively managed" },
              { value: 2, label: "Yes, but only when problems escalate" },
              { value: 1, label: "Occasionally" },
              { value: 0, label: "Rarely or Never" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Systems Thinking"
          },
          {
            id: "b1_q10",
            text: "When hiring becomes a bottleneck, how does leadership react?",
            type: "select",
            options: [
              { value: 3, label: "Re-prioritizes roles and resources" },
              { value: 2, label: "Escalates pressure on teams" },
              { value: 1, label: "Delegates issue to HR / TA" },
              { value: 0, label: "Reacts ad-hoc without clear approach" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Governance Under Stress"
          },
          {
            id: "b1_q11",
            text: "Are there regular business-level meetings to prioritize hiring?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, on a regular cadence" },
              { value: 2, label: "Yes, but irregularly" },
              { value: 1, label: "Only during critical situations" },
              { value: 0, label: "No such meetings exist" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Governance Structure"
          },
          {
            id: "b1_q12",
            text: "How are hiring priorities typically decided?",
            type: "select",
            options: [
              { value: 3, label: "Based on business impact and strategy" },
              { value: 3, label: "Based on agreed criteria" },
              { value: 2, label: "Based on urgency and pressure" },
              { value: 1, label: "Based on who escalates louder" },
              { value: 0, label: "No formal prioritization" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Decision Logic Maturity"
          }
        ]
      }
    ]
  },
  block2: {
    title: "Block 2: TA Leadership",
    role: "VP / Head of Talent Acquisition",
    description: "Evaluate TA capacity, processes, and governance",
    sections: [
      {
        title: "Planning & Forecasting",
        questions: [
          {
            id: "b2_q1",
            text: "Do you have an annual hiring plan approved for the current year?",
            type: "select",
            options: [
              { value: 3, label: "Yes, approved and baselined" },
              { value: 2, label: "Approved but frequently reworked" },
              { value: 1, label: "Partial (only key departments)" },
              { value: 0, label: "No annual plan (reactive)" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Planning Maturity"
          },
          {
            id: "b2_q2",
            text: "How is hiring demand collected?",
            type: "select",
            options: [
              { value: 3, label: "Structured intake with documented rules" },
              { value: 2, label: "Structured but rules vary by function" },
              { value: 1, label: "Ad-hoc requests via chats/emails" },
              { value: 0, label: "Mostly escalations/urgent requests" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Intake Governance"
          },
          {
            id: "b2_q3",
            text: "How often do you re-forecast hiring plan and TA capacity?",
            type: "select",
            options: [
              { value: 3, label: "Monthly" },
              { value: 2, label: "Quarterly" },
              { value: 1, label: "Ad-hoc" },
              { value: 0, label: "Rarely or Never" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Forecast Cadence"
          }
        ]
      },
      {
        title: "SLA & Process",
        questions: [
          {
            id: "b2_q4",
            text: "Do you have defined SLAs for recruitment lifecycle steps?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, for most steps and role families" },
              { value: 2, label: "Yes, but only for a few steps" },
              { value: 1, label: "No SLAs" },
              { value: 0, label: "Not sure" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "SLA Maturity"
          },
          {
            id: "b2_q5",
            text: "Are SLAs monitored and reported to stakeholders?",
            type: "select",
            options: [
              { value: 3, label: "Yes, monitored and visible to stakeholders" },
              { value: 2, label: "Monitored internally only" },
              { value: 1, label: "Tracked ad-hoc (when issues)" },
              { value: 0, label: "Not monitored" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "SLA Governance"
          },
          {
            id: "b2_q6",
            text: "Do you have standardized recruitment process stages?",
            type: "select",
            options: [
              { value: 3, label: "Yes, standardized and enforced" },
              { value: 2, label: "Standard exists but exceptions frequent" },
              { value: 1, label: "Varies by function/team" },
              { value: 0, label: "No standardized process" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Process Standardization"
          }
        ]
      },
      {
        title: "Capacity & Load",
        questions: [
          {
            id: "b2_q7",
            text: "Is recruiter workload formally tracked?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, tracked per recruiter in real time" },
              { value: 2, label: "Tracked periodically (weekly/monthly)" },
              { value: 1, label: "Informally monitored" },
              { value: 0, label: "Not tracked" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Capacity Visibility"
          },
          {
            id: "b2_q8",
            text: "What is considered normal active load per recruiter?",
            type: "select",
            options: [
              { value: 3, label: "1-8 active roles" },
              { value: 2, label: "9-12 active roles" },
              { value: 1, label: "13-18 active roles" },
              { value: 0, label: "19+ active roles or not defined" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Overload Risk"
          }
        ]
      },
      {
        title: "Data & Reporting",
        questions: [
          {
            id: "b2_q9",
            text: "Do you have a single source of truth for hiring pipeline?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes (ATS/CRM is clean and trusted)" },
              { value: 2, label: "Partially (data exists but unreliable)" },
              { value: 1, label: "No (spread across tools/spreadsheets)" },
              { value: 0, label: "Not sure" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Data Reliability"
          },
          {
            id: "b2_q10",
            text: "Are metrics used for decisions (not just reporting)?",
            type: "select",
            options: [
              { value: 3, label: "Yes, decisions are driven by metrics" },
              { value: 2, label: "Sometimes" },
              { value: 1, label: "Rarely" },
              { value: 0, label: "No" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Decision Intelligence"
          }
        ]
      }
    ]
  },
  block3: {
    title: "Block 3: Delivery & Hiring Leadership",
    role: "Head of Delivery / Engineering Directors",
    description: "Assess interview capacity, feedback discipline, and demand quality",
    sections: [
      {
        title: "Demand Definition",
        questions: [
          {
            id: "b3_q1",
            text: "How are hiring needs typically initiated?",
            type: "select",
            options: [
              { value: 3, label: "Strategic workforce planning" },
              { value: 2, label: "Quarterly planning cycles" },
              { value: 1, label: "Project-based requests" },
              { value: 0, label: "Escalation-driven / urgent requests" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Planning Maturity"
          },
          {
            id: "b3_q2",
            text: "Are role requirements clearly defined at kickoff?",
            type: "select",
            options: [
              { value: 3, label: "Yes, detailed and stable" },
              { value: 2, label: "Mostly clear with some gaps" },
              { value: 1, label: "Often unclear or evolving" },
              { value: 0, label: "Rarely clear" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Requirement Clarity"
          }
        ]
      },
      {
        title: "Interview Capacity",
        questions: [
          {
            id: "b3_q3",
            text: "Is interviewer availability formally planned?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, fixed windows planned in advance" },
              { value: 2, label: "Planned but frequently violated" },
              { value: 1, label: "Ad-hoc availability" },
              { value: 0, label: "No planning" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Capacity Realism"
          },
          {
            id: "b3_q4",
            text: "How often are interviews delayed due to Delivery unavailability?",
            type: "select",
            options: [
              { value: 3, label: "Rarely (<10% of interviews)" },
              { value: 2, label: "Sometimes (10-25%)" },
              { value: 1, label: "Often (25-50%)" },
              { value: 0, label: "Frequently (>50%)" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Ownership of Delays"
          }
        ]
      },
      {
        title: "Feedback Discipline",
        questions: [
          {
            id: "b3_q5",
            text: "Is there a standardized interview evaluation format?",
            type: "select",
            options: [
              { value: 3, label: "Yes, structured scorecards enforced" },
              { value: 2, label: "Exists but not consistently used" },
              { value: 1, label: "Mostly unstructured feedback" },
              { value: 0, label: "No standard format" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Evaluation Discipline"
          },
          {
            id: "b3_q6",
            text: "How timely is interview feedback provided?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Within 24 hours consistently" },
              { value: 2, label: "Within 48 hours usually" },
              { value: 1, label: "Often delayed (3-5 days)" },
              { value: 0, label: "Frequently missing or very late" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Execution Reliability"
          }
        ]
      },
      {
        title: "Accountability",
        questions: [
          {
            id: "b3_q7",
            text: "Who makes final hiring decisions?",
            type: "select",
            options: [
              { value: 3, label: "Clear decision authority with escalation path" },
              { value: 2, label: "Shared decision with defined tie-breaker" },
              { value: 1, label: "Informal consensus" },
              { value: 0, label: "Single interviewer veto power" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Accountability Clarity"
          },
          {
            id: "b3_q8",
            text: "How are hiring conflicts resolved?",
            type: "select",
            options: [
              { value: 3, label: "Formal escalation path that works" },
              { value: 2, label: "Exists but works inconsistently" },
              { value: 1, label: "Informal negotiation" },
              { value: 0, label: "No escalation path" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Escalation Logic"
          }
        ]
      }
    ]
  },
  block4: {
    title: "Block 4: Financial Governance",
    role: "CFO / Finance Director",
    description: "Evaluate TA budget ownership, cost visibility, and financial controls",
    sections: [
      {
        title: "Budget Ownership",
        questions: [
          {
            id: "b4_q1",
            text: "Is there a formally approved annual TA operating budget?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, line-item budget approved and tracked" },
              { value: 2, label: "Yes, but high-level only" },
              { value: 1, label: "Partial (only major items)" },
              { value: 0, label: "No formal TA budget exists" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Budget Governance"
          },
          {
            id: "b4_q2",
            text: "Who owns the TA budget?",
            type: "select",
            options: [
              { value: 3, label: "TA Head with clear accountability" },
              { value: 2, label: "HR/CHRO (TA part of HR budget)" },
              { value: 1, label: "Finance owns, TA has no authority" },
              { value: 0, label: "Shared/unclear or no owner" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Accountability Clarity"
          }
        ]
      },
      {
        title: "Budget-Plan Alignment",
        questions: [
          {
            id: "b4_q3",
            text: "Is the TA budget derived from an approved hiring plan?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, calculated from plan volumes" },
              { value: 2, label: "Partially aligned" },
              { value: 1, label: "Set independently of hiring plan" },
              { value: 0, label: "No hiring plan exists" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Planning Integration"
          },
          {
            id: "b4_q4",
            text: "When hiring demand increases, how is TA budget adjusted?",
            type: "select",
            options: [
              { value: 3, label: "Automatic adjustment based on triggers" },
              { value: 2, label: "Formal re-forecast process" },
              { value: 1, label: "Case-by-case negotiation" },
              { value: 0, label: "Budget fixed / TA absorbs without change" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Budget Flexibility"
          }
        ]
      },
      {
        title: "Cost Visibility",
        questions: [
          {
            id: "b4_q5",
            text: "Does Finance have visibility into TA cost components?",
            type: "select",
            options: [
              { value: 3, label: "Full visibility with itemized reporting" },
              { value: 2, label: "High-level visibility only" },
              { value: 1, label: "Limited visibility" },
              { value: 0, label: "No visibility" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Financial Transparency"
          },
          {
            id: "b4_q6",
            text: "Can you calculate cost-per-hire by role type?",
            type: "select",
            options: [
              { value: 3, label: "Yes, tracked and reported regularly" },
              { value: 2, label: "Can calculate but not routine" },
              { value: 1, label: "Rough estimates only" },
              { value: 0, label: "Cannot calculate" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Unit Economics"
          }
        ]
      },
      {
        title: "Review & Controls",
        questions: [
          {
            id: "b4_q7",
            text: "How often is TA spend reviewed against budget?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Monthly" },
              { value: 2, label: "Quarterly" },
              { value: 1, label: "Ad-hoc" },
              { value: 0, label: "Never" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Review Discipline"
          },
          {
            id: "b4_q8",
            text: "How confident is Finance in TA spend predictability?",
            type: "select",
            options: [
              { value: 3, label: "High confidence" },
              { value: 2, label: "Partial confidence" },
              { value: 1, label: "Low confidence" },
              { value: 0, label: "No confidence" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "CFO Confidence"
          }
        ]
      }
    ]
  },
  block5: {
    title: "Block 5: Technical Interviewing",
    role: "Engineering Director / CDO",
    description: "Assess technical evaluation governance and interview system",
    sections: [
      {
        title: "Interviewer Pool",
        questions: [
          {
            id: "b5_q1",
            text: "Is there a formally defined pool of technical interviewers?",
            type: "select",
            options: [
              { value: 3, label: "Yes, documented and maintained" },
              { value: 2, label: "Informal / ad-hoc" },
              { value: 0, label: "No defined pool" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Pool Definition"
          },
          {
            id: "b5_q2",
            text: "Is technical interview capacity planned and scheduled?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Planned with calendar ownership" },
              { value: 2, label: "Partially planned" },
              { value: 0, label: "Not planned" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Capacity Planning"
          }
        ]
      },
      {
        title: "SLA & Standards",
        questions: [
          {
            id: "b5_q3",
            text: "Are interview availability SLAs defined and enforced?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Defined and enforced" },
              { value: 2, label: "Defined but violated" },
              { value: 0, label: "Not defined" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "SLA Enforcement"
          },
          {
            id: "b5_q4",
            text: "Are technical evaluation criteria standardized?",
            type: "select",
            options: [
              { value: 3, label: "Standardized across roles" },
              { value: 2, label: "Partially standardized" },
              { value: 0, label: "Individual interviewer preference" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Evaluation Standards"
          }
        ]
      },
      {
        title: "Training & Quality",
        questions: [
          {
            id: "b5_q5",
            text: "Do interviewers receive formal interview training?",
            type: "select",
            options: [
              { value: 3, label: "Mandatory and recurring" },
              { value: 2, label: "Optional / one-time" },
              { value: 0, label: "No training" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Interviewer Training"
          },
          {
            id: "b5_q6",
            text: "Is technical feedback structured and actionable?",
            type: "select",
            options: [
              { value: 3, label: "Structured with scoring" },
              { value: 2, label: "Narrative only" },
              { value: 0, label: "Vague / binary" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Feedback Quality"
          }
        ]
      },
      {
        title: "Accountability",
        questions: [
          {
            id: "b5_q7",
            text: "Is technical feedback delivered within SLA?",
            type: "select",
            options: [
              { value: 3, label: "Consistently on time" },
              { value: 2, label: "Often delayed" },
              { value: 0, label: "Frequently missing" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Feedback Timeliness"
          },
          {
            id: "b5_q8",
            text: "Are interviewers held accountable for delays or quality issues?",
            type: "select",
            options: [
              { value: 3, label: "Formal accountability" },
              { value: 2, label: "Informal pressure" },
              { value: 0, label: "No accountability" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Interviewer Accountability"
          }
        ]
      }
    ]
  },
  block6: {
    title: "Block 6: Recruitment Operations",
    role: "TA Operations Lead / Head of TA",
    description: "Validate operational stability, ATS discipline, and throughput",
    sections: [
      {
        title: "Process & Ownership",
        questions: [
          {
            id: "b6_q1",
            text: "Do you have a documented end-to-end hiring process that is actually used?",
            type: "select",
            options: [
              { value: 3, label: "Yes, documented and enforced" },
              { value: 2, label: "Documented but inconsistently followed" },
              { value: 1, label: "Partially documented" },
              { value: 0, label: "No documented process" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Process Repeatability"
          },
          {
            id: "b6_q2",
            text: "Is ownership defined for each hiring stage?",
            type: "select",
            options: [
              { value: 3, label: "All stages + escalation path" },
              { value: 2, label: "Most stages, gaps exist" },
              { value: 1, label: "Informal / depends on individuals" },
              { value: 0, label: "No defined ownership" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Stage Ownership"
          }
        ]
      },
      {
        title: "Capacity & Workload",
        questions: [
          {
            id: "b6_q3",
            text: "Do you use a capacity model to plan recruiter workload?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, used and updated regularly" },
              { value: 2, label: "Exists but rarely used" },
              { value: 1, label: "Informal assumptions only" },
              { value: 0, label: "No capacity thinking" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Capacity Planning"
          },
          {
            id: "b6_q4",
            text: "How are roles distributed across recruiters?",
            type: "select",
            options: [
              { value: 3, label: "Rules-based allocation + rebalancing" },
              { value: 2, label: "Mostly fair but manual" },
              { value: 1, label: "Depends on availability that day" },
              { value: 0, label: "Arbitrary / political" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Allocation Fairness"
          }
        ]
      },
      {
        title: "Data & ATS",
        questions: [
          {
            id: "b6_q5",
            text: "Where is the single source of truth for pipeline status?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "ATS is single source (mandatory usage)" },
              { value: 2, label: "ATS used but parallel trackers exist" },
              { value: 1, label: "Spreadsheets/chats primary, ATS partial" },
              { value: 0, label: "No consistent source of truth" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Data Reliability"
          },
          {
            id: "b6_q6",
            text: "How trustworthy is your reporting?",
            type: "select",
            options: [
              { value: 3, label: "Trusted and used for decisions" },
              { value: 2, label: "Exists but sometimes questioned" },
              { value: 1, label: "Exists but rarely used" },
              { value: 0, label: "Not trusted / not available" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Decision-Grade Visibility"
          }
        ]
      },
      {
        title: "Resilience",
        questions: [
          {
            id: "b6_q7",
            text: "Do you track stage aging / stalled requisitions?",
            type: "select",
            options: [
              { value: 3, label: "Automated alerts + weekly reviews" },
              { value: 2, label: "Tracked, follow-up inconsistent" },
              { value: 1, label: "Not tracked systematically" },
              { value: 0, label: "Only discovered when escalated" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Bottleneck Detection"
          },
          {
            id: "b6_q8",
            text: "If a key recruiter is absent for 2 weeks, what happens?",
            type: "select",
            options: [
              { value: 3, label: "Coverage plan, pipeline continues" },
              { value: 2, label: "Coverage exists but throughput drops" },
              { value: 1, label: "Ad-hoc coverage, significant stalls" },
              { value: 0, label: "Work stops / critical knowledge locked" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Key-Person Risk"
          }
        ]
      }
    ]
  },
  block7: {
    title: "Block 7: Reporting, Data & AI",
    role: "TA Leadership / IT / Compliance",
    description: "Validate data integrity, reporting, and AI governance",
    sections: [
      {
        title: "Reporting Coverage",
        questions: [
          {
            id: "b7_q1",
            text: "Does the company have standardized TA/hiring reports?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, automated dashboards (real-time)" },
              { value: 2, label: "Yes, automated on schedule" },
              { value: 1, label: "Yes, but manually compiled" },
              { value: 0, label: "Partial or no standardized reporting" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Reporting Maturity"
          },
          {
            id: "b7_q2",
            text: "Are hiring reports used for decision-making at C-level?",
            type: "select",
            options: [
              { value: 3, label: "Yes, regularly drive decisions" },
              { value: 2, label: "Yes, but only for major issues" },
              { value: 1, label: "Reports exist but rarely influence" },
              { value: 0, label: "No C-level engagement" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Executive Data Usage"
          }
        ]
      },
      {
        title: "Data Integrity",
        questions: [
          {
            id: "b7_q3",
            text: "Is the ATS the single source of truth for hiring data?",
            type: "select",
            critical: true,
            options: [
              { value: 3, label: "Yes, mandatory and trusted" },
              { value: 2, label: "Primary but parallel systems exist" },
              { value: 1, label: "One of several with unclear primacy" },
              { value: 0, label: "Spreadsheets primary or no ATS" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "System of Record"
          },
          {
            id: "b7_q4",
            text: "Is there defined ownership for ATS data quality?",
            type: "select",
            options: [
              { value: 3, label: "Yes, dedicated owner/team" },
              { value: 2, label: "Yes, but part-time responsibility" },
              { value: 1, label: "Informal (recruiters responsible)" },
              { value: 0, label: "No ownership defined" },
              { value: -1, label: "Not relevant" }
            ],
            signal: "Data Ownership"
          }
        ]
      },
      {
        title: "AI Usage",
        questions: [
          {
            id: "b7_q5",
            text: "Is AI or automation used in your hiring process?",
            type: "select",
            options: [
              { value: 3, label: "Yes, strategically across stages" },
              { value: 2, label: "Yes, operationally in specific areas" },
              { value: 1, label: "Experimenting / piloting" },
              { value: 0, label: "No AI in use" },
              { value: -1, label: "Not sure what's in use" }
            ],
            signal: "AI Adoption"
          },
          {
            id: "b7_q6",
            text: "Is there a complete inventory of AI tools used?",
            type: "select",
            options: [
              { value: 3, label: "Yes, documented and maintained" },
              { value: 2, label: "Partial inventory" },
              { value: 1, label: "No formal inventory" },
              { value: 0, label: "Not sure what AI tools are used" },
              { value: -1, label: "Not applicable" }
            ],
            signal: "AI Visibility",
            autoFlag: "'Not sure' → Shadow AI Risk"
          }
        ]
      },
      {
        title: "AI Governance",
        questions: [
          {
            id: "b7_q7",
            text: "Is there a formal AI governance policy for hiring?",
            type: "select",
            options: [
              { value: 3, label: "Yes, comprehensive and enforced" },
              { value: 2, label: "Yes, basic guidelines exist" },
              { value: 1, label: "Informal understanding only" },
              { value: 0, label: "No policy exists" },
              { value: -1, label: "Not applicable" }
            ],
            signal: "AI Governance"
          },
          {
            id: "b7_q8",
            text: "Is human oversight required for AI-influenced decisions?",
            type: "select",
            options: [
              { value: 3, label: "Yes, always (AI recommends, humans decide)" },
              { value: 2, label: "Yes, for final decisions only" },
              { value: 1, label: "Sometimes" },
              { value: 0, label: "No, AI decisions are automated" },
              { value: -1, label: "Not applicable" }
            ],
            signal: "Human-in-the-Loop"
          }
        ]
      },
      {
        title: "Compliance",
        questions: [
          {
            id: "b7_q9",
            text: "Are GDPR/data protection requirements understood?",
            type: "select",
            options: [
              { value: 3, label: "Fully understood with documented compliance" },
              { value: 2, label: "Generally understood" },
              { value: 1, label: "Partial understanding" },
              { value: 0, label: "Limited / no understanding" },
              { value: -1, label: "Not applicable" }
            ],
            signal: "Compliance Awareness"
          },
          {
            id: "b7_q10",
            text: "Is there a data retention policy for candidate data?",
            type: "select",
            options: [
              { value: 3, label: "Yes, documented with automated enforcement" },
              { value: 2, label: "Yes, documented but manual" },
              { value: 1, label: "Informal understanding only" },
              { value: 0, label: "No retention policy" },
              { value: -1, label: "Not applicable" }
            ],
            signal: "Data Retention"
          }
        ]
      }
    ]
  }
};

// Status calculation utilities
const calculateBlockStatus = (responses, blockId) => {
  const block = auditBlocks[blockId];
  if (!block || !block.sections) return null;
  
  let totalScore = 0;
  let count = 0;
  let hasCriticalRed = false;
  
  block.sections.forEach(section => {
    section.questions.forEach(q => {
      const response = responses[q.id];
      if (response !== undefined && response !== -1) {
        totalScore += response;
        count++;
        if (q.critical && response === 0) {
          hasCriticalRed = true;
        }
      }
    });
  });
  
  if (count === 0) return null;
  
  const average = totalScore / count;
  
  if (hasCriticalRed || average < 1.5) return 'red';
  if (average < 2.3) return 'yellow';
  return 'green';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'green': return '#10B981';
    case 'yellow': return '#F59E0B';
    case 'red': return '#EF4444';
    default: return '#6B7280';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'green': return 'Healthy';
    case 'yellow': return 'At Risk';
    case 'red': return 'Critical';
    default: return 'Pending';
  }
};

// Main App Component
export default function HiringAuditForms() {
  const [currentBlock, setCurrentBlock] = useState('config');
  const [responses, setResponses] = useState({});
  const [completedBlocks, setCompletedBlocks] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const blockOrder = ['config', 'block1', 'block2', 'block3', 'block4', 'block5', 'block6', 'block7'];
  
  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: typeof value === 'object' ? value.value : value
    }));
  };

  const handleNextBlock = () => {
    const currentIndex = blockOrder.indexOf(currentBlock);
    if (!completedBlocks.includes(currentBlock)) {
      setCompletedBlocks(prev => [...prev, currentBlock]);
    }
    if (currentIndex < blockOrder.length - 1) {
      setCurrentBlock(blockOrder[currentIndex + 1]);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevBlock = () => {
    const currentIndex = blockOrder.indexOf(currentBlock);
    if (currentIndex > 0) {
      setCurrentBlock(blockOrder[currentIndex - 1]);
    }
  };

  const currentBlockData = auditBlocks[currentBlock];
  const currentIndex = blockOrder.indexOf(currentBlock);
  const progress = ((currentIndex + 1) / blockOrder.length) * 100;

  // Results View
  if (showResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '40px 20px',
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif"
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#f8fafc',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            Audit Results
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
            Hiring Execution & Talent Efficiency Assessment
          </p>

          {/* Overall Status */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h2 style={{ color: '#f8fafc', marginBottom: '24px', fontSize: '20px' }}>
              Block Status Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {blockOrder.slice(1).map(blockId => {
                const status = calculateBlockStatus(responses, blockId);
                const block = auditBlocks[blockId];
                return (
                  <div key={blockId} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `2px solid ${getStatusColor(status)}40`,
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getStatusColor(status),
                      marginBottom: '12px',
                      boxShadow: `0 0 12px ${getStatusColor(status)}60`
                    }} />
                    <div style={{ color: '#f8fafc', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      {block.title.split(':')[0]}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {getStatusLabel(status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Scores */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ color: '#f8fafc', marginBottom: '24px', fontSize: '20px' }}>
              Response Summary
            </h2>
            <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.8' }}>
              <p>Total questions answered: {Object.keys(responses).length}</p>
              <p>Blocks completed: {completedBlocks.length}</p>
              <p style={{ marginTop: '16px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10B981' }}>
                ✓ Audit data collected successfully. In production, this would generate a PDF report with cross-validation analysis.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowResults(false);
              setCurrentBlock('config');
              setResponses({});
              setCompletedBlocks([]);
            }}
            style={{
              marginTop: '32px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Start New Audit
          </button>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 40px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#f8fafc',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Hiring Execution Audit
              </h1>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
                {currentBlockData?.role || 'Configuration'}
              </p>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#60a5fa',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {currentIndex + 1} / {blockOrder.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Block Navigation */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '12px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflowX: 'auto'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          {blockOrder.map((blockId, idx) => {
            const isActive = blockId === currentBlock;
            const isCompleted = completedBlocks.includes(blockId);
            const block = auditBlocks[blockId];
            const status = blockId !== 'config' ? calculateBlockStatus(responses, blockId) : null;
            
            return (
              <button
                key={blockId}
                onClick={() => setCurrentBlock(blockId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: isActive ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                  background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isCompleted && status && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(status)
                  }} />
                )}
                {blockId === 'config' ? 'Config' : `B${idx}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#f8fafc',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            {currentBlockData?.title}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>
            {currentBlockData?.description}
          </p>
        </div>

        {/* Sections */}
        {currentBlockData?.sections?.map((section, sIdx) => (
          <div key={sIdx} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              {section.title}
            </h3>

            {section.questions.map((question, qIdx) => (
              <div key={question.id} style={{ marginBottom: qIdx < section.questions.length - 1 ? '28px' : 0 }}>
                <label style={{
                  display: 'block',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  lineHeight: '1.5'
                }}>
                  {question.text}
                  {question.critical && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '10px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      CRITICAL
                    </span>
                  )}
                </label>
                
                {question.signal && (
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginBottom: '10px'
                  }}>
                    Signal: {question.signal}
                  </div>
                )}

                <select
                  value={responses[question.id] ?? ''}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    fontSize: '14px',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px'
                  }}
                >
                  <option value="" style={{ background: '#1e293b' }}>Select an option...</option>
                  {(question.options || []).map((opt, optIdx) => {
                    const optValue = typeof opt === 'object' ? opt.value : opt;
                    const optLabel = typeof opt === 'object' ? opt.label : opt;
                    return (
                      <option key={optIdx} value={optValue} style={{ background: '#1e293b' }}>
                        {optLabel}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}
          </div>
        ))}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={handlePrevBlock}
            disabled={currentIndex === 0}
            style={{
              padding: '14px 28px',
              background: currentIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: currentIndex === 0 ? '#475569' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ← Previous
          </button>

          <button
            onClick={handleNextBlock}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {currentIndex === blockOrder.length - 1 ? 'View Results' : 'Next Block →'}
          </button>
        </div>
      </div>
    </div>
  );
}
