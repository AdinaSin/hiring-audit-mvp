# Stripe Integration Specification
## Hiring Audit Payment System v1.0

---

## 1. Overview

### Payment Model
- **Type**: One-time payments (not subscriptions)
- **Tiers**: 3 pricing levels
- **Currency**: USD (primary), EUR, GBP (optional)
- **Payment Methods**: Cards, Google Pay, Apple Pay

### Pricing Structure

| Tier | Name | Price (USD) | Stripe Price ID |
|------|------|-------------|-----------------|
| Level 1 | Diagnostic | $499 | `price_diagnostic_499` |
| Level 2 | Diagnostic + Design | $1,499 | `price_design_1499` |
| Level 3 | Full Assessment | Custom | Quote-based |

---

## 2. Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│  Checkout   │────▶│   Stripe    │
│    Page     │     │    Page     │     │   Hosted    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
             ┌─────────────┐     ┌─────────────┐
             │   Webhook   │────▶│   Create    │
             │   Handler   │     │   Audit     │
             └─────────────┘     └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │ Send Email  │
                                 │ with Links  │
                                 └─────────────┘
```

---

## 3. Environment Variables

```env
# Stripe Keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
STRIPE_PRICE_DIAGNOSTIC=price_xxxxx
STRIPE_PRICE_DESIGN=price_xxxxx

# URLs
FRONTEND_URL=https://yourdomain.com
SUCCESS_URL=https://yourdomain.com/audit/success
CANCEL_URL=https://yourdomain.com/pricing
```

---

## 4. Backend Implementation

### 4.1 Create Checkout Session

```javascript
// api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  'level1': process.env.STRIPE_PRICE_DIAGNOSTIC,
  'level2': process.env.STRIPE_PRICE_DESIGN
};

const TIER_NAMES = {
  'level1': 'Level 1 - Diagnostic',
  'level2': 'Level 2 - Diagnostic + Design'
};

async function createCheckoutSession(req, res) {
  const { tier, companyName, email, companySize } = req.body;
  
  // Validate
  if (!PRICES[tier]) {
    return res.status(400).json({ error: 'Invalid tier' });
  }
  if (!email || !companyName) {
    return res.status(400).json({ error: 'Email and company name required' });
  }
  
  try {
    // Find or create customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    
    if (existing.data.length > 0) {
      customer = existing.data[0];
      // Update metadata if needed
      await stripe.customers.update(customer.id, {
        name: companyName,
        metadata: { company_name: companyName, company_size: companySize }
      });
    } else {
      customer = await stripe.customers.create({
        email,
        name: companyName,
        metadata: { company_name: companyName, company_size: companySize }
      });
    }
    
    // Generate audit ID
    const auditId = `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: PRICES[tier],
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&audit_id=${auditId}`,
      cancel_url: process.env.CANCEL_URL,
      metadata: {
        audit_id: auditId,
        tier: tier,
        tier_name: TIER_NAMES[tier],
        company_name: companyName,
        company_size: companySize
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },
      payment_intent_data: {
        metadata: {
          audit_id: auditId,
          tier: tier
        }
      }
    });
    
    return res.json({ 
      sessionId: session.id,
      url: session.url,
      auditId: auditId
    });
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
}

module.exports = { createCheckoutSession };
```

### 4.2 Webhook Handler

```javascript
// api/webhooks/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createAudit, sendAuditEmail } = require('../services/audit');

async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Raw body required for signature verification
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
      
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      console.log('Invoice paid:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
}

async function handleCheckoutComplete(session) {
  const { audit_id, tier, company_name } = session.metadata;
  const customerEmail = session.customer_details.email;
  
  console.log(`Checkout complete: ${audit_id} for ${company_name}`);
  
  try {
    // 1. Create audit record in database
    const audit = await createAudit({
      auditId: audit_id,
      companyName: company_name,
      tier: tier,
      email: customerEmail,
      stripeSessionId: session.id,
      stripeCustomerId: session.customer,
      amountPaid: session.amount_total / 100,
      currency: session.currency,
      status: 'pending_responses',
      createdAt: new Date()
    });
    
    // 2. Generate form links
    const formLinks = generateFormLinks(audit_id, tier);
    
    // 3. Send welcome email with instructions
    await sendAuditEmail({
      to: customerEmail,
      subject: `Your Hiring Audit is Ready - ${company_name}`,
      template: 'audit-welcome',
      data: {
        companyName: company_name,
        auditId: audit_id,
        tier: tier,
        formLinks: formLinks,
        dashboardUrl: `${process.env.FRONTEND_URL}/audit/${audit_id}`
      }
    });
    
    console.log(`Audit created and email sent: ${audit_id}`);
    
  } catch (error) {
    console.error('Error processing checkout:', error);
    // Don't throw - webhook should still return 200
    // Log to error tracking (Sentry, etc.)
  }
}

async function handlePaymentFailed(paymentIntent) {
  const { audit_id } = paymentIntent.metadata || {};
  console.error(`Payment failed for audit: ${audit_id || 'unknown'}`);
  
  // Optionally notify admin or update audit status
}

function generateFormLinks(auditId, tier) {
  const baseUrl = process.env.FRONTEND_URL;
  
  return {
    config: `${baseUrl}/audit/${auditId}/config`,
    block1: `${baseUrl}/audit/${auditId}/block/1`,
    block2: `${baseUrl}/audit/${auditId}/block/2`,
    block3: `${baseUrl}/audit/${auditId}/block/3`,
    block4: `${baseUrl}/audit/${auditId}/block/4`,
    block5: `${baseUrl}/audit/${auditId}/block/5`,
    block6: `${baseUrl}/audit/${auditId}/block/6`,
    block7: `${baseUrl}/audit/${auditId}/block/7`,
    dashboard: `${baseUrl}/audit/${auditId}/dashboard`
  };
}

module.exports = { handleStripeWebhook };
```

### 4.3 Verify Payment Status

```javascript
// api/verify-payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function verifyPayment(req, res) {
  const { sessionId } = req.query;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      return res.json({
        success: true,
        auditId: session.metadata.audit_id,
        tier: session.metadata.tier,
        companyName: session.metadata.company_name
      });
    } else {
      return res.json({
        success: false,
        status: session.payment_status
      });
    }
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}

module.exports = { verifyPayment };
```

---

## 5. Frontend Implementation

### 5.1 Checkout Button Component (React)

```jsx
// components/CheckoutButton.jsx
import { useState } from 'react';

const TIERS = {
  level1: { name: 'Diagnostic', price: 499 },
  level2: { name: 'Diagnostic + Design', price: 1499 }
};

export function CheckoutButton({ tier }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    // Collect info (could be from modal/form)
    const companyName = prompt('Company Name:');
    const email = prompt('Email:');
    
    if (!companyName || !email) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, companyName, email })
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout');
      }
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Loading...' : `Get ${TIERS[tier].name} - $${TIERS[tier].price}`}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### 5.2 Success Page

```jsx
// pages/audit/success.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function AuditSuccessPage() {
  const [searchParams] = useSearchParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const auditId = searchParams.get('audit_id');
    
    if (sessionId) {
      verifyAndLoad(sessionId);
    } else if (auditId) {
      loadAudit(auditId);
    }
  }, [searchParams]);
  
  const verifyAndLoad = async (sessionId) => {
    try {
      const res = await fetch(`/api/verify-payment?sessionId=${sessionId}`);
      const data = await res.json();
      
      if (data.success) {
        setAudit(data);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Verifying payment...</div>;
  }
  
  if (!audit) {
    return <div className="error">Unable to verify payment. Please contact support.</div>;
  }
  
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>Payment Successful!</h1>
      <p>Your audit has been created for <strong>{audit.companyName}</strong></p>
      
      <div className="audit-details">
        <p><strong>Audit ID:</strong> {audit.auditId}</p>
        <p><strong>Tier:</strong> {audit.tier === 'level1' ? 'Diagnostic' : 'Diagnostic + Design'}</p>
      </div>
      
      <div className="next-steps">
        <h2>What's Next?</h2>
        <ol>
          <li>Check your email for detailed instructions</li>
          <li>Share the audit links with your respondents</li>
          <li>Complete all 7 blocks</li>
          <li>Receive your diagnostic report</li>
        </ol>
      </div>
      
      <a href={`/audit/${audit.auditId}/dashboard`} className="btn btn-primary">
        Go to Audit Dashboard
      </a>
    </div>
  );
}
```

### 5.3 Pre-Checkout Form (Modal)

```jsx
// components/CheckoutModal.jsx
import { useState } from 'react';

export function CheckoutModal({ tier, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    companySize: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!formData.companySize) newErrors.companySize = 'Required';
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
        setErrors({ submit: data.error });
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Start Your Audit</h2>
        <p className="modal-subtitle">
          {tier === 'level1' ? 'Level 1 - Diagnostic ($499)' : 'Level 2 - Diagnostic + Design ($1,499)'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={e => setFormData({...formData, companyName: e.target.value})}
              placeholder="Acme Corp"
            />
            {errors.companyName && <span className="error">{errors.companyName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="you@company.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Company Size *</label>
            <select
              value={formData.companySize}
              onChange={e => setFormData({...formData, companySize: e.target.value})}
            >
              <option value="">Select...</option>
              <option value="1-50">1-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
            {errors.companySize && <span className="error">{errors.companySize}</span>}
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={e => setFormData({...formData, agreeTerms: e.target.checked})}
              />
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and{' '}
              <a href="/privacy" target="_blank">Privacy Policy</a>
            </label>
            {errors.agreeTerms && <span className="error">{errors.agreeTerms}</span>}
          </div>
          
          {errors.submit && <div className="error-banner">{errors.submit}</div>}
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Redirecting to payment...' : 'Continue to Payment'}
          </button>
        </form>
        
        <p className="modal-footer">
          <img src="/stripe-badge.svg" alt="Powered by Stripe" />
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}
```

---

## 6. Stripe Dashboard Setup

### 6.1 Create Products & Prices

1. Go to Stripe Dashboard → Products
2. Create Product: "Hiring Audit - Diagnostic"
   - Price: $499.00 USD, One-time
   - Copy Price ID → `STRIPE_PRICE_DIAGNOSTIC`
3. Create Product: "Hiring Audit - Diagnostic + Design"
   - Price: $1,499.00 USD, One-time
   - Copy Price ID → `STRIPE_PRICE_DESIGN`

### 6.2 Configure Webhooks

1. Go to Developers → Webhooks
2. Add Endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select Events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
4. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 6.3 Configure Checkout Settings

1. Settings → Checkout Settings
2. Enable:
   - ✅ Google Pay
   - ✅ Apple Pay
   - ✅ Link (Stripe's one-click checkout)
3. Customize:
   - Brand color: `#0891B2`
   - Logo upload
   - Terms of Service URL
   - Privacy Policy URL

### 6.4 Create Promotion Codes (Optional)

1. Products → Coupons
2. Create: "LAUNCH20" - 20% off
3. Create: "FIRSTAUDIT" - $100 off

---

## 7. Email Templates

### 7.1 Welcome Email (After Purchase)

```html
Subject: Your Hiring Audit is Ready - {{companyName}}

Hi,

Thank you for purchasing the Hiring Audit ({{tierName}}) for {{companyName}}.

Your Audit ID: {{auditId}}

NEXT STEPS:

1. Configure Your Audit
   Set up company details and designate respondents:
   {{configUrl}}

2. Share Block Links
   Each respondent completes their relevant block (10-15 min each):
   
   • Block 1 (Executive): {{block1Url}}
   • Block 2 (TA Leadership): {{block2Url}}
   • Block 3 (Delivery): {{block3Url}}
   • Block 4 (Finance): {{block4Url}}
   • Block 5 (Technical): {{block5Url}}
   • Block 6 (Operations): {{block6Url}}
   • Block 7 (Reporting): {{block7Url}}

3. Track Progress
   Monitor completion status:
   {{dashboardUrl}}

4. Get Your Report
   Once all blocks are complete, your diagnostic report will be generated within 24 hours.

IMPORTANT:
- Respondents should complete blocks independently
- Don't share responses between roles
- Cross-validation works best with honest, uncoordinated answers

Questions? Reply to this email or contact support@yourdomain.com

— The Hiring Audit Team
```

---

## 8. Refund Handling

### 8.1 Refund Policy Implementation

```javascript
// api/refunds.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function processRefund(req, res) {
  const { auditId, reason } = req.body;
  
  // Get audit from database
  const audit = await getAuditById(auditId);
  
  if (!audit) {
    return res.status(404).json({ error: 'Audit not found' });
  }
  
  // Check refund eligibility
  const refundAmount = calculateRefundAmount(audit);
  
  if (refundAmount === 0) {
    return res.status(400).json({ 
      error: 'Refund not available',
      reason: 'Audit has been completed'
    });
  }
  
  try {
    // Get payment intent from checkout session
    const session = await stripe.checkout.sessions.retrieve(audit.stripeSessionId);
    
    const refund = await stripe.refunds.create({
      payment_intent: session.payment_intent,
      amount: refundAmount, // In cents
      reason: 'requested_by_customer',
      metadata: {
        audit_id: auditId,
        refund_reason: reason
      }
    });
    
    // Update audit status
    await updateAuditStatus(auditId, 'refunded');
    
    return res.json({
      success: true,
      refundId: refund.id,
      amount: refundAmount / 100
    });
    
  } catch (error) {
    console.error('Refund error:', error);
    return res.status(500).json({ error: 'Refund processing failed' });
  }
}

function calculateRefundAmount(audit) {
  const daysSincePurchase = (Date.now() - audit.createdAt) / (1000 * 60 * 60 * 24);
  const blocksCompleted = audit.completedBlocks || 0;
  
  // Full refund: within 14 days AND no blocks started
  if (daysSincePurchase <= 14 && blocksCompleted === 0) {
    return audit.amountPaid * 100; // Full refund in cents
  }
  
  // 50% refund: started but not completed
  if (blocksCompleted < 7 && !audit.reportGenerated) {
    return Math.round(audit.amountPaid * 50); // 50% in cents
  }
  
  // No refund: completed
  return 0;
}

module.exports = { processRefund };
```

---

## 9. Testing

### 9.1 Test Cards

| Scenario | Card Number |
|----------|-------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| Requires Auth | 4000 0025 0000 3155 |
| Insufficient Funds | 4000 0000 0000 9995 |

### 9.2 Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

### 9.3 Test Checklist

- [ ] Checkout creates session correctly
- [ ] Redirect to Stripe works
- [ ] Payment succeeds with test card
- [ ] Webhook receives `checkout.session.completed`
- [ ] Audit record created in database
- [ ] Email sent to customer
- [ ] Success page displays correctly
- [ ] Declined card shows error
- [ ] Refund processes correctly

---

## 10. Security Checklist

- [ ] Stripe keys in environment variables (never in code)
- [ ] Webhook signature verification enabled
- [ ] HTTPS only
- [ ] Price IDs validated server-side
- [ ] Rate limiting on checkout endpoint
- [ ] Audit ID generation is unpredictable
- [ ] Customer email validated
- [ ] PCI compliance (handled by Stripe Checkout)

---

## 11. Monitoring & Analytics

### Key Metrics to Track

- Checkout initiated count
- Checkout completion rate
- Payment success rate
- Average order value
- Refund rate
- Time from purchase to audit completion

### Stripe Dashboard Reports

- Payments → Overview
- Revenue by product
- Failed payments analysis
- Customer lifetime value

---

*Stripe Integration Specification v1.0*
