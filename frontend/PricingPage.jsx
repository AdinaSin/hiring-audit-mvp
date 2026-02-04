import React, { useState } from 'react';

// Pricing Page with Stripe Checkout Integration
// Install dependencies: npm install lucide-react

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

// Checkout Modal Component
function CheckoutModal({ tier, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    companySize: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const tierInfo = {
    level1: { name: 'Level 1 - Diagnostic', price: '$499' },
    level2: { name: 'Level 2 - Diagnostic + Design', price: '$1,499' }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.companySize) newErrors.companySize = 'Please select company size';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          companyName: formData.companyName,
          email: formData.email,
          companySize: formData.companySize
        })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrors({ submit: data.error || 'Failed to initialize payment' });
        setLoading(false);
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.modalClose} onClick={onClose}>×</button>
        
        <h2 style={styles.modalTitle}>Start Your Audit</h2>
        <p style={styles.modalSubtitle}>{tierInfo[tier]?.name} ({tierInfo[tier]?.price})</p>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Name *</label>
            <input
              type="text"
              style={{...styles.input, ...(errors.companyName ? styles.inputError : {})}}
              value={formData.companyName}
              onChange={e => setFormData({...formData, companyName: e.target.value})}
              placeholder="Acme Corp"
            />
            {errors.companyName && <span style={styles.errorText}>{errors.companyName}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Work Email *</label>
            <input
              type="email"
              style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="you@company.com"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Size *</label>
            <select
              style={{...styles.input, ...styles.select, ...(errors.companySize ? styles.inputError : {})}}
              value={formData.companySize}
              onChange={e => setFormData({...formData, companySize: e.target.value})}
            >
              <option value="">Select company size...</option>
              <option value="1-50">1-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
            {errors.companySize && <span style={styles.errorText}>{errors.companySize}</span>}
          </div>
          
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={e => setFormData({...formData, agreeTerms: e.target.checked})}
                style={styles.checkbox}
              />
              <span>I agree to the <a href="/terms" target="_blank" style={styles.link}>Terms of Service</a> and <a href="/privacy" target="_blank" style={styles.link}>Privacy Policy</a></span>
            </label>
            {errors.agreeTerms && <span style={styles.errorText}>{errors.agreeTerms}</span>}
          </div>
          
          {errors.submit && <div style={styles.errorBanner}>{errors.submit}</div>}
          
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <LoaderIcon /> Redirecting to payment...
              </>
            ) : (
              <>
                Continue to Payment <ArrowRightIcon />
              </>
            )}
          </button>
        </form>
        
        <div style={styles.modalFooter}>
          <svg width="60" height="25" viewBox="0 0 60 25" fill="none">
            <path d="M5 10.5H1.5V17H3.5V14.5H5C7 14.5 8.5 13 8.5 11.5C8.5 10 7 10.5 5 10.5ZM5 12.5H3.5V12.5H5C5.5 12.5 6 12 6 11.5C6 11 5.5 12.5 5 12.5Z" fill="#635BFF"/>
            <text x="12" y="16" fill="#0F172A" fontSize="10" fontFamily="Arial">Powered by Stripe</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ tier, name, price, description, features, featured, onSelect }) {
  return (
    <div style={{
      ...styles.pricingCard,
      ...(featured ? styles.pricingCardFeatured : {})
    }}>
      {featured && <div style={styles.popularBadge}>Most Popular</div>}
      
      <div style={styles.tierLabel}>{tier}</div>
      <h3 style={styles.tierName}>{name}</h3>
      <div style={styles.priceWrapper}>
        <span style={styles.price}>{price}</span>
        {price !== 'Custom' && <span style={styles.priceNote}>one-time</span>}
      </div>
      <p style={styles.tierDesc}>{description}</p>
      
      <ul style={styles.featureList}>
        {features.map((feature, idx) => (
          <li key={idx} style={styles.featureItem}>
            <span style={styles.checkIcon}><CheckIcon /></span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={onSelect}
        style={{
          ...styles.ctaButton,
          ...(featured ? styles.ctaButtonPrimary : styles.ctaButtonSecondary)
        }}
      >
        {price === 'Custom' ? 'Contact Us' : 'Get Started'}
        <ArrowRightIcon />
      </button>
    </div>
  );
}

// Main Pricing Page Component
export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectTier = (tier) => {
    if (tier === 'level3') {
      // Redirect to contact form for custom pricing
      window.location.href = '/contact?subject=Level%203%20Inquiry';
      return;
    }
    setSelectedTier(tier);
    setModalOpen(true);
  };

  const pricingData = [
    {
      tier: 'Level 1',
      tierId: 'level1',
      name: 'Diagnostic',
      price: '$499',
      description: 'Clear visibility into your hiring system\'s health and critical risks.',
      features: [
        'Full 7-block assessment',
        'Cross-validation analysis',
        'Risk heatmap & status indicators',
        'Gate failure identification',
        'Contradiction detection',
        'Executive PDF report'
      ],
      featured: false
    },
    {
      tier: 'Level 2',
      tierId: 'level2',
      name: 'Diagnostic + Design',
      price: '$1,499',
      description: 'Everything in Level 1, plus actionable fix recommendations.',
      features: [
        'Everything in Level 1',
        'Prioritized quick wins (Week 1-2)',
        'Structural change roadmap',
        'Root cause analysis',
        'Recommendation library access',
        '30-minute results walkthrough call'
      ],
      featured: true
    },
    {
      tier: 'Level 3',
      tierId: 'level3',
      name: 'Full Assessment',
      price: 'Custom',
      description: 'Diagnostic + Design + hands-on implementation support.',
      features: [
        'Everything in Level 2',
        '90-day implementation roadmap',
        'Weekly advisory calls',
        'Process design support',
        'Executive stakeholder alignment',
        'Change management guidance'
      ],
      featured: false
    }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.sectionLabel}>Pricing</span>
          <h1 style={styles.title}>Choose your diagnostic depth</h1>
          <p style={styles.subtitle}>
            All tiers include the full 7-block audit framework with cross-validation.
            No subscriptions — pay once, get your diagnostic.
          </p>
        </div>

        {/* Pricing Grid */}
        <div style={styles.pricingGrid}>
          {pricingData.map((plan) => (
            <PricingCard
              key={plan.tierId}
              tier={plan.tier}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              featured={plan.featured}
              onSelect={() => handleSelectTier(plan.tierId)}
            />
          ))}
        </div>

        {/* Trust indicators */}
        <div style={styles.trustSection}>
          <div style={styles.trustItem}>
            <span style={styles.trustIcon}>🔒</span>
            <span>Secure payment via Stripe</span>
          </div>
          <div style={styles.trustItem}>
            <span style={styles.trustIcon}>↩️</span>
            <span>Full refund within 14 days if not started</span>
          </div>
          <div style={styles.trustItem}>
            <span style={styles.trustIcon}>📧</span>
            <span>Invoice provided for all purchases</span>
          </div>
        </div>

        {/* FAQ Preview */}
        <div style={styles.faqPreview}>
          <h3 style={styles.faqTitle}>Common Questions</h3>
          <div style={styles.faqGrid}>
            <div style={styles.faqItem}>
              <h4>Who needs to participate?</h4>
              <p>Typically: CEO/COO, Head of TA, Head of Delivery/Engineering, and CFO. Each completes their relevant blocks (10-15 min each).</p>
            </div>
            <div style={styles.faqItem}>
              <h4>How long until I get results?</h4>
              <p>3-5 business days from purchase to report delivery, depending on how quickly respondents complete their blocks.</p>
            </div>
            <div style={styles.faqItem}>
              <h4>Is our data secure?</h4>
              <p>Yes. GDPR-compliant, encrypted data, 90-day retention. We never share individual company data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        tier={selectedTier}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

// Styles
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F1F5F9 0%, #FAFBFC 100%)',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    padding: '80px 24px 60px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  sectionLabel: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#0891B2',
    marginBottom: '16px'
  },
  title: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    fontWeight: '400',
    color: '#0F172A',
    marginBottom: '16px',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#475569',
    maxWidth: '600px',
    margin: '0 auto'
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '48px'
  },
  pricingCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '2px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.2s ease'
  },
  pricingCardFeatured: {
    borderColor: '#0891B2',
    transform: 'scale(1.02)',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#0891B2',
    color: 'white',
    padding: '4px 16px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600'
  },
  tierLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0891B2',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  },
  tierName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '16px'
  },
  priceWrapper: {
    marginBottom: '8px'
  },
  price: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '48px',
    fontWeight: '700',
    color: '#0F172A'
  },
  priceNote: {
    fontSize: '14px',
    color: '#94A3B8',
    marginLeft: '8px'
  },
  tierDesc: {
    color: '#475569',
    fontSize: '15px',
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #E2E8F0'
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    marginBottom: '32px',
    flexGrow: 1
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '8px 0',
    fontSize: '15px',
    color: '#334155'
  },
  checkIcon: {
    color: '#10B981',
    flexShrink: 0,
    marginTop: '2px'
  },
  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none'
  },
  ctaButtonPrimary: {
    background: '#0891B2',
    color: 'white'
  },
  ctaButtonSecondary: {
    background: 'white',
    color: '#0F172A',
    border: '2px solid #CBD5E1'
  },
  trustSection: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '32px',
    padding: '32px 0',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
    marginBottom: '48px'
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#475569',
    fontSize: '14px'
  },
  trustIcon: {
    fontSize: '18px'
  },
  faqPreview: {
    textAlign: 'center'
  },
  faqTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#0F172A'
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    textAlign: 'left'
  },
  faqItem: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0'
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#94A3B8',
    cursor: 'pointer'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#0F172A'
  },
  modalSubtitle: {
    color: '#0891B2',
    fontWeight: '600',
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #E2E8F0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  select: {
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%2364748B\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center'
  },
  checkboxGroup: {
    marginBottom: '24px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '14px',
    color: '#475569',
    cursor: 'pointer'
  },
  checkbox: {
    marginTop: '2px'
  },
  link: {
    color: '#0891B2',
    textDecoration: 'none'
  },
  errorText: {
    display: 'block',
    fontSize: '13px',
    color: '#EF4444',
    marginTop: '4px'
  },
  errorBanner: {
    background: '#FEE2E2',
    color: '#991B1B',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  submitBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 24px',
    background: '#0891B2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  modalFooter: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #E2E8F0',
    color: '#94A3B8',
    fontSize: '13px'
  }
};
