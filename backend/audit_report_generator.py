#!/usr/bin/env python3
"""
Hiring Execution & Talent Efficiency Audit
PDF Report Generator v1.0

Generates Level 1, 2, and 3 audit reports from JSON input data.
"""

import json
import os
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Line
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.pdfgen import canvas


# ============================================================================
# COLOR SCHEME
# ============================================================================

class AuditColors:
    """Professional color palette for audit reports"""
    PRIMARY = colors.HexColor('#1e3a5f')      # Dark blue
    SECONDARY = colors.HexColor('#2d5a87')    # Medium blue
    ACCENT = colors.HexColor('#4a90c2')       # Light blue
    
    GREEN = colors.HexColor('#10B981')        # Healthy
    YELLOW = colors.HexColor('#F59E0B')       # At Risk
    RED = colors.HexColor('#EF4444')          # Critical
    GRAY = colors.HexColor('#6B7280')         # Neutral
    
    TEXT_PRIMARY = colors.HexColor('#1f2937')
    TEXT_SECONDARY = colors.HexColor('#6b7280')
    BACKGROUND = colors.HexColor('#f8fafc')
    WHITE = colors.white
    BLACK = colors.black


# ============================================================================
# CUSTOM STYLES
# ============================================================================

def get_custom_styles():
    """Create custom paragraph styles for the report"""
    styles = getSampleStyleSheet()
    
    # Title styles
    styles.add(ParagraphStyle(
        name='ReportTitle',
        parent=styles['Title'],
        fontSize=28,
        textColor=AuditColors.PRIMARY,
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='ReportSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=AuditColors.TEXT_SECONDARY,
        spaceAfter=20,
        alignment=TA_CENTER
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=AuditColors.PRIMARY,
        spaceBefore=20,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='SubsectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=AuditColors.SECONDARY,
        spaceBefore=15,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='AuditBodyText',
        parent=styles['Normal'],
        fontSize=10,
        textColor=AuditColors.TEXT_PRIMARY,
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='BlockTitle',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=AuditColors.PRIMARY,
        spaceBefore=10,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='RiskText',
        parent=styles['Normal'],
        fontSize=10,
        textColor=AuditColors.TEXT_PRIMARY,
        leftIndent=20,
        spaceAfter=4
    ))
    
    styles.add(ParagraphStyle(
        name='RecommendationText',
        parent=styles['Normal'],
        fontSize=10,
        textColor=AuditColors.TEXT_PRIMARY,
        leftIndent=15,
        spaceAfter=6,
        bulletIndent=5
    ))
    
    styles.add(ParagraphStyle(
        name='FooterText',
        parent=styles['Normal'],
        fontSize=8,
        textColor=AuditColors.TEXT_SECONDARY,
        alignment=TA_CENTER
    ))
    
    styles.add(ParagraphStyle(
        name='CriticalRisk',
        parent=styles['Normal'],
        fontSize=10,
        textColor=AuditColors.RED,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='WarningRisk',
        parent=styles['Normal'],
        fontSize=10,
        textColor=AuditColors.YELLOW,
        fontName='Helvetica-Bold'
    ))
    
    return styles


# ============================================================================
# STATUS BADGE DRAWING
# ============================================================================

def create_status_badge(status, width=80, height=25):
    """Create a colored status badge"""
    d = Drawing(width, height)
    
    color_map = {
        'green': AuditColors.GREEN,
        'yellow': AuditColors.YELLOW,
        'red': AuditColors.RED,
        'gray': AuditColors.GRAY
    }
    
    label_map = {
        'green': 'HEALTHY',
        'yellow': 'AT RISK',
        'red': 'CRITICAL',
        'gray': 'PENDING'
    }
    
    bg_color = color_map.get(status, AuditColors.GRAY)
    label = label_map.get(status, 'UNKNOWN')
    
    # Background rectangle with rounded corners effect
    rect = Rect(0, 0, width, height, rx=4, ry=4)
    rect.fillColor = bg_color
    rect.strokeColor = None
    d.add(rect)
    
    # Label text
    text = String(width/2, height/2 - 4, label)
    text.textAnchor = 'middle'
    text.fontSize = 9
    text.fontName = 'Helvetica-Bold'
    text.fillColor = AuditColors.WHITE
    d.add(text)
    
    return d


def create_score_indicator(score, max_score=100, width=200, height=30):
    """Create a horizontal score bar"""
    d = Drawing(width, height)
    
    # Background bar
    bg = Rect(0, 10, width, 10)
    bg.fillColor = colors.HexColor('#e5e7eb')
    bg.strokeColor = None
    d.add(bg)
    
    # Score bar
    score_width = (score / max_score) * width
    if score >= 80:
        bar_color = AuditColors.GREEN
    elif score >= 60:
        bar_color = AuditColors.YELLOW
    else:
        bar_color = AuditColors.RED
    
    score_bar = Rect(0, 10, score_width, 10)
    score_bar.fillColor = bar_color
    score_bar.strokeColor = None
    d.add(score_bar)
    
    # Score text
    score_text = String(width + 10, 12, f"{score}")
    score_text.fontSize = 12
    score_text.fontName = 'Helvetica-Bold'
    score_text.fillColor = bar_color
    d.add(score_text)
    
    return d


# ============================================================================
# HEADER/FOOTER
# ============================================================================

class AuditReportTemplate:
    """Custom page template with header and footer"""
    
    def __init__(self, company_name, report_date, audit_level):
        self.company_name = company_name
        self.report_date = report_date
        self.audit_level = audit_level
    
    def header_footer(self, canvas, doc):
        canvas.saveState()
        
        # Header
        canvas.setFillColor(AuditColors.PRIMARY)
        canvas.rect(0, doc.height + doc.topMargin + 20, doc.width + doc.leftMargin + doc.rightMargin, 40, fill=1, stroke=0)
        
        canvas.setFillColor(AuditColors.WHITE)
        canvas.setFont('Helvetica-Bold', 10)
        canvas.drawString(doc.leftMargin, doc.height + doc.topMargin + 35, "HIRING EXECUTION AUDIT")
        
        canvas.setFont('Helvetica', 9)
        canvas.drawRightString(doc.width + doc.leftMargin, doc.height + doc.topMargin + 35, self.company_name)
        
        # Footer
        canvas.setFillColor(AuditColors.TEXT_SECONDARY)
        canvas.setFont('Helvetica', 8)
        canvas.drawString(doc.leftMargin, 25, f"Level {self.audit_level} Report | {self.report_date}")
        canvas.drawRightString(doc.width + doc.leftMargin, 25, f"Page {doc.page}")
        
        # Footer line
        canvas.setStrokeColor(AuditColors.GRAY)
        canvas.line(doc.leftMargin, 35, doc.width + doc.leftMargin, 35)
        
        canvas.restoreState()


# ============================================================================
# REPORT GENERATOR CLASS
# ============================================================================

class HiringAuditReportGenerator:
    """Main class for generating audit reports"""
    
    def __init__(self, audit_data, output_path, level=1):
        """
        Initialize the report generator
        
        Args:
            audit_data: dict with audit results
            output_path: path for the output PDF
            level: 1, 2, or 3 for report depth
        """
        self.data = audit_data
        self.output_path = output_path
        self.level = level
        self.styles = get_custom_styles()
        self.elements = []
        
        # Extract key data
        self.company_name = audit_data.get('company_name', 'Company Name')
        self.report_date = audit_data.get('report_date', datetime.now().strftime('%Y-%m-%d'))
        self.block_statuses = audit_data.get('block_statuses', {})
        self.responses = audit_data.get('responses', {})
        self.contradictions = audit_data.get('contradictions', [])
        self.recommendations = audit_data.get('recommendations', [])
    
    def generate(self):
        """Generate the complete PDF report"""
        # Create document
        doc = SimpleDocTemplate(
            self.output_path,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=70,
            bottomMargin=50
        )
        
        template = AuditReportTemplate(self.company_name, self.report_date, self.level)
        
        # Build content
        self._add_cover_page()
        self._add_executive_summary()
        self._add_block_overview()
        
        if self.level >= 2:
            self._add_detailed_findings()
            self._add_recommendations()
        
        if self.level >= 3:
            self._add_implementation_roadmap()
            self._add_appendices()
        
        self._add_disclaimer()
        
        # Build PDF
        doc.build(self.elements, onFirstPage=template.header_footer, onLaterPages=template.header_footer)
        
        return self.output_path
    
    def _add_cover_page(self):
        """Add the cover page"""
        self.elements.append(Spacer(1, 100))
        
        # Main title
        self.elements.append(Paragraph(
            "Hiring Execution &<br/>Talent Efficiency Audit",
            self.styles['ReportTitle']
        ))
        
        self.elements.append(Spacer(1, 20))
        
        # Company name
        self.elements.append(Paragraph(
            self.company_name,
            self.styles['ReportSubtitle']
        ))
        
        self.elements.append(Spacer(1, 10))
        
        # Report level and date
        level_names = {1: 'Diagnostic Report', 2: 'Diagnostic + Design Report', 3: 'Full Assessment Report'}
        self.elements.append(Paragraph(
            f"Level {self.level}: {level_names.get(self.level, 'Report')}",
            self.styles['ReportSubtitle']
        ))
        
        self.elements.append(Paragraph(
            self.report_date,
            self.styles['ReportSubtitle']
        ))
        
        self.elements.append(Spacer(1, 60))
        
        # Overall health indicator
        overall_status = self._calculate_overall_status()
        overall_score = self._calculate_overall_score()
        
        # Status table
        status_data = [
            ['OVERALL HIRING HEALTH', ''],
            ['Status', ''],
            ['Confidence Score', f'{overall_score}/100']
        ]
        
        status_table = Table(status_data, colWidths=[200, 150])
        status_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), AuditColors.PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), AuditColors.WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, AuditColors.GRAY),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        
        self.elements.append(status_table)
        self.elements.append(PageBreak())
    
    def _add_executive_summary(self):
        """Add executive summary section"""
        self.elements.append(Paragraph("Executive Summary", self.styles['SectionHeader']))
        self.elements.append(HRFlowable(width="100%", thickness=2, color=AuditColors.PRIMARY))
        self.elements.append(Spacer(1, 15))
        
        # Summary text
        overall_status = self._calculate_overall_status()
        red_count = sum(1 for s in self.block_statuses.values() if s == 'red')
        yellow_count = sum(1 for s in self.block_statuses.values() if s == 'yellow')
        
        if overall_status == 'red':
            summary = f"""
            The audit identified <b>critical structural issues</b> in {self.company_name}'s hiring execution system. 
            {red_count} out of 7 audit blocks show RED status, indicating systemic failures that require immediate attention.
            Without intervention, hiring outcomes will remain unpredictable and costly.
            """
        elif overall_status == 'yellow':
            summary = f"""
            The audit identified <b>moderate risks</b> in {self.company_name}'s hiring execution system.
            While foundational elements exist, {yellow_count} blocks show AT RISK status with inconsistent execution.
            Targeted improvements can significantly enhance hiring efficiency within 90 days.
            """
        else:
            summary = f"""
            {self.company_name}'s hiring execution system demonstrates <b>healthy fundamentals</b> across most dimensions.
            Continue monitoring key metrics and address minor gaps identified in this report to maintain performance.
            """
        
        self.elements.append(Paragraph(summary, self.styles['AuditBodyText']))
        self.elements.append(Spacer(1, 20))
        
        # Key findings
        self.elements.append(Paragraph("Key Findings", self.styles['SubsectionHeader']))
        
        findings = self._generate_key_findings()
        for finding in findings[:5]:  # Top 5 findings
            bullet = f"• {finding}"
            self.elements.append(Paragraph(bullet, self.styles['AuditBodyText']))
        
        self.elements.append(Spacer(1, 20))
        
        # Top risks
        self.elements.append(Paragraph("Priority Risks", self.styles['SubsectionHeader']))
        
        risks = self._get_priority_risks()
        for risk in risks[:3]:  # Top 3 risks
            risk_style = self.styles['CriticalRisk'] if risk['severity'] == 'red' else self.styles['WarningRisk']
            self.elements.append(Paragraph(f"⚠ {risk['name']}: {risk['impact']}", risk_style))
            self.elements.append(Spacer(1, 5))
        
        self.elements.append(PageBreak())
    
    def _add_block_overview(self):
        """Add block-by-block status overview"""
        self.elements.append(Paragraph("Audit Block Overview", self.styles['SectionHeader']))
        self.elements.append(HRFlowable(width="100%", thickness=2, color=AuditColors.PRIMARY))
        self.elements.append(Spacer(1, 15))
        
        block_info = {
            'block1': {'name': 'Block 1: Executive Ownership', 'role': 'GATEKEEPER'},
            'block2': {'name': 'Block 2: TA Leadership', 'role': 'EXECUTION BRAIN'},
            'block3': {'name': 'Block 3: Delivery Leadership', 'role': 'DEMAND INTEGRITY'},
            'block4': {'name': 'Block 4: Financial Governance', 'role': 'COST CONTROL'},
            'block5': {'name': 'Block 5: Technical Interviewing', 'role': 'BOTTLENECK LAYER'},
            'block6': {'name': 'Block 6: Recruitment Operations', 'role': 'STABILITY FOUNDATION'},
            'block7': {'name': 'Block 7: Reporting & AI', 'role': 'SYSTEMIC MULTIPLIER'}
        }
        
        # Status table
        table_data = [['Block', 'Function', 'Status', 'Key Signal']]
        
        for block_id, info in block_info.items():
            status = self.block_statuses.get(block_id, 'gray')
            status_text = {'green': '● HEALTHY', 'yellow': '● AT RISK', 'red': '● CRITICAL', 'gray': '○ PENDING'}.get(status, '○')
            signal = self._get_block_signal(block_id)
            table_data.append([info['name'], info['role'], status_text, signal])
        
        table = Table(table_data, colWidths=[150, 120, 80, 130])
        
        # Apply styling with conditional colors
        style_commands = [
            ('BACKGROUND', (0, 0), (-1, 0), AuditColors.PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), AuditColors.WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (2, 0), (2, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, AuditColors.GRAY),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]
        
        # Add row colors based on status
        for i, block_id in enumerate(block_info.keys(), 1):
            status = self.block_statuses.get(block_id, 'gray')
            if status == 'red':
                style_commands.append(('TEXTCOLOR', (2, i), (2, i), AuditColors.RED))
            elif status == 'yellow':
                style_commands.append(('TEXTCOLOR', (2, i), (2, i), AuditColors.YELLOW))
            elif status == 'green':
                style_commands.append(('TEXTCOLOR', (2, i), (2, i), AuditColors.GREEN))
        
        table.setStyle(TableStyle(style_commands))
        self.elements.append(table)
        
        self.elements.append(Spacer(1, 20))
        
        # Gate failures explanation
        gate_failures = self._check_gate_failures()
        if gate_failures:
            self.elements.append(Paragraph("⚠ Gate Failures Detected", self.styles['SubsectionHeader']))
            for failure in gate_failures:
                self.elements.append(Paragraph(f"• {failure}", self.styles['CriticalRisk']))
            self.elements.append(Spacer(1, 10))
        
        # Contradictions
        if self.contradictions:
            self.elements.append(Paragraph("Cross-Validation Contradictions", self.styles['SubsectionHeader']))
            for contradiction in self.contradictions[:5]:
                self.elements.append(Paragraph(f"• {contradiction}", self.styles['WarningRisk']))
        
        self.elements.append(PageBreak())
    
    def _add_detailed_findings(self):
        """Add detailed findings for each block (Level 2+)"""
        self.elements.append(Paragraph("Detailed Block Findings", self.styles['SectionHeader']))
        self.elements.append(HRFlowable(width="100%", thickness=2, color=AuditColors.PRIMARY))
        self.elements.append(Spacer(1, 15))
        
        block_details = self._get_block_details()
        
        for block_id, details in block_details.items():
            # Block header
            status = self.block_statuses.get(block_id, 'gray')
            status_color = {'green': AuditColors.GREEN, 'yellow': AuditColors.YELLOW, 'red': AuditColors.RED}.get(status, AuditColors.GRAY)
            
            self.elements.append(Paragraph(details['name'], self.styles['BlockTitle']))
            
            # Status badge inline
            status_text = {'green': 'HEALTHY', 'yellow': 'AT RISK', 'red': 'CRITICAL'}.get(status, 'PENDING')
            self.elements.append(Paragraph(f"<font color='{status_color}'><b>Status: {status_text}</b></font>", self.styles['AuditBodyText']))
            
            # Findings
            self.elements.append(Paragraph("<b>Findings:</b>", self.styles['AuditBodyText']))
            for finding in details.get('findings', [])[:3]:
                self.elements.append(Paragraph(f"  • {finding}", self.styles['RiskText']))
            
            # Risks
            if details.get('risks'):
                self.elements.append(Paragraph("<b>Risks Identified:</b>", self.styles['AuditBodyText']))
                for risk in details.get('risks', [])[:2]:
                    self.elements.append(Paragraph(f"  ⚠ {risk}", self.styles['RiskText']))
            
            self.elements.append(Spacer(1, 15))
        
        self.elements.append(PageBreak())
    
    def _add_recommendations(self):
        """Add recommendations section (Level 2+)"""
        self.elements.append(Paragraph("Recommendations", self.styles['SectionHeader']))
        self.elements.append(HRFlowable(width="100%", thickness=2, color=AuditColors.PRIMARY))
        self.elements.append(Spacer(1, 15))
        
        # Quick wins
        self.elements.append(Paragraph("Quick Wins (Week 1-2)", self.styles['SubsectionHeader']))
        quick_wins = self._get_recommendations_by_type('quick_win')
        for rec in quick_wins[:5]:
            self.elements.append(Paragraph(f"✓ {rec['text']}", self.styles['RecommendationText']))
            self.elements.append(Paragraph(f"   <i>Owner: {rec['owner']} | Effort: {rec['effort']}</i>", self.styles['RiskText']))
        
        self.elements.append(Spacer(1, 15))
        
        # Structural changes
        self.elements.append(Paragraph("Structural Changes (Month 1-3)", self.styles['SubsectionHeader']))
        structural = self._get_recommendations_by_type('structural')
        for rec in structural[:5]:
            self.elements.append(Paragraph(f"→ {rec['text']}", self.styles['RecommendationText']))
            self.elements.append(Paragraph(f"   <i>Owner: {rec['owner']} | Effort: {rec['effort']}</i>", self.styles['RiskText']))
        
        self.elements.append(PageBreak())
    
    def _add_implementation_roadmap(self):
        """Add implementation roadmap (Level 3)"""
        self.elements.append(Paragraph("Implementation Roadmap", self.styles['SectionHeader']))
        self.elements.append(HRFlowable(width="100%", thickness=2, color=AuditColors.PRIMARY))
        self.elements.append(Spacer(1, 15))
        
        # Timeline table
        timeline_data = [
            ['Phase', 'Timeline', 'Focus Areas', 'Key Deliverables'],
            ['Phase 1: Stabilize', 'Week 1-2', 'Quick wins, ownership clarity', 'Interim owner, basic visibility'],
            ['Phase 2: Foundation', 'Month 1', 'Process documentation, capacity model', 'SLAs defined, data baseline'],
            ['Phase 3: Structure', 'Month 2-3', 'Systems, dashboards, governance', 'Automated reporting, escalation paths'],
            ['Phase 4: Optimize', 'Quarter 2', 'Strategic alignment, continuous improvement', 'KPIs in OKRs, benchmarks established']
        ]
        
        table = Table(timeline_data, colWidths=[80, 70, 150, 150])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), AuditColors.PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), AuditColors.WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, AuditColors.GRAY),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        self.elements.append(table)
        self.elements.append(Spacer(1, 20))
        
        # Success metrics
        self.elements.append(Paragraph("Success Metrics", self.styles['SubsectionHeader']))
        metrics = [
            "Time-to-hire: -20% within 90 days",
            "Offer acceptance rate: >80%",
            "SLA compliance: >90%",
            "ATS data completeness: >95%",
            "Recruiter overload incidents: <15%"
        ]
        for metric in metrics:
            self.elements.append(Paragraph(f"• {metric}", self.styles['AuditBodyText']))
        
        self.elements.append(PageBreak())
    
    def _add_appendices(self):
        """Add appendices (Level 3)"""
        self.elements.append(Paragraph("Appendix: Methodology", self.styles['SectionHeader']))
        self.elements.append(HRFlowable(width="100%", thickness=2, color=AuditColors.PRIMARY))
        self.elements.append(Spacer(1, 15))
        
        methodology_text = """
        This audit uses a cross-validation methodology designed to surface systemic contradictions 
        and misaligned ownership. Each of the 7 audit blocks evaluates a specific dimension of 
        hiring execution, with responses validated across multiple roles to detect political 
        distortions and self-report bias.
        
        <b>Scoring Logic:</b>
        • GREEN (≥2.3 average, no critical RED): Structured, disciplined, predictable
        • YELLOW (1.5-2.29 average): Processes exist but inconsistently enforced
        • RED (<1.5 average or critical domain failure): Systemic dysfunction
        
        <b>Gate Rules:</b>
        • Block 1 RED → Overall system cannot exceed YELLOW
        • Block 2 or 4 RED → Governance failure, forces overall RED
        • Block 7 RED → Applies low confidence modifier to all blocks
        
        <b>Cross-Validation:</b>
        35 validation rules check for contradictions between blocks. Contradictions 
        escalate severity regardless of local scores.
        """
        
        self.elements.append(Paragraph(methodology_text, self.styles['AuditBodyText']))
        self.elements.append(PageBreak())
    
    def _add_disclaimer(self):
        """Add disclaimer section"""
        self.elements.append(Spacer(1, 30))
        self.elements.append(HRFlowable(width="100%", thickness=1, color=AuditColors.GRAY))
        self.elements.append(Spacer(1, 10))
        
        disclaimer = """
        <b>Disclaimer:</b> This diagnostic report is based on self-reported data from designated respondents. 
        While cross-validation reduces bias, findings should be verified through operational observation. 
        This report does not evaluate individual performance and should not be used for personnel decisions. 
        Recommendations are directional guidance, not prescriptive mandates. Implementation decisions 
        remain the responsibility of the organization's leadership.
        """
        
        self.elements.append(Paragraph(disclaimer, self.styles['FooterText']))
    
    # ========================================================================
    # HELPER METHODS
    # ========================================================================
    
    def _calculate_overall_status(self):
        """Calculate overall audit status based on gate logic"""
        statuses = list(self.block_statuses.values())
        
        # Gate 0: Block 1 RED → Overall RED
        if self.block_statuses.get('block1') == 'red':
            return 'red'
        
        # Gate 1: Block 2 or 4 RED → Overall RED
        if self.block_statuses.get('block2') == 'red' or self.block_statuses.get('block4') == 'red':
            return 'red'
        
        # Any execution block RED → Overall RED
        if any(self.block_statuses.get(f'block{i}') == 'red' for i in [3, 5, 6]):
            return 'red'
        
        # Multiple yellows → Yellow
        yellow_count = sum(1 for s in statuses if s == 'yellow')
        if yellow_count >= 2:
            return 'yellow'
        
        # All green or mostly green
        green_count = sum(1 for s in statuses if s == 'green')
        if green_count >= 5:
            return 'green'
        
        return 'yellow'
    
    def _calculate_overall_score(self):
        """Calculate numerical confidence score"""
        score_map = {'green': 90, 'yellow': 60, 'red': 30, 'gray': 50}
        scores = [score_map.get(s, 50) for s in self.block_statuses.values()]
        
        if not scores:
            return 50
        
        base_score = sum(scores) / len(scores)
        
        # Deductions for contradictions
        base_score -= len(self.contradictions) * 2
        
        # Block 7 modifier
        if self.block_statuses.get('block7') == 'red':
            base_score *= 0.8
        
        return max(0, min(100, int(base_score)))
    
    def _generate_key_findings(self):
        """Generate key findings based on data"""
        findings = []
        
        for block_id, status in self.block_statuses.items():
            block_names = {
                'block1': 'Executive Ownership',
                'block2': 'TA Leadership',
                'block3': 'Delivery Leadership',
                'block4': 'Financial Governance',
                'block5': 'Technical Interviewing',
                'block6': 'Recruitment Operations',
                'block7': 'Reporting & AI'
            }
            
            if status == 'red':
                findings.append(f"Critical failure in {block_names.get(block_id, block_id)} requires immediate attention")
            elif status == 'yellow':
                findings.append(f"{block_names.get(block_id, block_id)} shows inconsistent execution with improvement potential")
            elif status == 'green':
                findings.append(f"{block_names.get(block_id, block_id)} demonstrates healthy operational maturity")
        
        return findings
    
    def _get_priority_risks(self):
        """Get prioritized list of risks"""
        risks = []
        
        if self.block_statuses.get('block1') in ['red', 'yellow']:
            risks.append({
                'name': 'Ownership Gap',
                'severity': self.block_statuses.get('block1'),
                'impact': 'No clear accountability for hiring outcomes'
            })
        
        if self.block_statuses.get('block3') in ['red', 'yellow']:
            risks.append({
                'name': 'Interview Bottleneck',
                'severity': self.block_statuses.get('block3'),
                'impact': 'Delivery capacity constraints slow hiring'
            })
        
        if self.block_statuses.get('block6') in ['red', 'yellow']:
            risks.append({
                'name': 'Operational Fragility',
                'severity': self.block_statuses.get('block6'),
                'impact': 'Hero-based execution creates key-person risk'
            })
        
        if self.block_statuses.get('block7') == 'red':
            risks.append({
                'name': 'Data Blindness',
                'severity': 'red',
                'impact': 'Unreliable data undermines all decisions'
            })
        
        # Sort by severity
        severity_order = {'red': 0, 'yellow': 1, 'green': 2}
        risks.sort(key=lambda x: severity_order.get(x['severity'], 3))
        
        return risks
    
    def _get_block_signal(self, block_id):
        """Get the primary signal for a block"""
        signals = {
            'block1': 'Governance clarity',
            'block2': 'Capacity alignment',
            'block3': 'Feedback discipline',
            'block4': 'Budget transparency',
            'block5': 'Evaluation standards',
            'block6': 'Process stability',
            'block7': 'Data reliability'
        }
        return signals.get(block_id, 'Assessment pending')
    
    def _check_gate_failures(self):
        """Check for gate failures"""
        failures = []
        
        if self.block_statuses.get('block1') == 'red':
            failures.append("GATE 0 FAILURE: Executive ownership absent - overall system compromised")
        
        if self.block_statuses.get('block2') == 'red':
            failures.append("GATE 1 FAILURE: TA Leadership ungoverned - execution will fail")
        
        if self.block_statuses.get('block4') == 'red':
            failures.append("GATE 1 FAILURE: Financial governance broken - costs uncontrolled")
        
        return failures
    
    def _get_block_details(self):
        """Get detailed information for each block"""
        details = {
            'block1': {
                'name': 'Block 1: Executive Ownership & Governance',
                'findings': [
                    'Hiring ownership clarity assessed',
                    'Planning discipline evaluated',
                    'Executive visibility reviewed'
                ],
                'risks': ['Ownership gap may cause accountability vacuum'] if self.block_statuses.get('block1') != 'green' else []
            },
            'block2': {
                'name': 'Block 2: TA Leadership & Capacity',
                'findings': [
                    'TA operating model assessed',
                    'Capacity planning maturity evaluated',
                    'SLA discipline reviewed'
                ],
                'risks': ['Capacity blindness may cause overload'] if self.block_statuses.get('block2') != 'green' else []
            },
            'block3': {
                'name': 'Block 3: Delivery & Hiring Leadership',
                'findings': [
                    'Interview capacity assessed',
                    'Feedback timeliness evaluated',
                    'Requirement stability reviewed'
                ],
                'risks': ['Interview bottleneck may slow hiring'] if self.block_statuses.get('block3') != 'green' else []
            },
            'block4': {
                'name': 'Block 4: Financial Governance',
                'findings': [
                    'TA budget ownership assessed',
                    'Cost visibility evaluated',
                    'Budget-plan alignment reviewed'
                ],
                'risks': ['Financial opacity may cause cost overruns'] if self.block_statuses.get('block4') != 'green' else []
            },
            'block5': {
                'name': 'Block 5: Technical Interviewing',
                'findings': [
                    'Interviewer pool structure assessed',
                    'Evaluation criteria standardization evaluated',
                    'Feedback quality reviewed'
                ],
                'risks': ['Evaluation inconsistency may cause false negatives'] if self.block_statuses.get('block5') != 'green' else []
            },
            'block6': {
                'name': 'Block 6: Recruitment Operations',
                'findings': [
                    'Process documentation assessed',
                    'ATS discipline evaluated',
                    'Operational resilience reviewed'
                ],
                'risks': ['Key-person dependency creates fragility'] if self.block_statuses.get('block6') != 'green' else []
            },
            'block7': {
                'name': 'Block 7: Reporting, Data & AI',
                'findings': [
                    'Reporting maturity assessed',
                    'Data integrity evaluated',
                    'AI governance reviewed'
                ],
                'risks': ['Data unreliability undermines all metrics'] if self.block_statuses.get('block7') != 'green' else []
            }
        }
        return details
    
    def _get_recommendations_by_type(self, rec_type):
        """Get recommendations filtered by type"""
        # Default recommendations based on status
        quick_wins = [
            {'text': 'Designate interim hiring owner (CEO/COO) for 90 days', 'owner': 'CEO', 'effort': '1 day'},
            {'text': 'Add hiring status to weekly leadership agenda', 'owner': 'COO/EA', 'effort': '2 hours'},
            {'text': 'Count active roles per recruiter and set max threshold', 'owner': 'TA Lead', 'effort': '4 hours'},
            {'text': 'Block 4 interview slots per week for key interviewers', 'owner': 'Delivery', 'effort': '1 day'},
            {'text': 'Set 24-hour feedback SLA with automated reminders', 'owner': 'TA Ops', 'effort': '2 hours'}
        ]
        
        structural = [
            {'text': 'Define RACI matrix for hiring decisions', 'owner': 'HR + Business', 'effort': '1 week'},
            {'text': 'Build capacity model by role complexity', 'owner': 'TA Ops', 'effort': '2 weeks'},
            {'text': 'Implement SLA dashboard visible to all stakeholders', 'owner': 'TA + IT', 'effort': '2 weeks'},
            {'text': 'Create standardized evaluation scorecard template', 'owner': 'Engineering', 'effort': '4 hours'},
            {'text': 'Establish monthly Hiring Governance Forum', 'owner': 'COO', 'effort': '2 weeks'}
        ]
        
        if rec_type == 'quick_win':
            return quick_wins
        elif rec_type == 'structural':
            return structural
        
        return []


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def generate_sample_report():
    """Generate a sample report for testing"""
    
    # Sample audit data
    sample_data = {
        'company_name': 'TechCorp Inc.',
        'report_date': datetime.now().strftime('%B %d, %Y'),
        'block_statuses': {
            'block1': 'yellow',
            'block2': 'yellow',
            'block3': 'red',
            'block4': 'yellow',
            'block5': 'yellow',
            'block6': 'red',
            'block7': 'yellow'
        },
        'responses': {},
        'contradictions': [
            'CV-05: SLA claimed in Block 2 but not enforced per Block 6',
            'CV-08: Interview capacity claimed sufficient but delays reported'
        ],
        'recommendations': []
    }
    
    # Generate Level 1 report
    generator = HiringAuditReportGenerator(
        audit_data=sample_data,
        output_path='/home/claude/sample_audit_report_L1.pdf',
        level=1
    )
    generator.generate()
    print("Level 1 report generated: sample_audit_report_L1.pdf")
    
    # Generate Level 2 report
    generator2 = HiringAuditReportGenerator(
        audit_data=sample_data,
        output_path='/home/claude/sample_audit_report_L2.pdf',
        level=2
    )
    generator2.generate()
    print("Level 2 report generated: sample_audit_report_L2.pdf")
    
    # Generate Level 3 report
    generator3 = HiringAuditReportGenerator(
        audit_data=sample_data,
        output_path='/home/claude/sample_audit_report_L3.pdf',
        level=3
    )
    generator3.generate()
    print("Level 3 report generated: sample_audit_report_L3.pdf")


if __name__ == '__main__':
    generate_sample_report()
