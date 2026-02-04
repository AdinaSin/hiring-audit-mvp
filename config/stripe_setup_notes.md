# Stripe Setup Notes

## Products to Create in Stripe Dashboard

### Product 1: Hiring Audit - Diagnostic
- **Name**: Hiring Audit - Level 1 Diagnostic
- **Price**: $499.00 USD (one-time)
- **Price ID**: Save as `STRIPE_PRICE_DIAGNOSTIC`

### Product 2: Hiring Audit - Diagnostic + Design  
- **Name**: Hiring Audit - Level 2 Diagnostic + Design
- **Price**: $1,499.00 USD (one-time)
- **Price ID**: Save as `STRIPE_PRICE_DESIGN`

### Level 3: Custom Pricing
- No Stripe product needed
- Handle via manual invoicing

## Webhook Configuration

### Endpoint URL
`https://yourdomain.com/api/webhooks/stripe`

### Events to Subscribe
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.payment_succeeded`

### Signing Secret
Save webhook signing secret as `STRIPE_WEBHOOK_SECRET`

## Checkout Settings (Dashboard > Settings > Checkout)
- Enable Google Pay
- Enable Apple Pay
- Enable Link (one-click checkout)
- Brand color: #0891B2
- Upload logo
- Set Terms of Service URL
- Set Privacy Policy URL

## Promotion Codes (Optional)
- LAUNCH20: 20% off
- FIRSTAUDIT: $100 off

## Test Cards
| Card | Number |
|------|--------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| Auth Required | 4000 0025 0000 3155 |

## Local Testing
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
