# Hiring Audit — UI/UX Design System
## Brand & Interface Specification v1.0

---

## 1. Design Philosophy

### Brand Essence
**"Clarity Through Diagnosis"**

The Hiring Audit is a precision diagnostic tool — not flashy HR software. The design should convey:
- **Authority** — Professional, trustworthy, executive-level
- **Clarity** — Complex insights made understandable
- **Precision** — Data-driven, methodical, rigorous
- **Action** — Results that drive decisions

### Aesthetic Direction
**"Executive Diagnostic"** — Clean, sophisticated, medical-precision meets business intelligence

Think: Bloomberg Terminal meets Mayo Clinic diagnostic reports — serious, authoritative, yet accessible.

---

## 2. Color System

### Primary Palette

```css
:root {
  /* Primary Brand */
  --color-primary-900: #0F172A;    /* Deep Navy - Headers, emphasis */
  --color-primary-800: #1E293B;    /* Dark Slate - Body backgrounds */
  --color-primary-700: #334155;    /* Slate - Secondary elements */
  --color-primary-600: #475569;    /* Mid Slate - Borders, dividers */
  --color-primary-500: #64748B;    /* Light Slate - Muted text */
  
  /* Accent - Teal/Cyan */
  --color-accent-500: #0891B2;     /* Primary accent */
  --color-accent-400: #22D3EE;     /* Hover states */
  --color-accent-300: #67E8F9;     /* Light accent */
  
  /* Background */
  --color-bg-primary: #FAFBFC;     /* Main background */
  --color-bg-secondary: #F1F5F9;   /* Cards, sections */
  --color-bg-tertiary: #E2E8F0;    /* Hover states */
  --color-bg-dark: #0F172A;        /* Dark sections */
}
```

### Status Colors (Audit Results)

```css
:root {
  /* Status - Traffic Light System */
  --color-status-green: #10B981;   /* Healthy */
  --color-status-green-bg: #D1FAE5;
  --color-status-green-border: #6EE7B7;
  
  --color-status-yellow: #F59E0B;  /* At Risk */
  --color-status-yellow-bg: #FEF3C7;
  --color-status-yellow-border: #FCD34D;
  
  --color-status-red: #EF4444;     /* Critical */
  --color-status-red-bg: #FEE2E2;
  --color-status-red-border: #FCA5A5;
  
  --color-status-gray: #6B7280;    /* Not Assessed */
  --color-status-gray-bg: #F3F4F6;
  --color-status-gray-border: #D1D5DB;
}
```

### Semantic Colors

```css
:root {
  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-inverse: #FFFFFF;
  
  /* Interactive */
  --color-link: #0891B2;
  --color-link-hover: #0E7490;
  --color-focus-ring: rgba(8, 145, 178, 0.4);
  
  /* Borders */
  --color-border-light: #E2E8F0;
  --color-border-medium: #CBD5E1;
  --color-border-dark: #475569;
}
```

---

## 3. Typography

### Font Stack

```css
:root {
  /* Display - Headlines, Hero text */
  --font-display: 'DM Serif Display', Georgia, serif;
  
  /* Headings - Section titles */
  --font-heading: 'Plus Jakarta Sans', -apple-system, sans-serif;
  
  /* Body - Readable text */
  --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
  
  /* Mono - Data, codes */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Type Scale

```css
:root {
  /* Display */
  --text-display-xl: 4.5rem;    /* 72px - Hero headlines */
  --text-display-lg: 3.5rem;    /* 56px - Page titles */
  --text-display-md: 2.5rem;    /* 40px - Section heroes */
  
  /* Headings */
  --text-h1: 2rem;              /* 32px */
  --text-h2: 1.5rem;            /* 24px */
  --text-h3: 1.25rem;           /* 20px */
  --text-h4: 1.125rem;          /* 18px */
  
  /* Body */
  --text-body-lg: 1.125rem;     /* 18px - Lead paragraphs */
  --text-body-md: 1rem;         /* 16px - Body text */
  --text-body-sm: 0.875rem;     /* 14px - Secondary text */
  --text-body-xs: 0.75rem;      /* 12px - Captions, labels */
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;
}
```

### Typography Usage

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Hero Headline | DM Serif Display | display-xl | 400 | primary-900 |
| Page Title | Plus Jakarta Sans | display-lg | 700 | primary-900 |
| Section Title | Plus Jakarta Sans | h1 | 600 | primary-800 |
| Card Title | Plus Jakarta Sans | h3 | 600 | primary-800 |
| Body | Plus Jakarta Sans | body-md | 400 | text-secondary |
| Label | Plus Jakarta Sans | body-sm | 500 | text-muted |
| Data/Metric | JetBrains Mono | h2 | 700 | accent-500 |

---

## 4. Spacing & Layout

### Spacing Scale

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Container Widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;
  --container-max: 1600px;
}
```

### Grid System

```css
/* 12-column grid */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* Common layouts */
.layout-sidebar { grid-template-columns: 280px 1fr; }
.layout-center { grid-template-columns: 1fr minmax(auto, 800px) 1fr; }
.layout-cards { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
```

---

## 5. Components

### Buttons

```css
/* Base Button */
.btn {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: var(--text-body-md);
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

/* Primary - Main CTA */
.btn-primary {
  background: var(--color-accent-500);
  color: white;
  border: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-primary:hover {
  background: var(--color-accent-400);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
}

/* Secondary - Alternative actions */
.btn-secondary {
  background: transparent;
  color: var(--color-primary-800);
  border: 2px solid var(--color-border-medium);
}
.btn-secondary:hover {
  border-color: var(--color-accent-500);
  color: var(--color-accent-500);
}

/* Ghost - Minimal */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
}
.btn-ghost:hover {
  background: var(--color-bg-tertiary);
}

/* Sizes */
.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-body-sm); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-body-lg); }
```

### Cards

```css
/* Base Card */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  padding: var(--space-6);
  transition: all 0.2s ease;
}

/* Elevated Card */
.card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
}
.card-elevated:hover {
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

/* Status Card */
.card-status {
  border-left: 4px solid;
  padding-left: var(--space-5);
}
.card-status-green { border-color: var(--color-status-green); }
.card-status-yellow { border-color: var(--color-status-yellow); }
.card-status-red { border-color: var(--color-status-red); }
```

### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  font-size: var(--text-body-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.badge-green {
  background: var(--color-status-green-bg);
  color: #065F46;
  border: 1px solid var(--color-status-green-border);
}

.badge-yellow {
  background: var(--color-status-yellow-bg);
  color: #92400E;
  border: 1px solid var(--color-status-yellow-border);
}

.badge-red {
  background: var(--color-status-red-bg);
  color: #991B1B;
  border: 1px solid var(--color-status-red-border);
}
```

### Form Elements

```css
/* Input */
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  border: 2px solid var(--color-border-light);
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}
.input:focus {
  outline: none;
  border-color: var(--color-accent-500);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

/* Select */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,...chevron...");
  background-repeat: no-repeat;
  background-position: right var(--space-4) center;
  padding-right: var(--space-10);
}

/* Radio/Checkbox Card */
.option-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  border: 2px solid var(--color-border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.option-card:hover {
  border-color: var(--color-accent-500);
  background: var(--color-bg-secondary);
}
.option-card.selected {
  border-color: var(--color-accent-500);
  background: rgba(8, 145, 178, 0.05);
}
```

### Progress Indicators

```css
/* Progress Bar */
.progress-bar {
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: 9999px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-500), var(--color-accent-400));
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Step Indicator */
.steps {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-body-sm);
}
.step-pending {
  background: var(--color-bg-tertiary);
  color: var(--color-text-muted);
}
.step-active {
  background: var(--color-accent-500);
  color: white;
}
.step-complete {
  background: var(--color-status-green);
  color: white;
}
.step-connector {
  flex: 1;
  height: 2px;
  background: var(--color-border-light);
}
.step-connector-complete {
  background: var(--color-status-green);
}
```

---

## 6. Iconography

### Icon Style
- **Library**: Lucide Icons (clean, consistent)
- **Size**: 20px default, 16px small, 24px large
- **Stroke**: 2px
- **Color**: Inherit from parent

### Key Icons

| Context | Icon | Usage |
|---------|------|-------|
| Status Green | `check-circle` | Healthy blocks |
| Status Yellow | `alert-triangle` | At risk blocks |
| Status Red | `x-circle` | Critical blocks |
| Block 1 | `crown` | Executive Ownership |
| Block 2 | `users` | TA Leadership |
| Block 3 | `truck` | Delivery |
| Block 4 | `wallet` | Finance |
| Block 5 | `code` | Technical |
| Block 6 | `cog` | Operations |
| Block 7 | `bar-chart-2` | Reporting |
| Download | `download` | Export/Report |
| Arrow | `arrow-right` | CTAs, navigation |
| Check | `check` | Completed items |

---

## 7. Motion & Animation

### Timing Functions

```css
:root {
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Animation Durations

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}
```

### Key Animations

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Progress Fill */
@keyframes progressFill {
  from { width: 0; }
  to { width: var(--progress); }
}

/* Stagger children */
.stagger > * {
  animation: fadeInUp 0.5s var(--ease-out) forwards;
  opacity: 0;
}
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 100ms; }
.stagger > *:nth-child(3) { animation-delay: 200ms; }
/* ... */
```

---

## 8. Page Templates

### Landing Page Structure

```
┌─────────────────────────────────────────────────────────┐
│ NAVIGATION                                               │
│ Logo          Features  Pricing  About       [Start Audit]│
├─────────────────────────────────────────────────────────┤
│ HERO SECTION                                             │
│                                                          │
│    Your hiring is broken.                                │
│    We'll show you where.                                 │
│                                                          │
│    [Start Free Diagnostic]  [See Sample Report]          │
│                                                          │
│    ┌─────────────────────────────────────────┐          │
│    │    [Visual: Audit Dashboard Preview]     │          │
│    └─────────────────────────────────────────┘          │
├─────────────────────────────────────────────────────────┤
│ SOCIAL PROOF                                             │
│    "Trusted by 500+ companies"  Logo  Logo  Logo  Logo   │
├─────────────────────────────────────────────────────────┤
│ PROBLEM SECTION                                          │
│                                                          │
│    The hiring problems you can't see                     │
│                                                          │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│    │ Symptom │  │ Symptom │  │ Symptom │               │
│    │ Card    │  │ Card    │  │ Card    │               │
│    └─────────┘  └─────────┘  └─────────┘               │
├─────────────────────────────────────────────────────────┤
│ HOW IT WORKS                                             │
│                                                          │
│    ①────────②────────③────────④                        │
│    Configure   Answer    Analyze   Get Report            │
├─────────────────────────────────────────────────────────┤
│ AUDIT BLOCKS                                             │
│                                                          │
│    7 dimensions of hiring health                         │
│                                                          │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│    │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │ │ 7 │          │
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘          │
├─────────────────────────────────────────────────────────┤
│ PRICING                                                  │
│                                                          │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│    │ Level 1  │  │ Level 2  │  │ Level 3  │            │
│    │ $XXX     │  │ $XXX     │  │ Contact  │            │
│    └──────────┘  └──────────┘  └──────────┘            │
├─────────────────────────────────────────────────────────┤
│ FAQ                                                      │
│    Accordion items                                       │
├─────────────────────────────────────────────────────────┤
│ CTA SECTION                                              │
│    Ready to diagnose your hiring?                        │
│    [Start Audit Now]                                     │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                   │
│    Logo   Links   Legal   Social                         │
└─────────────────────────────────────────────────────────┘
```

### Audit Flow Structure

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│ Logo                         Progress: ████░░░ 4/7       │
├───────────────┬─────────────────────────────────────────┤
│ SIDEBAR       │ MAIN CONTENT                            │
│               │                                          │
│ ✓ Config      │  Block 4: Financial Governance          │
│ ✓ Block 1     │                                          │
│ ✓ Block 2     │  Question 3 of 8                        │
│ ✓ Block 3     │                                          │
│ ● Block 4     │  ┌─────────────────────────────────┐    │
│ ○ Block 5     │  │ Is the TA budget derived from   │    │
│ ○ Block 6     │  │ an approved hiring plan?        │    │
│ ○ Block 7     │  └─────────────────────────────────┘    │
│               │                                          │
│               │  ○ Fully aligned                        │
│               │  ○ Partially aligned                    │
│               │  ○ Not linked                           │
│               │                                          │
│               │  [Back]              [Continue →]        │
└───────────────┴─────────────────────────────────────────┘
```

### Results Dashboard Structure

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│ Logo        [Download PDF]  [Share]  [Account]          │
├─────────────────────────────────────────────────────────┤
│ SUMMARY BANNER                                           │
│                                                          │
│   Overall Health: YELLOW (At Risk)                       │
│   Confidence Score: 68/100                               │
│   [View Full Report]                                     │
├─────────────────────────────────────────────────────────┤
│ BLOCK STATUS GRID                                        │
│                                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │🟢 B1    │ │🟡 B2    │ │🔴 B3    │ │🟢 B4    │       │
│  │Executive│ │TA Lead  │ │Delivery │ │Finance  │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │🟡 B5    │ │🟡 B6    │ │🟢 B7    │                   │
│  │Technical│ │Ops      │ │Reporting│                   │
│  └─────────┘ └─────────┘ └─────────┘                   │
├─────────────────────────────────────────────────────────┤
│ KEY FINDINGS                                             │
│                                                          │
│  ⚠️ Gate Failure: Block 3 (Delivery Bottleneck)         │
│  🔍 Contradiction: CV-05 (SLA Theatre)                  │
│  📋 3 Quick Wins identified                              │
├─────────────────────────────────────────────────────────┤
│ RECOMMENDATIONS PREVIEW                                  │
│                                                          │
│  Priority Actions:                                       │
│  1. Designate interview capacity owner                   │
│  2. Implement SLA tracking                               │
│  3. ...                                                  │
│                                                          │
│  [Upgrade to Level 2 for full recommendations]          │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Responsive Breakpoints

```css
/* Mobile First */
:root {
  --breakpoint-sm: 640px;   /* Large phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}

/* Usage */
@media (min-width: 768px) { /* Tablet+ */ }
@media (min-width: 1024px) { /* Desktop+ */ }
```

---

## 10. Accessibility

### Requirements
- WCAG 2.1 AA compliance
- Minimum contrast ratio: 4.5:1 (text), 3:1 (large text/UI)
- Focus visible states on all interactive elements
- Keyboard navigable
- Screen reader friendly

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--color-accent-500);
  color: white;
  padding: var(--space-4);
  z-index: 9999;
}
.skip-link:focus {
  top: 0;
}
```

---

## 11. Dark Mode (Optional)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0F172A;
    --color-bg-secondary: #1E293B;
    --color-text-primary: #F1F5F9;
    --color-text-secondary: #94A3B8;
    --color-border-light: #334155;
  }
}
```

---

## 12. Asset Requirements

### Logo
- Primary: Full logo (horizontal)
- Icon: Symbol only (square)
- Formats: SVG, PNG (@1x, @2x)
- Colors: Full color, monochrome, reversed

### Illustrations
- Style: Clean line art with subtle color fills
- Subjects: Audit flow, data visualization, team collaboration
- Format: SVG for web, PNG for fallback

### Photography (if used)
- Style: Authentic workplace, diverse teams
- Treatment: Slight desaturation, professional tone
- Avoid: Stock photo clichés, over-staged scenarios

---

*Design System v1.0 — Hiring Audit*
