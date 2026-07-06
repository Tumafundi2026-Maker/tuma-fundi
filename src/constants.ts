// Tuma Fundi - User-editable constants
// Edit values here for brand updates, API keys, contact info, etc.

// === IntaSend Payment Gateway ===
export const INTASEND_PUBLIC_KEY =
  'ISPubKey_live_f8fc9ff6-7d1c-49f1-922b-64c266ab8f44';
export const INTASEND_WEBHOOK_SECRET = 'Otuoma2013@2026';
export const INTASEND_CURRENCY = 'KES';
export const INTASEND_CHECKOUT_URL =
  'https://payment.intasend.com/api/v1/checkout/';
export const INTASEND_PAYMENT_METHODS = ['M-PESA', 'AIRTEL-MONEY', 'CARD'] as const;

// === Payment Flow User-Facing Copy ===
export const PAYMENT_FLOW_COPY = {
  phoneInputTitle: 'Enter M-Pesa Number',
  phoneInputSubtitle:
    'We will send an STK push to your phone. You will then enter your M-Pesa PIN to complete payment.',
  phoneSubmitLabel: 'Send STK Push',
  privacyNote:
    'Your number is encrypted and used only for this payment. No marketing messages, ever.',
  loadingSdkTitle: 'Loading Payment Gateway',
  loadingSdkSubtitle: 'Establishing secure connection...',
  sendingStkTitle: 'Sending STK Push to',
  awaitingPinTitle: 'Check Your Phone',
  awaitingPinSubtitle:
    'Enter your M-Pesa PIN on your phone to complete the payment of KES {amount}.',
  awaitingPinWait: 'Waiting for your PIN...',
  processingTitle: 'Verifying Payment',
  processingSubtitle:
    'Confirming your transaction with Safaricom. This may take a moment.',
  successTitle: 'Payment Successful',
  successSubtitle: 'KES {amount} paid. Your booking is confirmed.',
  successButton: 'Continue',
  successToast: 'Payment completed successfully!',
  failedTitle: 'Payment Not Completed',
  failedSubtitle: 'Something went wrong. Please try again.',
  failedCancel: 'Cancel',
  failedRetry: 'Try Again',
  failedToast: 'Payment was not completed. Please try again.',
  buttonProcessing: 'Processing...',
} as const;

// === Brand ===
export const BRAND_NAME = 'Tuma Fundi';
export const BRAND_TAGLINE = 'Find trusted artisans. Pay securely.';

// === Contact ===
export const CONTACT_EMAIL = 'support@tumafundi.co.ke';
export const CONTACT_PHONE = '+254 700 000 000';
