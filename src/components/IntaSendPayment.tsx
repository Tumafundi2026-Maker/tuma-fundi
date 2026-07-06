import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LoaderCircle, CheckCircle2, XCircle, ShieldCheck, Wallet, ArrowLeft } from 'lucide-react';
import { DeviceMobile } from '@phosphor-icons/react';
import {
  INTASEND_PUBLIC_KEY,
  INTASEND_CURRENCY,
  PAYMENT_FLOW_COPY,
} from '@/constants';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    IntaSend?: (options: IntaSendOptions) => void;
  }
}

interface IntaSendOptions {
  publicAPIKey: string;
  live: boolean;
  amount: number;
  currency: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  api_ref: string;
  redirect_url?: string;
  onSuccess?: (response: IntaSendResponse) => void;
  onFailed?: (response: IntaSendResponse) => void;
  onProcessing?: (response: IntaSendResponse) => void;
}

interface IntaSendResponse {
  id: string;
  invoice_id: string;
  state: string;
  provider: string;
  value: string;
  net_amount: string;
  currency: string;
  api_ref: string;
  customer?: {
    name?: string;
    email?: string;
    phone_number?: string;
  };
}

interface IntaSendPaymentProps {
  amount: number;
  bookingId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onComplete?: (response: IntaSendResponse) => void;
  onClose?: () => void;
  triggerLabel?: string;
  className?: string;
}

type PaymentStep =
  | 'idle'
  | 'phone-input'
  | 'loading-sdk'
  | 'sending-stk'
  | 'awaiting-pin'
  | 'processing'
  | 'success'
  | 'failed';

/** Normalize Kenyan phone numbers to IntaSend format: 254XXXXXXXXX */
function normalizeKenyanPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.replace(/^0+/, '');
  if (digits.length === 9 && digits.startsWith('7')) return `254${digits}`;
  if (digits.length === 12 && digits.startsWith('254') && /^254[71]/.test(digits)) return digits;
  return null;
}

function formatPhoneDisplay(normalized: string): string {
  if (normalized.length === 12) return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
  return normalized;
}

function isValidKenyanMobile(normalized: string): boolean {
  return /^254[71]\d{8}$/.test(normalized);
}

const springSnappy = { type: 'spring' as const, stiffness: 400, damping: 30 };
const springBouncy = { type: 'spring' as const, stiffness: 300, damping: 20 };

export function IntaSendPayment({
  amount,
  bookingId,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  onComplete,
  onClose,
  triggerLabel = 'Pay Now',
  className = '',
}: IntaSendPaymentProps) {
  const [step, setStep] = useState<PaymentStep>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneRaw, setPhoneRaw] = useState(customerPhone);
  const [phoneError, setPhoneError] = useState('');
  const [phoneNormalized, setPhoneNormalized] = useState('');

  const loadSdk = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.IntaSend) { resolve(true); return; }
      const existing = document.querySelector('script[src="https://unpkg.com/intasend-checkout-sdk@latest/dist/bundle.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/intasend-checkout-sdk@latest/dist/bundle.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }, []);

  const triggerStkPush = useCallback(async (normalizedPhone: string) => {
    setStep('loading-sdk');
    const ready = await loadSdk();
    if (!ready) {
      toast.error('Payment gateway unavailable. Please check your connection and try again.');
      setStep('idle');
      return;
    }
    setStep('sending-stk');

    const invoiceId = `INV-${bookingId}-${Date.now()}`;
    if (supabase) {
      supabase.from('intasend_payments').insert({
        invoice_id: invoiceId,
        booking_id: bookingId,
        amount: amount,
        currency: INTASEND_CURRENCY,
        status: 'PENDING',
        provider: 'M-PESA',
        customer_name: customerName || null,
        customer_email: customerEmail || null,
        customer_phone: normalizedPhone,
        api_ref: bookingId,
      }).then(({ error }) => { if (error) console.warn('Pre-record warning:', error.message); });
    }

    const [firstName, ...lastParts] = (customerName || 'Customer').split(' ');
    const lastName = lastParts.join(' ') || '';

    await new Promise((r) => setTimeout(r, 1200));
    setStep('awaiting-pin');

    window.IntaSend!({
      publicAPIKey: INTASEND_PUBLIC_KEY,
      live: true,
      amount,
      currency: INTASEND_CURRENCY,
      email: customerEmail || undefined,
      phone_number: normalizedPhone,
      first_name: firstName,
      last_name: lastName,
      api_ref: bookingId,
      onSuccess: (response: IntaSendResponse) => {
        setStep('success');
        toast.success(PAYMENT_FLOW_COPY.successToast);
        onComplete?.(response);
      },
      onFailed: (response: IntaSendResponse) => {
        setStep('failed');
        setErrorMessage(`Payment failed: ${response.state || 'Transaction was not completed'}`);
        toast.error(PAYMENT_FLOW_COPY.failedToast);
      },
      onProcessing: () => setStep('processing'),
    });
  }, [amount, bookingId, customerName, customerEmail, loadSdk, onComplete]);

  const handlePhoneChange = (value: string) => {
    setPhoneRaw(value);
    setPhoneError('');
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 9) {
      const normalized = normalizeKenyanPhone(digits);
      if (normalized && isValidKenyanMobile(normalized)) {
        setPhoneNormalized(normalized);
        return;
      }
    }
    setPhoneNormalized('');
  };

  const handlePayClick = useCallback(async () => {
    if (!customerPhone) { setStep('phone-input'); loadSdk(); return; }
    const normalized = normalizeKenyanPhone(customerPhone);
    if (!normalized || !isValidKenyanMobile(normalized)) {
      toast.error('Invalid phone number. Please enter a valid Kenyan mobile number.');
      setStep('phone-input');
      loadSdk();
      return;
    }
    setPhoneNormalized(normalized);
    await triggerStkPush(normalized);
  }, [customerPhone, loadSdk, triggerStkPush]);

  const handlePhoneSubmit = useCallback(async () => {
    if (!phoneNormalized) { setPhoneError('Enter a valid M-Pesa number (e.g., 0712 345 678)'); return; }
    if (!isValidKenyanMobile(phoneNormalized)) { setPhoneError("This doesn't look like a valid Kenyan mobile number"); return; }
    setPhoneError('');
    await triggerStkPush(phoneNormalized);
  }, [phoneNormalized, triggerStkPush]);

  const rippleVariants = {
    animate: { scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } },
  };

  const pulseVariants = {
    animate: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } },
  };

  const dotVariants = (delay: number) => ({
    animate: { y: [0, -6, 0], transition: { repeat: Infinity, duration: 1.2, delay, ease: 'easeInOut' } },
  });

  // === Overlay ===
  const renderOverlay = () => {
    if (step === 'idle') return null;
    return (
      <AnimatePresence>
        <motion.div
          key="payment-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={springSnappy}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
          >
            {/* PHONE INPUT */}
            {step === 'phone-input' && (
              <div className="space-y-5">
                <button onClick={() => { setStep('idle'); onClose?.(); }} className="absolute top-4 left-4 p-2 rounded-xl hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springBouncy, delay: 0.1 }} className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <DeviceMobile className="w-8 h-8 text-primary" weight="fill" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{PAYMENT_FLOW_COPY.phoneInputTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{PAYMENT_FLOW_COPY.phoneInputSubtitle}</p>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 px-4 h-14 rounded-2xl border-2 border-border bg-muted/50 focus-within:border-primary focus-within:bg-background transition-all">
                    <span className="text-sm font-semibold text-muted-foreground shrink-0">+254</span>
                    <input
                      type="tel" inputMode="numeric" autoFocus
                      value={phoneRaw}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="712 345 678"
                      className="flex-1 bg-transparent text-foreground text-lg font-medium placeholder:text-muted-foreground/40 outline-none"
                      maxLength={13}
                      onKeyDown={(e) => { if (e.key === 'Enter') handlePhoneSubmit(); }}
                    />
                    {phoneNormalized && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </motion.div>
                    )}
                  </div>
                  {phoneError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-2 text-left pl-2">{phoneError}</motion.p>
                  )}
                </div>
                <div className="bg-muted/50 rounded-2xl p-3 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-muted-foreground text-left">{PAYMENT_FLOW_COPY.privacyNote}</p>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handlePhoneSubmit} disabled={!phoneNormalized} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
                  {PAYMENT_FLOW_COPY.phoneSubmitLabel}
                </motion.button>
              </div>
            )}

            {/* LOADING SDK */}
            {step === 'loading-sdk' && (
              <div className="space-y-5 py-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mx-auto w-14 h-14">
                  <LoaderCircle className="w-14 h-14 text-primary" />
                </motion.div>
                <h3 className="text-lg font-bold text-foreground">{PAYMENT_FLOW_COPY.loadingSdkTitle}</h3>
                <p className="text-sm text-muted-foreground">{PAYMENT_FLOW_COPY.loadingSdkSubtitle}</p>
              </div>
            )}

            {/* SENDING STK PUSH */}
            {step === 'sending-stk' && (
              <div className="space-y-5 py-4">
                <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                  <motion.div variants={rippleVariants} animate="animate" className="absolute inset-0 rounded-full border-2 border-primary/30" />
                  <motion.div variants={rippleVariants} animate="animate" className="absolute inset-2 rounded-full border-2 border-primary/20" style={{ animationDelay: '0.4s' }} />
                  <motion.div variants={pulseVariants} animate="animate" className="relative z-10 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DeviceMobile className="w-6 h-6 text-primary" weight="fill" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{PAYMENT_FLOW_COPY.sendingStkTitle}</h3>
                  <p className="text-sm font-semibold text-primary mt-1">{formatPhoneDisplay(phoneNormalized)}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2].map((i) => (<motion.div key={i} variants={dotVariants(i * 0.15)} animate="animate" className="w-2 h-2 rounded-full bg-primary/60" />))}
                </div>
              </div>
            )}

            {/* AWAITING PIN */}
            {step === 'awaiting-pin' && (
              <div className="space-y-5 py-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 0 0px rgba(59,130,246,0)', '0 0 0 16px rgba(59,130,246,0)', '0 0 0 0px rgba(59,130,246,0)'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="mx-auto w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center"
                >
                  <DeviceMobile className="w-10 h-10 text-amber-600" weight="duotone" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{PAYMENT_FLOW_COPY.awaitingPinTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-[28ch] mx-auto">
                    {PAYMENT_FLOW_COPY.awaitingPinSubtitle.replace('{amount}', amount.toLocaleString())}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  <span>{PAYMENT_FLOW_COPY.awaitingPinWait}</span>
                </div>
              </div>
            )}

            {/* PROCESSING */}
            {step === 'processing' && (
              <div className="space-y-5 py-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="mx-auto w-14 h-14">
                  <LoaderCircle className="w-14 h-14 text-primary" />
                </motion.div>
                <h3 className="text-lg font-bold text-foreground">{PAYMENT_FLOW_COPY.processingTitle}</h3>
                <p className="text-sm text-muted-foreground">{PAYMENT_FLOW_COPY.processingSubtitle}</p>
              </div>
            )}

            {/* SUCCESS */}
            {step === 'success' && (
              <div className="space-y-5 py-4">
                <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBouncy, delay: 0.1 }} className="mx-auto w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{PAYMENT_FLOW_COPY.successTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{PAYMENT_FLOW_COPY.successSubtitle.replace('{amount}', amount.toLocaleString())}</p>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setStep('idle'); onClose?.(); }} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all">
                  {PAYMENT_FLOW_COPY.successButton}
                </motion.button>
              </div>
            )}

            {/* FAILED */}
            {step === 'failed' && (
              <div className="space-y-5 py-4">
                <motion.div initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBouncy, delay: 0.1 }} className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{PAYMENT_FLOW_COPY.failedTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{errorMessage || PAYMENT_FLOW_COPY.failedSubtitle}</p>
                </div>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setStep('idle'); onClose?.(); }} className="flex-1 h-13 rounded-2xl bg-muted text-foreground font-medium transition-colors hover:bg-muted/80">
                    {PAYMENT_FLOW_COPY.failedCancel}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setStep('idle'); if (phoneNormalized) triggerStkPush(phoneNormalized); }} className="flex-1 h-13 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all">
                    {PAYMENT_FLOW_COPY.failedRetry}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        onClick={handlePayClick}
        disabled={step !== 'idle' && step !== 'failed'}
        className={`inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Wallet className="w-5 h-5" />
        {step !== 'idle' && step !== 'failed' ? PAYMENT_FLOW_COPY.buttonProcessing : triggerLabel}
      </motion.button>
      {renderOverlay()}
    </>
  );
}

export default IntaSendPayment;
