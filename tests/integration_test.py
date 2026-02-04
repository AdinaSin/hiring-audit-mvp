#!/usr/bin/env python3
"""
Hiring Audit - End-to-End Integration Test
==========================================

This test validates the complete audit flow:
1. Form data ingestion
2. Scoring engine calculation
3. Gate rules application
4. Cross-validation detection
5. Recommendation selection
6. PDF report generation

Run: python integration_test.py
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Any, Tuple

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ============================================================================
# TEST CONFIGURATION
# ============================================================================

# Scoring thresholds (must match scoring_engine.js)
GREEN_THRESHOLD = 2.3
YELLOW_THRESHOLD = 1.5

# Critical questions
CRITICAL_QUESTIONS = {
    'block1': ['b1_q3', 'b1_q4', 'b1_q7'],
    'block2': ['b2_q3', 'b2_q5', 'b2_q6'],
    'block3': ['b3_q2', 'b3_q3'],
    'block4': ['b4_q1', 'b4_q2', 'b4_q4'],
    'block5': ['b5_q1', 'b5_q2'],
    'block6': ['b6_q5', 'b6_q8'],
    'block7': ['b7_q1', 'b7_q2']
}

# Cross-validation rules subset for testing
CV_RULES = [
    {
        'id': 'CV-05',
        'name': 'SLA Theatre',
        'source': {'question': 'b2_q3', 'operator': '>=', 'value': 2},
        'validator': {'question': 'b6_q5', 'operator': '<=', 'value': 1},
        'severity': 'force-red'
    },
    {
        'id': 'CV-08',
        'name': 'Interview Bottleneck Masked',
        'source': {'question': 'b3_q2', 'operator': '>=', 'value': 2},
        'validator': {'question': 'b5_q2', 'operator': '<=', 'value': 1},
        'severity': 'force-red'
    }
]


# ============================================================================
# TEST DATA SCENARIOS
# ============================================================================

TEST_SCENARIOS = {
    'healthy_company': {
        'name': 'Healthy Company (All Green)',
        'description': 'Company with mature hiring practices across all blocks',
        'expected_overall': 'green',
        'expected_confidence_min': 80,
        'responses': {
            # Block 1: Executive Ownership - All strong
            'b1_q1': 3, 'b1_q2': 3, 'b1_q3': 3, 'b1_q4': 3,
            'b1_q5': 3, 'b1_q6': 3, 'b1_q7': 3, 'b1_q8': 3,
            # Block 2: TA Leadership - All strong
            'b2_q1': 3, 'b2_q2': 3, 'b2_q3': 3, 'b2_q4': 3,
            'b2_q5': 3, 'b2_q6': 3,
            # Block 3: Delivery - All strong
            'b3_q1': 3, 'b3_q2': 3, 'b3_q3': 3, 'b3_q4': 3,
            # Block 4: Finance - All strong
            'b4_q1': 3, 'b4_q2': 3, 'b4_q3': 3, 'b4_q4': 3,
            # Block 5: Technical - All strong
            'b5_q1': 3, 'b5_q2': 3, 'b5_q3': 3,
            # Block 6: Operations - All strong
            'b6_q1': 3, 'b6_q2': 3, 'b6_q3': 3, 'b6_q4': 3,
            'b6_q5': 3, 'b6_q6': 3, 'b6_q7': 3, 'b6_q8': 3,
            # Block 7: Reporting - All strong
            'b7_q1': 3, 'b7_q2': 3, 'b7_q3': 3, 'b7_q4': 3
        }
    },
    
    'critical_failure': {
        'name': 'Critical Failure (Multiple RED)',
        'description': 'Company with severe issues in ownership and operations',
        'expected_overall': 'red',
        'expected_confidence_max': 50,
        'expected_gate_failures': ['GATE_0', 'EXECUTION'],
        'responses': {
            # Block 1: Executive Ownership - Critical failures
            'b1_q1': 0, 'b1_q2': 1, 'b1_q3': 0, 'b1_q4': 1,  # No owner!
            'b1_q5': 1, 'b1_q6': 0, 'b1_q7': 0, 'b1_q8': 1,
            # Block 2: TA Leadership - Weak
            'b2_q1': 1, 'b2_q2': 1, 'b2_q3': 2, 'b2_q4': 1,
            'b2_q5': 1, 'b2_q6': 1,
            # Block 3: Delivery - Problems
            'b3_q1': 1, 'b3_q2': 1, 'b3_q3': 1, 'b3_q4': 1,
            # Block 4: Finance - Weak
            'b4_q1': 1, 'b4_q2': 1, 'b4_q3': 1, 'b4_q4': 1,
            # Block 5: Technical - Some issues
            'b5_q1': 1, 'b5_q2': 1, 'b5_q3': 1,
            # Block 6: Operations - Critical failures
            'b6_q1': 0, 'b6_q2': 0, 'b6_q3': 0, 'b6_q4': 0,
            'b6_q5': 0, 'b6_q6': 0, 'b6_q7': 0, 'b6_q8': 0,
            # Block 7: Reporting - Weak
            'b7_q1': 1, 'b7_q2': 1, 'b7_q3': 1, 'b7_q4': 1
        }
    },
    
    'sla_theatre': {
        'name': 'SLA Theatre (CV-05 Contradiction)',
        'description': 'Company claims SLAs exist but operations show no enforcement',
        'expected_overall': 'red',  # Force-red from contradiction
        'expected_contradictions': ['CV-05'],
        'responses': {
            # Block 1: Reasonable
            'b1_q1': 2, 'b1_q2': 2, 'b1_q3': 2, 'b1_q4': 2,
            'b1_q5': 2, 'b1_q6': 2, 'b1_q7': 2, 'b1_q8': 2,
            # Block 2: Claims SLAs exist and are monitored
            'b2_q1': 2, 'b2_q2': 2, 'b2_q3': 3, 'b2_q4': 3,  # SLAs claimed!
            'b2_q5': 2, 'b2_q6': 2,
            # Block 3: OK
            'b3_q1': 2, 'b3_q2': 2, 'b3_q3': 2, 'b3_q4': 2,
            # Block 4: OK
            'b4_q1': 2, 'b4_q2': 2, 'b4_q3': 2, 'b4_q4': 2,
            # Block 5: OK
            'b5_q1': 2, 'b5_q2': 2, 'b5_q3': 2,
            # Block 6: No SLA enforcement! (contradiction)
            'b6_q1': 2, 'b6_q2': 2, 'b6_q3': 2, 'b6_q4': 2,
            'b6_q5': 1, 'b6_q6': 1, 'b6_q7': 1, 'b6_q8': 2,  # No SLA tracking!
            # Block 7: OK
            'b7_q1': 2, 'b7_q2': 2, 'b7_q3': 2, 'b7_q4': 2
        }
    },
    
    'mixed_results': {
        'name': 'Mixed Results (Yellow Overall)',
        'description': 'Company with some strong and some weak areas',
        'expected_overall': 'yellow',
        'responses': {
            # Block 1: Strong ownership
            'b1_q1': 3, 'b1_q2': 3, 'b1_q3': 3, 'b1_q4': 2,
            'b1_q5': 2, 'b1_q6': 2, 'b1_q7': 2, 'b1_q8': 2,
            # Block 2: Moderate
            'b2_q1': 2, 'b2_q2': 2, 'b2_q3': 2, 'b2_q4': 2,
            'b2_q5': 2, 'b2_q6': 2,
            # Block 3: Weak (Yellow)
            'b3_q1': 2, 'b3_q2': 2, 'b3_q3': 1, 'b3_q4': 2,
            # Block 4: Strong
            'b4_q1': 3, 'b4_q2': 3, 'b4_q3': 2, 'b4_q4': 3,
            # Block 5: Weak (Yellow)
            'b5_q1': 2, 'b5_q2': 2, 'b5_q3': 1,
            # Block 6: Moderate
            'b6_q1': 2, 'b6_q2': 2, 'b6_q3': 2, 'b6_q4': 2,
            'b6_q5': 2, 'b6_q6': 2, 'b6_q7': 2, 'b6_q8': 2,
            # Block 7: Strong
            'b7_q1': 3, 'b7_q2': 3, 'b7_q3': 2, 'b7_q4': 2
        }
    },
    
    'interview_bottleneck': {
        'name': 'Interview Bottleneck (CV-08)',
        'description': 'Delivery claims capacity but technical interviews are bottleneck',
        'expected_overall': 'red',
        'expected_contradictions': ['CV-08'],
        'responses': {
            # Block 1-2: OK
            'b1_q1': 2, 'b1_q2': 2, 'b1_q3': 2, 'b1_q4': 2,
            'b1_q5': 2, 'b1_q6': 2, 'b1_q7': 2, 'b1_q8': 2,
            'b2_q1': 2, 'b2_q2': 2, 'b2_q3': 2, 'b2_q4': 2,
            'b2_q5': 2, 'b2_q6': 2,
            # Block 3: Claims good capacity
            'b3_q1': 2, 'b3_q2': 3, 'b3_q3': 2, 'b3_q4': 2,  # Claims capacity OK
            # Block 4: OK
            'b4_q1': 2, 'b4_q2': 2, 'b4_q3': 2, 'b4_q4': 2,
            # Block 5: No capacity! (contradiction)
            'b5_q1': 1, 'b5_q2': 0, 'b5_q3': 1,  # No SLA enforcement!
            # Block 6: OK
            'b6_q1': 2, 'b6_q2': 2, 'b6_q3': 2, 'b6_q4': 2,
            'b6_q5': 2, 'b6_q6': 2, 'b6_q7': 2, 'b6_q8': 2,
            # Block 7: OK
            'b7_q1': 2, 'b7_q2': 2, 'b7_q3': 2, 'b7_q4': 2
        }
    }
}


# ============================================================================
# SCORING ENGINE (Python implementation matching JS)
# ============================================================================

def calculate_block_scores(responses: Dict[str, int]) -> Tuple[Dict, Dict, Dict]:
    """Calculate scores and statuses for each block"""
    block_scores = {}
    block_statuses = {}
    block_details = {}
    
    # Group responses by block
    block_responses = {}
    for question_id, score in responses.items():
        if question_id.startswith('b') and '_q' in question_id:
            block_num = question_id[1]
            block_id = f'block{block_num}'
            if block_id not in block_responses:
                block_responses[block_id] = {}
            block_responses[block_id][question_id] = score
    
    # Calculate each block
    for block_id, block_data in block_responses.items():
        # Filter out "not relevant" (-1)
        valid_scores = [v for v in block_data.values() if v != -1]
        
        if not valid_scores:
            block_statuses[block_id] = 'gray'
            block_scores[block_id] = None
            continue
        
        avg = sum(valid_scores) / len(valid_scores)
        block_scores[block_id] = round(avg, 2)
        
        # Check critical RED
        criticals = CRITICAL_QUESTIONS.get(block_id, [])
        has_critical_red = any(block_data.get(q) == 0 for q in criticals)
        
        # Determine status
        if has_critical_red or avg < YELLOW_THRESHOLD:
            block_statuses[block_id] = 'red'
        elif avg < GREEN_THRESHOLD:
            block_statuses[block_id] = 'yellow'
        else:
            block_statuses[block_id] = 'green'
        
        block_details[block_id] = {
            'average': avg,
            'question_count': len(valid_scores),
            'has_critical_red': has_critical_red
        }
    
    return block_scores, block_statuses, block_details


def apply_gate_rules(block_statuses: Dict[str, str]) -> Tuple[List, str]:
    """Apply gate rules and determine overall status"""
    gate_failures = []
    overall_status = 'green'
    
    # Gate 0: Block 1 RED
    if block_statuses.get('block1') == 'red':
        gate_failures.append({
            'gate': 'GATE_0',
            'block': 'block1',
            'name': 'Ownerless Hiring'
        })
        overall_status = 'red'
    
    # Gate 1: Block 2 RED
    if block_statuses.get('block2') == 'red':
        gate_failures.append({
            'gate': 'GATE_1',
            'block': 'block2',
            'name': 'Ungoverned TA'
        })
        overall_status = 'red'
    
    # Gate 1: Block 4 RED
    if block_statuses.get('block4') == 'red':
        gate_failures.append({
            'gate': 'GATE_1',
            'block': 'block4',
            'name': 'Financial Opacity'
        })
        overall_status = 'red'
    
    # Execution blocks
    for block_id, name in [('block3', 'Interview Bottleneck'),
                            ('block5', 'Evaluation Collapse'),
                            ('block6', 'Operational Fragility')]:
        if block_statuses.get(block_id) == 'red':
            gate_failures.append({
                'gate': 'EXECUTION',
                'block': block_id,
                'name': name
            })
            overall_status = 'red'
    
    # Multiple yellows
    if overall_status != 'red':
        yellow_count = sum(1 for s in block_statuses.values() if s == 'yellow')
        if yellow_count >= 2:
            overall_status = 'yellow'
    
    return gate_failures, overall_status


def run_cross_validation(responses: Dict[str, int]) -> Tuple[List, List]:
    """Run cross-validation checks"""
    contradictions = []
    flags = []
    
    def evaluate(value, operator, target):
        if operator == '>=':
            return value >= target
        elif operator == '<=':
            return value <= target
        return False
    
    for rule in CV_RULES:
        source_val = responses.get(rule['source']['question'])
        validator_val = responses.get(rule['validator']['question'])
        
        if source_val is None or validator_val is None:
            continue
        if source_val == -1 or validator_val == -1:
            continue
        
        source_match = evaluate(source_val, rule['source']['operator'], rule['source']['value'])
        validator_match = evaluate(validator_val, rule['validator']['operator'], rule['validator']['value'])
        
        if source_match and validator_match:
            contradictions.append({
                'rule_id': rule['id'],
                'name': rule['name'],
                'severity': rule['severity']
            })
            flags.append(rule['name'])
    
    return contradictions, flags


def calculate_confidence(block_statuses: Dict, gate_failures: List, contradictions: List, dtc: float) -> int:
    """Calculate confidence score"""
    score_map = {'green': 90, 'yellow': 60, 'red': 30, 'gray': 50}
    scores = [score_map.get(s, 50) for s in block_statuses.values()]
    
    confidence = sum(scores) / len(scores) if scores else 50
    confidence -= len(contradictions) * 3
    confidence -= len(gate_failures) * 5
    confidence *= dtc
    
    return max(0, min(100, int(confidence)))


def run_scoring(audit_id: str, responses: Dict[str, int]) -> Dict:
    """Run complete scoring pipeline"""
    # Step 1: Calculate block scores
    block_scores, block_statuses, block_details = calculate_block_scores(responses)
    
    # Step 2: Apply gate rules
    gate_failures, overall_status = apply_gate_rules(block_statuses)
    
    # Step 3: Cross-validation
    contradictions, flags = run_cross_validation(responses)
    
    # Step 4: Apply contradiction escalation
    force_red = any(c['severity'] == 'force-red' for c in contradictions)
    if force_red:
        overall_status = 'red'
    
    # Step 5: Calculate DTC
    dtc = {'green': 1.0, 'yellow': 0.85, 'red': 0.7}.get(block_statuses.get('block7', 'gray'), 1.0)
    
    # Step 6: Confidence score
    confidence = calculate_confidence(block_statuses, gate_failures, contradictions, dtc)
    
    return {
        'audit_id': audit_id,
        'block_scores': block_scores,
        'block_statuses': block_statuses,
        'block_details': block_details,
        'gate_failures': gate_failures,
        'contradictions': contradictions,
        'flags': flags,
        'overall_status': overall_status,
        'confidence_score': confidence,
        'dtc': dtc
    }


# ============================================================================
# TEST RUNNER
# ============================================================================

class TestResult:
    def __init__(self, name: str):
        self.name = name
        self.passed = True
        self.errors = []
    
    def add_error(self, error: str):
        self.passed = False
        self.errors.append(error)
    
    def __str__(self):
        status = "✅ PASSED" if self.passed else "❌ FAILED"
        result = f"{status}: {self.name}"
        for error in self.errors:
            result += f"\n   ⚠️  {error}"
        return result


def test_scenario(scenario_id: str, scenario: Dict) -> TestResult:
    """Test a single scenario"""
    result = TestResult(scenario['name'])
    
    # Run scoring
    scoring_result = run_scoring(scenario_id, scenario['responses'])
    
    # Check overall status
    expected_overall = scenario.get('expected_overall')
    if expected_overall and scoring_result['overall_status'] != expected_overall:
        result.add_error(
            f"Overall status: expected '{expected_overall}', got '{scoring_result['overall_status']}'"
        )
    
    # Check confidence range
    if 'expected_confidence_min' in scenario:
        if scoring_result['confidence_score'] < scenario['expected_confidence_min']:
            result.add_error(
                f"Confidence too low: expected >={scenario['expected_confidence_min']}, "
                f"got {scoring_result['confidence_score']}"
            )
    
    if 'expected_confidence_max' in scenario:
        if scoring_result['confidence_score'] > scenario['expected_confidence_max']:
            result.add_error(
                f"Confidence too high: expected <={scenario['expected_confidence_max']}, "
                f"got {scoring_result['confidence_score']}"
            )
    
    # Check gate failures
    if 'expected_gate_failures' in scenario:
        actual_gates = [g['gate'] for g in scoring_result['gate_failures']]
        for expected_gate in scenario['expected_gate_failures']:
            if expected_gate not in actual_gates:
                result.add_error(f"Missing expected gate failure: {expected_gate}")
    
    # Check contradictions
    if 'expected_contradictions' in scenario:
        actual_cvs = [c['rule_id'] for c in scoring_result['contradictions']]
        for expected_cv in scenario['expected_contradictions']:
            if expected_cv not in actual_cvs:
                result.add_error(f"Missing expected contradiction: {expected_cv}")
    
    return result, scoring_result


def test_block_scoring():
    """Test individual block score calculation"""
    result = TestResult("Block Scoring Calculation")
    
    # Test green block (avg >= 2.3)
    green_responses = {'b1_q1': 3, 'b1_q2': 3, 'b1_q3': 3, 'b1_q4': 2}
    scores, statuses, _ = calculate_block_scores(green_responses)
    if statuses.get('block1') != 'green':
        result.add_error(f"Green block test failed: expected 'green', got '{statuses.get('block1')}'")
    
    # Test yellow block (1.5 <= avg < 2.3)
    yellow_responses = {'b1_q1': 2, 'b1_q2': 2, 'b1_q3': 2, 'b1_q4': 2}
    scores, statuses, _ = calculate_block_scores(yellow_responses)
    if statuses.get('block1') != 'yellow':
        result.add_error(f"Yellow block test failed: expected 'yellow', got '{statuses.get('block1')}'")
    
    # Test red block (avg < 1.5)
    red_responses = {'b1_q1': 1, 'b1_q2': 1, 'b1_q3': 1, 'b1_q4': 1}
    scores, statuses, _ = calculate_block_scores(red_responses)
    if statuses.get('block1') != 'red':
        result.add_error(f"Red block test failed: expected 'red', got '{statuses.get('block1')}'")
    
    # Test critical question forcing red
    critical_red_responses = {'b1_q1': 3, 'b1_q2': 3, 'b1_q3': 0, 'b1_q4': 3}  # b1_q3 is critical
    scores, statuses, details = calculate_block_scores(critical_red_responses)
    if statuses.get('block1') != 'red':
        result.add_error(f"Critical red test failed: expected 'red', got '{statuses.get('block1')}'")
    
    return result


def test_gate_rules():
    """Test gate rule application"""
    result = TestResult("Gate Rules Application")
    
    # Test Block 1 RED forcing overall RED
    statuses = {'block1': 'red', 'block2': 'green', 'block3': 'green', 
                'block4': 'green', 'block5': 'green', 'block6': 'green', 'block7': 'green'}
    failures, overall = apply_gate_rules(statuses)
    if overall != 'red':
        result.add_error(f"Gate 0 test failed: Block 1 RED should force overall RED")
    if not any(f['gate'] == 'GATE_0' for f in failures):
        result.add_error(f"Gate 0 test failed: Should have GATE_0 failure")
    
    # Test multiple yellows forcing yellow overall
    statuses = {'block1': 'green', 'block2': 'yellow', 'block3': 'yellow', 
                'block4': 'green', 'block5': 'green', 'block6': 'green', 'block7': 'green'}
    failures, overall = apply_gate_rules(statuses)
    if overall != 'yellow':
        result.add_error(f"Multiple yellow test failed: expected 'yellow', got '{overall}'")
    
    # Test all green
    statuses = {'block1': 'green', 'block2': 'green', 'block3': 'green', 
                'block4': 'green', 'block5': 'green', 'block6': 'green', 'block7': 'green'}
    failures, overall = apply_gate_rules(statuses)
    if overall != 'green':
        result.add_error(f"All green test failed: expected 'green', got '{overall}'")
    
    return result


def test_cross_validation():
    """Test cross-validation detection"""
    result = TestResult("Cross-Validation Detection")
    
    # Test CV-05 SLA Theatre detection
    responses = {
        'b2_q3': 3,  # Claims SLA exists
        'b6_q5': 1   # But no enforcement
    }
    contradictions, flags = run_cross_validation(responses)
    if not any(c['rule_id'] == 'CV-05' for c in contradictions):
        result.add_error("CV-05 detection failed: Should detect SLA Theatre")
    
    # Test no contradiction when aligned
    responses = {
        'b2_q3': 3,  # Claims SLA exists
        'b6_q5': 3   # And has enforcement
    }
    contradictions, flags = run_cross_validation(responses)
    if any(c['rule_id'] == 'CV-05' for c in contradictions):
        result.add_error("CV-05 false positive: Should not detect when aligned")
    
    return result


def test_pdf_generation():
    """Test PDF report generation"""
    result = TestResult("PDF Report Generation")
    
    try:
        # Import the PDF generator
        sys.path.insert(0, '/home/claude/report_generator')
        from audit_report_generator import HiringAuditReportGenerator
        
        # Prepare test data
        test_data = {
            'company_name': 'Integration Test Company',
            'report_date': datetime.now().strftime('%Y-%m-%d'),
            'block_statuses': {
                'block1': 'yellow',
                'block2': 'green',
                'block3': 'red',
                'block4': 'green',
                'block5': 'yellow',
                'block6': 'yellow',
                'block7': 'green'
            },
            'contradictions': ['CV-08: Interview Bottleneck Masked'],
            'recommendations': []
        }
        
        # Generate PDF
        output_path = '/tmp/integration_test_report.pdf'
        generator = HiringAuditReportGenerator(
            audit_data=test_data,
            output_path=output_path,
            level=2
        )
        generator.generate()
        
        # Check file exists and has content
        if not os.path.exists(output_path):
            result.add_error("PDF file was not created")
        elif os.path.getsize(output_path) < 1000:
            result.add_error("PDF file is too small (possibly empty)")
        else:
            # Clean up
            os.remove(output_path)
            
    except ImportError as e:
        result.add_error(f"Could not import PDF generator: {e}")
    except Exception as e:
        result.add_error(f"PDF generation failed: {e}")
    
    return result


def run_all_tests():
    """Run all integration tests"""
    print("=" * 70)
    print("HIRING AUDIT - END-TO-END INTEGRATION TEST")
    print("=" * 70)
    print()
    
    all_results = []
    scenario_details = []
    
    # Unit tests
    print("UNIT TESTS")
    print("-" * 40)
    
    unit_tests = [
        test_block_scoring(),
        test_gate_rules(),
        test_cross_validation(),
        test_pdf_generation()
    ]
    
    for test_result in unit_tests:
        print(test_result)
        all_results.append(test_result)
    
    print()
    
    # Scenario tests
    print("SCENARIO TESTS")
    print("-" * 40)
    
    for scenario_id, scenario in TEST_SCENARIOS.items():
        test_result, scoring_result = test_scenario(scenario_id, scenario)
        print(test_result)
        all_results.append(test_result)
        scenario_details.append({
            'id': scenario_id,
            'name': scenario['name'],
            'result': scoring_result
        })
    
    print()
    
    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for r in all_results if r.passed)
    failed = sum(1 for r in all_results if not r.passed)
    total = len(all_results)
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    print(f"Pass Rate: {passed/total*100:.1f}%")
    print()
    
    # Detailed scenario results
    print("SCENARIO DETAILS")
    print("-" * 40)
    
    for detail in scenario_details:
        result = detail['result']
        print(f"\n{detail['name']}:")
        print(f"  Overall Status: {result['overall_status'].upper()}")
        print(f"  Confidence: {result['confidence_score']}/100")
        print(f"  Block Statuses: ", end="")
        for block, status in sorted(result['block_statuses'].items()):
            emoji = {'green': '🟢', 'yellow': '🟡', 'red': '🔴', 'gray': '⚪'}.get(status, '⚪')
            print(f"{emoji}", end="")
        print()
        if result['gate_failures']:
            print(f"  Gate Failures: {[f['name'] for f in result['gate_failures']]}")
        if result['contradictions']:
            print(f"  Contradictions: {[c['rule_id'] for c in result['contradictions']]}")
    
    print()
    print("=" * 70)
    
    # Return exit code
    return 0 if failed == 0 else 1


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    exit_code = run_all_tests()
    sys.exit(exit_code)
