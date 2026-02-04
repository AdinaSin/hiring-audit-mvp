/**
 * Hiring Audit Scoring Engine v1.0
 * 
 * Standalone JavaScript implementation of the scoring logic.
 * Can be used in:
 * - n8n Code nodes
 * - Make.com JavaScript modules
 * - Node.js backend
 * - Browser applications
 * 
 * @author Hiring Audit System
 * @version 1.0
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCORING_CONFIG = {
  // Thresholds
  GREEN_THRESHOLD: 2.3,
  YELLOW_THRESHOLD: 1.5,
  
  // Score weights for confidence calculation
  STATUS_SCORES: {
    green: 90,
    yellow: 60,
    red: 30,
    gray: 50
  },
  
  // Deductions
  CONTRADICTION_PENALTY: 3,
  GATE_FAILURE_PENALTY: 5,
  
  // Data Trust Coefficient
  DTC: {
    green: 1.0,
    yellow: 0.85,
    red: 0.7
  }
};

// Critical questions that force RED if score = 0
const CRITICAL_QUESTIONS = {
  block1: ['b1_q3', 'b1_q4', 'b1_q7'],
  block2: ['b2_q3', 'b2_q5', 'b2_q6'],
  block3: ['b3_q2', 'b3_q3'],
  block4: ['b4_q1', 'b4_q2', 'b4_q4'],
  block5: ['b5_q1', 'b5_q2'],
  block6: ['b6_q5', 'b6_q8'],
  block7: ['b7_q1', 'b7_q2']
};

// Cross-validation rules
const CROSS_VALIDATION_RULES = [
  {
    id: 'CV-01',
    name: 'Ownerless Hiring in Practice',
    source: { question: 'b1_q3', operator: '>=', value: 2 },
    validator: { question: 'b6_q2', operator: '<=', value: 1 },
    severity: 'force-red',
    diagnosis: 'Nominal ownership without mandate'
  },
  {
    id: 'CV-02',
    name: 'Planning Illusion',
    source: { question: 'b1_q1', operator: '>=', value: 2 },
    validator: { question: 'b2_q5', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Planning without capacity math'
  },
  {
    id: 'CV-03',
    name: 'Cadence Claimed Not Lived',
    source: { question: 'b1_q7', operator: '>=', value: 2 },
    validator: { question: 'b3_q4', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Prioritization cadence exists on paper only'
  },
  {
    id: 'CV-04',
    name: 'Visibility Illusion',
    source: { question: 'b1_q5', operator: '>=', value: 2 },
    validator: { question: 'b7_q1', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Dashboard fantasy - no reliable reporting'
  },
  {
    id: 'CV-05',
    name: 'SLA Theatre',
    source: { question: 'b2_q3', operator: '>=', value: 2 },
    validator: { question: 'b6_q5', operator: '<=', value: 1 },
    severity: 'force-red',
    diagnosis: 'SLA exists on paper only'
  },
  {
    id: 'CV-06',
    name: 'Capacity Denial',
    source: { question: 'b2_q5', operator: '>=', value: 2 },
    validator: { question: 'b6_q8', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Operational overload hidden'
  },
  {
    id: 'CV-07',
    name: 'Quality Misalignment',
    source: { question: 'b2_q4', operator: '>=', value: 2 },
    validator: { question: 'b3_q1', operator: '<=', value: 1 },
    severity: 'soft',
    diagnosis: 'TA and Delivery disagree on quality'
  },
  {
    id: 'CV-08',
    name: 'Interview Bottleneck Masked',
    source: { question: 'b3_q2', operator: '>=', value: 2 },
    validator: { question: 'b5_q2', operator: '<=', value: 1 },
    severity: 'force-red',
    diagnosis: 'Delivery denial on interviews'
  },
  {
    id: 'CV-09',
    name: 'Feedback Latency Hidden',
    source: { question: 'b3_q3', operator: '>=', value: 2 },
    validator: { question: 'b6_q7', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Feedback delays not visible'
  },
  {
    id: 'CV-11',
    name: 'Unfounded Budget',
    source: { question: 'b4_q2', operator: '>=', value: 2 },
    validator: { question: 'b2_q5', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Budget without formula'
  },
  {
    id: 'CV-15',
    name: 'Rubric Theatre',
    source: { question: 'b5_q3', operator: '>=', value: 2 },
    validator: { question: 'b3_q4', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Evaluation criteria exist but not used'
  },
  {
    id: 'CV-17',
    name: 'Evaluation Governance Broken',
    source: { question: 'b5_q2', operator: '>=', value: 2 },
    validator: { question: 'b6_q7', operator: '<=', value: 1 },
    severity: 'force-red',
    diagnosis: 'No accountability, no SLA'
  },
  {
    id: 'CV-20',
    name: 'Bottleneck Denial',
    source: { question: 'b1_q6', operator: '<=', value: 1 },
    validator: { question: 'b6_q7', operator: '<=', value: 1 },
    severity: 'hard',
    diagnosis: 'Executive blind to operational reality'
  }
];

// Recommendation triggers
const RECOMMENDATION_TRIGGERS = {
  'B1-R01': {
    risk_name: 'Ownerless Hiring',
    condition: (statuses, scores, flags) => statuses.block1 === 'red' || scores.block1 < 1.5,
    priority: 1
  },
  'B1-R04': {
    risk_name: 'Political Prioritization',
    condition: (statuses, scores, flags, responses) => responses?.b1_q8 === 1,
    priority: 2
  },
  'B2-R02': {
    risk_name: 'SLA Theatre',
    condition: (statuses, scores, flags) => flags.includes('SLA Theatre'),
    priority: 1
  },
  'B2-R03': {
    risk_name: 'Capacity Blindness',
    condition: (statuses, scores, flags) => statuses.block2 === 'red' || statuses.block2 === 'yellow',
    priority: 2
  },
  'B3-R01': {
    risk_name: 'Interview Bottleneck',
    condition: (statuses, scores, flags) => statuses.block3 === 'red',
    priority: 1
  },
  'B3-R02': {
    risk_name: 'Feedback Latency',
    condition: (statuses, scores, flags, responses) => responses?.b3_q3 <= 1,
    priority: 2
  },
  'B4-R01': {
    risk_name: 'Financial Opacity',
    condition: (statuses, scores, flags) => statuses.block4 === 'red',
    priority: 1
  },
  'B5-R01': {
    risk_name: 'Evaluation Collapse',
    condition: (statuses, scores, flags) => statuses.block5 === 'red',
    priority: 1
  },
  'B6-R01': {
    risk_name: 'Operational Fragility',
    condition: (statuses, scores, flags) => statuses.block6 === 'red',
    priority: 1
  },
  'B6-R03': {
    risk_name: 'Key-Person Failure',
    condition: (statuses, scores, flags, responses) => responses?.b6_q4 === 0,
    priority: 1
  },
  'B7-R01': {
    risk_name: 'Systemic Visibility Failure',
    condition: (statuses, scores, flags) => statuses.block7 === 'red',
    priority: 2
  },
  'B7-R02': {
    risk_name: 'Shadow AI',
    condition: (statuses, scores, flags, responses) => responses?.b7_q3 === -1 || responses?.b7_q6 <= 1,
    priority: 2
  }
};

// ============================================================================
// CORE SCORING FUNCTIONS
// ============================================================================

/**
 * Calculate block scores and statuses from raw responses
 * @param {Object} responses - Question ID to score mapping
 * @returns {Object} Block scores and statuses
 */
function calculateBlockScores(responses) {
  const blockScores = {};
  const blockStatuses = {};
  const blockDetails = {};
  
  // Group responses by block
  const blockResponses = {};
  for (const [questionId, score] of Object.entries(responses)) {
    const blockMatch = questionId.match(/^b(\d)_/);
    if (blockMatch) {
      const blockId = `block${blockMatch[1]}`;
      if (!blockResponses[blockId]) {
        blockResponses[blockId] = {};
      }
      blockResponses[blockId][questionId] = score;
    }
  }
  
  // Calculate each block
  for (const [blockId, blockData] of Object.entries(blockResponses)) {
    // Filter out "not relevant" (-1) responses
    const validScores = Object.values(blockData).filter(v => v !== -1 && v !== null && v !== undefined);
    
    if (validScores.length === 0) {
      blockStatuses[blockId] = 'gray';
      blockScores[blockId] = null;
      blockDetails[blockId] = { status: 'incomplete', questionCount: 0 };
      continue;
    }
    
    // Calculate average
    const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    blockScores[blockId] = Math.round(avg * 100) / 100;
    
    // Check for critical RED
    const criticals = CRITICAL_QUESTIONS[blockId] || [];
    const hasCriticalRed = criticals.some(q => blockData[q] === 0);
    
    // Determine status
    if (hasCriticalRed || avg < SCORING_CONFIG.YELLOW_THRESHOLD) {
      blockStatuses[blockId] = 'red';
    } else if (avg < SCORING_CONFIG.GREEN_THRESHOLD) {
      blockStatuses[blockId] = 'yellow';
    } else {
      blockStatuses[blockId] = 'green';
    }
    
    // Store details
    blockDetails[blockId] = {
      average: avg,
      questionCount: validScores.length,
      totalQuestions: Object.keys(blockData).length,
      hasCriticalRed,
      criticalQuestions: criticals.filter(q => blockData[q] === 0)
    };
  }
  
  return { blockScores, blockStatuses, blockDetails };
}

/**
 * Apply gate rules to determine overall status
 * @param {Object} blockStatuses - Block ID to status mapping
 * @returns {Object} Gate failures and overall status
 */
function applyGateRules(blockStatuses) {
  const gateFailures = [];
  let overallStatus = 'green';
  
  // Gate 0: Block 1 RED → Overall RED (Ownership Gate)
  if (blockStatuses.block1 === 'red') {
    gateFailures.push({
      gate: 'GATE_0',
      block: 'block1',
      name: 'Ownerless Hiring',
      description: 'Executive ownership absent - overall system compromised',
      impact: 'System-wide instability'
    });
    overallStatus = 'red';
  }
  
  // Gate 1: Block 2 RED → Governance failure
  if (blockStatuses.block2 === 'red') {
    gateFailures.push({
      gate: 'GATE_1',
      block: 'block2',
      name: 'Ungoverned TA',
      description: 'TA Leadership governance broken - execution will fail',
      impact: 'Hiring execution failure'
    });
    overallStatus = 'red';
  }
  
  // Gate 1: Block 4 RED → Financial failure
  if (blockStatuses.block4 === 'red') {
    gateFailures.push({
      gate: 'GATE_1',
      block: 'block4',
      name: 'Financial Opacity',
      description: 'Financial governance broken - costs uncontrolled',
      impact: 'Budget overruns, no predictability'
    });
    overallStatus = 'red';
  }
  
  // Execution blocks
  const executionBlockInfo = {
    block3: { name: 'Interview Bottleneck', impact: 'Candidates lost to slow process' },
    block5: { name: 'Evaluation Collapse', impact: 'False negatives, quality issues' },
    block6: { name: 'Operational Fragility', impact: 'Hero-based execution, key-person risk' }
  };
  
  for (const [blockId, info] of Object.entries(executionBlockInfo)) {
    if (blockStatuses[blockId] === 'red') {
      gateFailures.push({
        gate: 'EXECUTION',
        block: blockId,
        name: info.name,
        description: `${info.name} detected - execution at risk`,
        impact: info.impact
      });
      overallStatus = 'red';
    }
  }
  
  // If no RED, check for multiple YELLOWs
  if (overallStatus !== 'red') {
    const yellowCount = Object.values(blockStatuses).filter(s => s === 'yellow').length;
    if (yellowCount >= 2) {
      overallStatus = 'yellow';
    }
  }
  
  // Block 1 YELLOW amplification
  if (blockStatuses.block1 === 'yellow' && overallStatus === 'green') {
    const otherYellows = Object.entries(blockStatuses)
      .filter(([k, v]) => k !== 'block1' && v === 'yellow').length;
    if (otherYellows >= 1) {
      overallStatus = 'yellow';
    }
  }
  
  return { gateFailures, overallStatus };
}

/**
 * Run cross-validation checks
 * @param {Object} responses - Question ID to score mapping
 * @returns {Object} Contradictions and flags
 */
function runCrossValidation(responses) {
  const contradictions = [];
  const flags = [];
  
  for (const rule of CROSS_VALIDATION_RULES) {
    const sourceValue = responses[rule.source.question];
    const validatorValue = responses[rule.validator.question];
    
    // Skip if either value is missing
    if (sourceValue === undefined || sourceValue === null ||
        validatorValue === undefined || validatorValue === null) {
      continue;
    }
    
    // Skip "not relevant" responses
    if (sourceValue === -1 || validatorValue === -1) {
      continue;
    }
    
    // Evaluate conditions
    const sourceMatch = evaluateCondition(sourceValue, rule.source.operator, rule.source.value);
    const validatorMatch = evaluateCondition(validatorValue, rule.validator.operator, rule.validator.value);
    
    if (sourceMatch && validatorMatch) {
      contradictions.push({
        rule_id: rule.id,
        name: rule.name,
        severity: rule.severity,
        diagnosis: rule.diagnosis,
        source: {
          question: rule.source.question,
          value: sourceValue,
          expected: `${rule.source.operator} ${rule.source.value}`
        },
        validator: {
          question: rule.validator.question,
          value: validatorValue,
          expected: `${rule.validator.operator} ${rule.validator.value}`
        }
      });
      flags.push(rule.name);
    }
  }
  
  return { contradictions, flags };
}

/**
 * Helper to evaluate a condition
 */
function evaluateCondition(value, operator, target) {
  switch (operator) {
    case '>=': return value >= target;
    case '<=': return value <= target;
    case '>': return value > target;
    case '<': return value < target;
    case '==': return value === target;
    case '!=': return value !== target;
    default: return false;
  }
}

/**
 * Calculate Data Trust Coefficient based on Block 7
 * @param {string} block7Status - Status of Block 7
 * @returns {number} DTC value
 */
function calculateDTC(block7Status) {
  return SCORING_CONFIG.DTC[block7Status] || 1.0;
}

/**
 * Calculate confidence score
 * @param {Object} blockStatuses - Block statuses
 * @param {Array} gateFailures - Gate failures
 * @param {Array} contradictions - Cross-validation contradictions
 * @param {number} dtc - Data Trust Coefficient
 * @returns {number} Confidence score (0-100)
 */
function calculateConfidenceScore(blockStatuses, gateFailures, contradictions, dtc) {
  // Base score from block statuses
  const statusValues = Object.values(blockStatuses);
  const baseScores = statusValues.map(s => SCORING_CONFIG.STATUS_SCORES[s] || 50);
  let confidence = baseScores.reduce((a, b) => a + b, 0) / baseScores.length;
  
  // Deductions
  confidence -= contradictions.length * SCORING_CONFIG.CONTRADICTION_PENALTY;
  confidence -= gateFailures.length * SCORING_CONFIG.GATE_FAILURE_PENALTY;
  
  // Apply DTC
  confidence *= dtc;
  
  // Bounds
  return Math.max(0, Math.min(100, Math.round(confidence)));
}

/**
 * Select applicable recommendations based on audit results
 * @param {Object} blockStatuses - Block statuses
 * @param {Object} blockScores - Block scores
 * @param {Array} flags - Detected flags
 * @param {Object} responses - Raw responses
 * @returns {Array} Selected recommendation IDs with priority
 */
function selectRecommendations(blockStatuses, blockScores, flags, responses) {
  const selected = [];
  
  for (const [recId, trigger] of Object.entries(RECOMMENDATION_TRIGGERS)) {
    try {
      if (trigger.condition(blockStatuses, blockScores, flags, responses)) {
        selected.push({
          id: recId,
          name: trigger.risk_name,
          priority: trigger.priority
        });
      }
    } catch (e) {
      // Skip if condition evaluation fails
      console.warn(`Failed to evaluate ${recId}:`, e.message);
    }
  }
  
  // Sort by priority
  selected.sort((a, b) => a.priority - b.priority);
  
  return selected;
}

/**
 * Update overall status based on contradictions
 * @param {string} currentStatus - Current overall status
 * @param {Array} contradictions - Detected contradictions
 * @returns {string} Updated overall status
 */
function applyContradictionEscalation(currentStatus, contradictions) {
  // Force-red contradictions
  const forceRedCount = contradictions.filter(c => c.severity === 'force-red').length;
  if (forceRedCount > 0) {
    return 'red';
  }
  
  // Multiple hard contradictions escalate yellow to red
  const hardCount = contradictions.filter(c => c.severity === 'hard').length;
  if (hardCount >= 2 && currentStatus === 'yellow') {
    return 'red';
  }
  
  // Multiple soft contradictions escalate green to yellow
  const softCount = contradictions.filter(c => c.severity === 'soft').length;
  if (softCount >= 3 && currentStatus === 'green') {
    return 'yellow';
  }
  
  return currentStatus;
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Run complete audit scoring
 * @param {Object} input - Input data
 * @param {string} input.audit_id - Audit identifier
 * @param {Object} input.responses - Question ID to score mapping
 * @param {Object} [input.metadata] - Optional audit metadata
 * @returns {Object} Complete scoring results
 */
function runAuditScoring(input) {
  const { audit_id, responses, metadata = {} } = input;
  
  // Step 1: Calculate block scores
  const { blockScores, blockStatuses, blockDetails } = calculateBlockScores(responses);
  
  // Step 2: Apply gate rules
  const { gateFailures, overallStatus: gateStatus } = applyGateRules(blockStatuses);
  
  // Step 3: Run cross-validation
  const { contradictions, flags } = runCrossValidation(responses);
  
  // Step 4: Apply contradiction escalation
  const overallStatus = applyContradictionEscalation(gateStatus, contradictions);
  
  // Step 5: Calculate DTC
  const dtc = calculateDTC(blockStatuses.block7);
  
  // Step 6: Calculate confidence score
  const confidenceScore = calculateConfidenceScore(
    blockStatuses, gateFailures, contradictions, dtc
  );
  
  // Step 7: Select recommendations
  const selectedRecommendations = selectRecommendations(
    blockStatuses, blockScores, flags, responses
  );
  
  // Build summary
  const redBlocks = Object.entries(blockStatuses)
    .filter(([k, v]) => v === 'red')
    .map(([k]) => k);
  
  const yellowBlocks = Object.entries(blockStatuses)
    .filter(([k, v]) => v === 'yellow')
    .map(([k]) => k);
  
  const greenBlocks = Object.entries(blockStatuses)
    .filter(([k, v]) => v === 'green')
    .map(([k]) => k);
  
  return {
    audit_id,
    timestamp: new Date().toISOString(),
    metadata,
    
    // Scoring results
    block_scores: blockScores,
    block_statuses: blockStatuses,
    block_details: blockDetails,
    
    // Gate analysis
    gate_failures: gateFailures,
    
    // Cross-validation
    contradictions,
    flags,
    
    // Overall results
    overall_status: overallStatus,
    confidence_score: confidenceScore,
    data_trust_coefficient: dtc,
    
    // Recommendations
    selected_recommendations: selectedRecommendations,
    
    // Summary
    summary: {
      overall_status: overallStatus,
      confidence_score: confidenceScore,
      red_blocks: redBlocks,
      yellow_blocks: yellowBlocks,
      green_blocks: greenBlocks,
      gate_failure_count: gateFailures.length,
      contradiction_count: contradictions.length,
      recommendation_count: selectedRecommendations.length,
      dtc
    }
  };
}

// ============================================================================
// EXPORTS (for different environments)
// ============================================================================

// Node.js / CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAuditScoring,
    calculateBlockScores,
    applyGateRules,
    runCrossValidation,
    calculateConfidenceScore,
    selectRecommendations,
    SCORING_CONFIG,
    CRITICAL_QUESTIONS,
    CROSS_VALIDATION_RULES,
    RECOMMENDATION_TRIGGERS
  };
}

// ES Modules
if (typeof exports !== 'undefined') {
  exports.runAuditScoring = runAuditScoring;
  exports.calculateBlockScores = calculateBlockScores;
  exports.applyGateRules = applyGateRules;
  exports.runCrossValidation = runCrossValidation;
  exports.calculateConfidenceScore = calculateConfidenceScore;
  exports.selectRecommendations = selectRecommendations;
}

// Browser / Global
if (typeof window !== 'undefined') {
  window.HiringAuditScoring = {
    runAuditScoring,
    calculateBlockScores,
    applyGateRules,
    runCrossValidation,
    calculateConfidenceScore,
    selectRecommendations
  };
}

// n8n / Make.com usage
// In n8n Code node, use:
// const result = runAuditScoring({ audit_id: $json.audit_id, responses: $json.responses });
// return [{ json: result }];
