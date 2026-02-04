#!/usr/bin/env python3
"""
Hiring Audit - Full E2E Workflow Simulation
============================================

Simulates the complete audit workflow as it would run in production:
1. Form submission → JSON payload
2. Scoring API call
3. Recommendation selection
4. PDF generation
5. Result delivery

This can be used as a reference implementation or smoke test.
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, Any

# ============================================================================
# SIMULATED FORM SUBMISSION
# ============================================================================

def simulate_form_submission(audit_id: str, company_name: str, responses: Dict[str, int]) -> Dict:
    """
    Simulates what Tally/Typeform webhook would send
    """
    return {
        "event": "form_submission",
        "timestamp": datetime.now().isoformat(),
        "form_id": "hiring_audit_v1",
        "audit_id": audit_id,
        "metadata": {
            "company_name": company_name,
            "audit_tier": "standard",
            "buyer_email": "buyer@example.com"
        },
        "responses": responses
    }


# ============================================================================
# SCORING ENGINE (matches JS implementation)
# ============================================================================

SCORING_CONFIG = {
    'GREEN_THRESHOLD': 2.3,
    'YELLOW_THRESHOLD': 1.5,
    'STATUS_SCORES': {'green': 90, 'yellow': 60, 'red': 30, 'gray': 50},
    'DTC': {'green': 1.0, 'yellow': 0.85, 'red': 0.7}
}

CRITICAL_QUESTIONS = {
    'block1': ['b1_q3', 'b1_q4', 'b1_q7'],
    'block2': ['b2_q3', 'b2_q5', 'b2_q6'],
    'block3': ['b3_q2', 'b3_q3'],
    'block4': ['b4_q1', 'b4_q2', 'b4_q4'],
    'block5': ['b5_q1', 'b5_q2'],
    'block6': ['b6_q5', 'b6_q8'],
    'block7': ['b7_q1', 'b7_q2']
}

CV_RULES = [
    {'id': 'CV-01', 'name': 'Ownerless Hiring', 'source': {'q': 'b1_q3', 'op': '>=', 'v': 2}, 'validator': {'q': 'b6_q2', 'op': '<=', 'v': 1}, 'severity': 'force-red'},
    {'id': 'CV-05', 'name': 'SLA Theatre', 'source': {'q': 'b2_q3', 'op': '>=', 'v': 2}, 'validator': {'q': 'b6_q5', 'op': '<=', 'v': 1}, 'severity': 'force-red'},
    {'id': 'CV-08', 'name': 'Interview Bottleneck Masked', 'source': {'q': 'b3_q2', 'op': '>=', 'v': 2}, 'validator': {'q': 'b5_q2', 'op': '<=', 'v': 1}, 'severity': 'force-red'},
]

RECOMMENDATIONS = {
    'B1-R01': {'name': 'Ownerless Hiring', 'trigger': lambda s, r: s.get('block1') == 'red', 
               'quick_wins': [{'text': 'Designate interim hiring owner', 'owner': 'CEO', 'effort': '1 day'}]},
    'B2-R03': {'name': 'Capacity Blindness', 'trigger': lambda s, r: s.get('block2') in ['red', 'yellow'],
               'quick_wins': [{'text': 'Count active roles per recruiter', 'owner': 'TA Lead', 'effort': '2 hours'}]},
    'B3-R01': {'name': 'Interview Bottleneck', 'trigger': lambda s, r: s.get('block3') == 'red',
               'quick_wins': [{'text': 'Block interview slots for key interviewers', 'owner': 'Delivery', 'effort': '1 day'}]},
    'B6-R01': {'name': 'Operational Fragility', 'trigger': lambda s, r: s.get('block6') == 'red',
               'quick_wins': [{'text': 'Document current hiring process', 'owner': 'TA Ops', 'effort': '1 day'}]},
}


def process_scoring(payload: Dict) -> Dict:
    """
    Simulates scoring API endpoint
    """
    responses = payload.get('responses', {})
    
    # Calculate block scores
    block_scores = {}
    block_statuses = {}
    
    for block_num in range(1, 8):
        block_id = f'block{block_num}'
        block_responses = {k: v for k, v in responses.items() 
                          if k.startswith(f'b{block_num}_') and v != -1}
        
        if not block_responses:
            block_statuses[block_id] = 'gray'
            continue
        
        avg = sum(block_responses.values()) / len(block_responses)
        block_scores[block_id] = round(avg, 2)
        
        criticals = CRITICAL_QUESTIONS.get(block_id, [])
        has_critical_red = any(responses.get(q) == 0 for q in criticals)
        
        if has_critical_red or avg < SCORING_CONFIG['YELLOW_THRESHOLD']:
            block_statuses[block_id] = 'red'
        elif avg < SCORING_CONFIG['GREEN_THRESHOLD']:
            block_statuses[block_id] = 'yellow'
        else:
            block_statuses[block_id] = 'green'
    
    # Gate rules
    gate_failures = []
    overall = 'green'
    
    if block_statuses.get('block1') == 'red':
        gate_failures.append({'gate': 'GATE_0', 'name': 'Ownerless Hiring'})
        overall = 'red'
    
    for block_id, name in [('block2', 'Ungoverned TA'), ('block4', 'Financial Opacity')]:
        if block_statuses.get(block_id) == 'red':
            gate_failures.append({'gate': 'GATE_1', 'name': name})
            overall = 'red'
    
    for block_id, name in [('block3', 'Interview Bottleneck'), ('block5', 'Evaluation Collapse'), ('block6', 'Operational Fragility')]:
        if block_statuses.get(block_id) == 'red':
            gate_failures.append({'gate': 'EXECUTION', 'name': name})
            overall = 'red'
    
    if overall != 'red':
        yellow_count = sum(1 for s in block_statuses.values() if s == 'yellow')
        if yellow_count >= 2:
            overall = 'yellow'
    
    # Cross-validation
    contradictions = []
    
    def check(val, op, target):
        if op == '>=': return val >= target
        if op == '<=': return val <= target
        return False
    
    for rule in CV_RULES:
        src = responses.get(rule['source']['q'])
        val = responses.get(rule['validator']['q'])
        if src is not None and val is not None and src != -1 and val != -1:
            if check(src, rule['source']['op'], rule['source']['v']) and \
               check(val, rule['validator']['op'], rule['validator']['v']):
                contradictions.append({'id': rule['id'], 'name': rule['name'], 'severity': rule['severity']})
                if rule['severity'] == 'force-red':
                    overall = 'red'
    
    # DTC
    dtc = SCORING_CONFIG['DTC'].get(block_statuses.get('block7', 'gray'), 1.0)
    
    # Confidence
    scores = [SCORING_CONFIG['STATUS_SCORES'].get(s, 50) for s in block_statuses.values()]
    confidence = sum(scores) / len(scores) if scores else 50
    confidence -= len(contradictions) * 3
    confidence -= len(gate_failures) * 5
    confidence *= dtc
    confidence = max(0, min(100, int(confidence)))
    
    return {
        'audit_id': payload.get('audit_id'),
        'block_scores': block_scores,
        'block_statuses': block_statuses,
        'gate_failures': gate_failures,
        'contradictions': contradictions,
        'overall_status': overall,
        'confidence_score': confidence,
        'dtc': dtc
    }


def select_recommendations(scoring_result: Dict) -> Dict:
    """
    Simulates recommendation selection API
    """
    statuses = scoring_result.get('block_statuses', {})
    responses = {}  # Would come from original payload
    
    selected = []
    for rec_id, rec in RECOMMENDATIONS.items():
        try:
            if rec['trigger'](statuses, responses):
                selected.append({
                    'id': rec_id,
                    'name': rec['name'],
                    'quick_wins': rec['quick_wins']
                })
        except:
            pass
    
    return {
        **scoring_result,
        'recommendations': selected
    }


def generate_report_data(scoring_result: Dict, metadata: Dict) -> Dict:
    """
    Prepares data for PDF generation
    """
    return {
        'company_name': metadata.get('company_name', 'Unknown Company'),
        'report_date': datetime.now().strftime('%Y-%m-%d'),
        'audit_tier': metadata.get('audit_tier', 'standard'),
        'block_statuses': scoring_result.get('block_statuses', {}),
        'block_scores': scoring_result.get('block_scores', {}),
        'overall_status': scoring_result.get('overall_status', 'yellow'),
        'confidence_score': scoring_result.get('confidence_score', 50),
        'gate_failures': scoring_result.get('gate_failures', []),
        'contradictions': [c['name'] for c in scoring_result.get('contradictions', [])],
        'recommendations': scoring_result.get('recommendations', [])
    }


# ============================================================================
# WORKFLOW SIMULATION
# ============================================================================

def run_e2e_workflow(audit_id: str, company_name: str, responses: Dict[str, int], 
                     generate_pdf: bool = False, output_dir: str = '/tmp') -> Dict:
    """
    Run complete E2E workflow
    """
    print(f"\n{'='*60}")
    print(f"E2E WORKFLOW: {audit_id}")
    print(f"{'='*60}")
    
    # Step 1: Form submission
    print("\n📝 Step 1: Simulating form submission...")
    form_payload = simulate_form_submission(audit_id, company_name, responses)
    print(f"   Received {len(responses)} responses")
    
    # Step 2: Scoring
    print("\n⚙️  Step 2: Running scoring engine...")
    scoring_result = process_scoring(form_payload)
    print(f"   Overall Status: {scoring_result['overall_status'].upper()}")
    print(f"   Confidence: {scoring_result['confidence_score']}/100")
    print(f"   Gate Failures: {len(scoring_result['gate_failures'])}")
    print(f"   Contradictions: {len(scoring_result['contradictions'])}")
    
    # Step 3: Recommendations
    print("\n💡 Step 3: Selecting recommendations...")
    with_recs = select_recommendations(scoring_result)
    print(f"   Selected {len(with_recs['recommendations'])} recommendations")
    
    # Step 4: Report data
    print("\n📊 Step 4: Preparing report data...")
    report_data = generate_report_data(with_recs, form_payload['metadata'])
    
    # Step 5: PDF generation (optional)
    pdf_path = None
    if generate_pdf:
        print("\n📄 Step 5: Generating PDF report...")
        try:
            sys.path.insert(0, '/home/claude/report_generator')
            from audit_report_generator import HiringAuditReportGenerator
            
            level = {'lite': 1, 'standard': 2, 'premium': 3}.get(
                form_payload['metadata'].get('audit_tier'), 2
            )
            
            pdf_path = os.path.join(output_dir, f'{audit_id}_report.pdf')
            generator = HiringAuditReportGenerator(
                audit_data=report_data,
                output_path=pdf_path,
                level=level
            )
            generator.generate()
            print(f"   ✅ PDF generated: {pdf_path}")
        except Exception as e:
            print(f"   ❌ PDF generation failed: {e}")
    
    # Summary
    print(f"\n{'='*60}")
    print("WORKFLOW COMPLETE")
    print(f"{'='*60}")
    
    # Block status visualization
    print("\nBlock Status Map:")
    status_emoji = {'green': '🟢', 'yellow': '🟡', 'red': '🔴', 'gray': '⚪'}
    for i in range(1, 8):
        block_id = f'block{i}'
        status = scoring_result['block_statuses'].get(block_id, 'gray')
        score = scoring_result['block_scores'].get(block_id, 'N/A')
        print(f"  {status_emoji[status]} Block {i}: {status.upper():8} (score: {score})")
    
    if scoring_result['gate_failures']:
        print("\n⚠️  Gate Failures:")
        for gf in scoring_result['gate_failures']:
            print(f"     - {gf['gate']}: {gf['name']}")
    
    if scoring_result['contradictions']:
        print("\n🔍 Contradictions Detected:")
        for c in scoring_result['contradictions']:
            print(f"     - {c['id']}: {c['name']}")
    
    if with_recs['recommendations']:
        print("\n💡 Recommendations:")
        for rec in with_recs['recommendations']:
            print(f"     - {rec['name']}")
            for qw in rec.get('quick_wins', []):
                print(f"       → {qw['text']} ({qw['owner']}, {qw['effort']})")
    
    return {
        'audit_id': audit_id,
        'form_payload': form_payload,
        'scoring_result': scoring_result,
        'recommendations': with_recs['recommendations'],
        'report_data': report_data,
        'pdf_path': pdf_path
    }


# ============================================================================
# TEST SCENARIOS
# ============================================================================

SCENARIOS = {
    'startup_chaos': {
        'company': 'FastGrow Startup',
        'description': 'Fast-growing startup with chaotic hiring',
        'responses': {
            'b1_q1': 1, 'b1_q2': 1, 'b1_q3': 1, 'b1_q4': 1,
            'b1_q5': 1, 'b1_q6': 1, 'b1_q7': 0, 'b1_q8': 1,
            'b2_q1': 1, 'b2_q2': 1, 'b2_q3': 1, 'b2_q4': 1,
            'b2_q5': 1, 'b2_q6': 1,
            'b3_q1': 1, 'b3_q2': 1, 'b3_q3': 1, 'b3_q4': 1,
            'b4_q1': 0, 'b4_q2': 1, 'b4_q3': 1, 'b4_q4': 1,
            'b5_q1': 1, 'b5_q2': 1, 'b5_q3': 1,
            'b6_q1': 1, 'b6_q2': 1, 'b6_q3': 1, 'b6_q4': 0,
            'b6_q5': 1, 'b6_q6': 1, 'b6_q7': 1, 'b6_q8': 1,
            'b7_q1': 1, 'b7_q2': 1, 'b7_q3': 1, 'b7_q4': 1
        }
    },
    'enterprise_mature': {
        'company': 'BigCorp Enterprise',
        'description': 'Large enterprise with mature processes',
        'responses': {
            'b1_q1': 3, 'b1_q2': 3, 'b1_q3': 3, 'b1_q4': 3,
            'b1_q5': 3, 'b1_q6': 2, 'b1_q7': 3, 'b1_q8': 3,
            'b2_q1': 3, 'b2_q2': 3, 'b2_q3': 3, 'b2_q4': 3,
            'b2_q5': 3, 'b2_q6': 3,
            'b3_q1': 3, 'b3_q2': 3, 'b3_q3': 2, 'b3_q4': 3,
            'b4_q1': 3, 'b4_q2': 3, 'b4_q3': 3, 'b4_q4': 3,
            'b5_q1': 3, 'b5_q2': 3, 'b5_q3': 3,
            'b6_q1': 3, 'b6_q2': 3, 'b6_q3': 3, 'b6_q4': 3,
            'b6_q5': 3, 'b6_q6': 3, 'b6_q7': 3, 'b6_q8': 3,
            'b7_q1': 3, 'b7_q2': 3, 'b7_q3': 3, 'b7_q4': 3
        }
    },
    'midsize_growing': {
        'company': 'GrowthCo',
        'description': 'Midsize company with growing pains',
        'responses': {
            'b1_q1': 2, 'b1_q2': 2, 'b1_q3': 2, 'b1_q4': 2,
            'b1_q5': 2, 'b1_q6': 2, 'b1_q7': 2, 'b1_q8': 2,
            'b2_q1': 2, 'b2_q2': 2, 'b2_q3': 2, 'b2_q4': 2,
            'b2_q5': 2, 'b2_q6': 2,
            'b3_q1': 2, 'b3_q2': 2, 'b3_q3': 1, 'b3_q4': 2,
            'b4_q1': 2, 'b4_q2': 2, 'b4_q3': 2, 'b4_q4': 2,
            'b5_q1': 2, 'b5_q2': 1, 'b5_q3': 2,
            'b6_q1': 2, 'b6_q2': 2, 'b6_q3': 2, 'b6_q4': 2,
            'b6_q5': 2, 'b6_q6': 2, 'b6_q7': 2, 'b6_q8': 2,
            'b7_q1': 2, 'b7_q2': 2, 'b7_q3': 2, 'b7_q4': 2
        }
    }
}


# ============================================================================
# MAIN
# ============================================================================

def main():
    print("\n" + "=" * 70)
    print("HIRING AUDIT - FULL E2E WORKFLOW SIMULATION")
    print("=" * 70)
    
    results = []
    
    for scenario_id, scenario in SCENARIOS.items():
        result = run_e2e_workflow(
            audit_id=f"E2E-{scenario_id.upper()}-001",
            company_name=scenario['company'],
            responses=scenario['responses'],
            generate_pdf=True,
            output_dir='/tmp'
        )
        results.append(result)
    
    # Final summary
    print("\n" + "=" * 70)
    print("ALL WORKFLOWS COMPLETED")
    print("=" * 70)
    
    print("\nResults Summary:")
    print("-" * 50)
    for result in results:
        scoring = result['scoring_result']
        status_emoji = {'green': '🟢', 'yellow': '🟡', 'red': '🔴'}[scoring['overall_status']]
        print(f"{status_emoji} {result['audit_id']}: {scoring['overall_status'].upper()} ({scoring['confidence_score']}/100)")
        if result['pdf_path']:
            print(f"   PDF: {result['pdf_path']}")
    
    # Export results as JSON
    export_path = '/tmp/e2e_results.json'
    with open(export_path, 'w') as f:
        # Remove non-serializable items
        export_data = []
        for r in results:
            export_data.append({
                'audit_id': r['audit_id'],
                'scoring': r['scoring_result'],
                'recommendations': r['recommendations'],
                'pdf_path': r['pdf_path']
            })
        json.dump(export_data, f, indent=2)
    print(f"\n📁 Results exported to: {export_path}")
    
    return results


if __name__ == '__main__':
    main()
