import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { MetaTags } from '../components/SEO';
import {
  Smartphone, ShieldCheck, CheckCircle2, XCircle, Loader2,
  ArrowLeft, CreditCard, AlertCircle, Zap, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const INTASEND_PUBLIC_KEY = 'ISPubKey_live_f8fc9ff6-7d1c-49f1-922b-64c266ab8f44';
const INTASEND_ENVIRONMENT = 'LIVE' as const;
const INTASEND_CURRENCY = 'KES';
const WEBHOOK_URL = 'https://tumafundi.ke/api/payments/instasend/webhook';

type PaymentMethod = 'M-PESA' | 'AIRTEL';
type PaymentStatus = 'idle' | 'initializing' | 'in-progress' | 'complete' | 'failed' | 'cancelled';

interface PaymentState {
  status: PaymentStatus;
  method: PaymentMethod | null;
  amount: number;
  trackingId: string | null;
  errorMessage: string | null;
}

export const PaymentCheckout = () => {
  const { currentUser } = useStore();
  const [searchParams] = useSearchParams();
  const prefillAmount = searchParams.get('amount');

  const [payment, setPayment] = useState<PaymentState>({
    status: 'idle',
    method: null,
    amount: prefillAmount ? parseFloat(prefillAmount) : 0,
    trackingId: null,
    errorMessage: null,
  });

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).IntaSendCheckout) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://payment.intasend.com/checkout/checkout.js';
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => {
      setSdkError(true);
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const validateAmount = (amount: number): boolean => {
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than KES 0');
      return false;
    }
    if (amount < 10) {
      toast.error('Minimum payment amount is KES 10');
      return false;
    }
    if (amount > 150000) {
      toast.error('Maximum payment amount is KES 150,000');
      return false;
    }
    return true;
  };

  const initiatePayment = useCallback((method: PaymentMethod) => {
    if (!validateAmount(payment.amount)) return;

    if (!sdkLoaded) {
      toast.error('Payment gateway is still loading. Please wait a moment.');
      return;
    }

    setPayment(prev => ({
      ...prev,
      status: 'initializing',
      method,
      errorMessage: null,
    }));

    try {
      const IntaSend = (window as any).IntaSendCheckout;

      if (!IntaSend) {
        throw new Error('IntaSend SDK not available');
      }

      const checkoutOptions: any = {
        publicKey: INTASEND_PUBLIC_KEY,
        environment: INTASEND_ENVIRONMENT,
        currency: INTASEND_CURRENCY,
        amount: payment.amount,
        country: 'KE',
        method: method === 'M-PESA' ? 'M-PESA' : 'AIRTEL',
        host: WEBHOOK_URL,
      };

      if (currentUser) {
        checkoutOptions.firstName = currentUser.name.split(' ')[0] || 'Customer';
        checkoutOptions.lastName = currentUser.name.split(' ').slice(1).join(' ') || 'Tuma Fundi';
        checkoutOptions.phoneNumber = currentUser.phone || '';
      }

      const intasend = new IntaSend(checkoutOptions);

      intasend.on('IN_PROGRESS', (data: any) => {
        setPayment(prev => ({
          ...prev,
          status: 'in-progress',
          trackingId: data?.tracking_id || null,
        }));
        toast.info('Payment in progress. Please check your phone for the prompt.');
      });

      intasend.on('COMPLETE', (data: any) => {
        setPayment(prev => ({
          ...prev,
          status: 'complete',
          trackingId: data?.tracking_id || prev.trackingId,
        }));
        toast.success('Payment completed successfully!');
      });

      intasend.on('FAILED', (data: any) => {
        setPayment(prev => ({
          ...prev,
          status: 'failed',
          trackingId: data?.tracking_id || prev.trackingId,
          errorMessage: data?.failed_reason || 'Payment failed. Please try again.',
        }));
        toast.error('Payment failed. Please try again.');
      });

      intasend.init();

      setPayment(prev => ({
        ...prev,
        status: 'in-progress',
      }));

    } catch (error: any) {
      console.error('IntaSend initialization error:', error);
      setPayment(prev => ({
        ...prev,
        status: 'failed',
        errorMessage: error?.message || 'Failed to initialize payment. Please try again.',
      }));
      toast.error('Failed to start payment. Please try again.');
    }
  }, [payment.amount, sdkLoaded, currentUser]);

  const resetPayment = () => {
    setPayment({
      status: 'idle',
      method: null,
      amount: payment.amount,
      trackingId: null,
      errorMessage: null,
    });
  };

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'complete':
        return <CheckCircle2 className="h-16 w-16 text-emerald-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'in-progress':
      case 'initializing':
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
      default:
        return <CreditCard className="h-16 w-16 text-slate-300" />;
    }
  };

  const getStatusMessage = () => {
    switch (payment.status) {
      case 'initializing':
        return 'Initializing payment gateway...';
      case 'in-progress':
        return payment.method === 'M-PESA'
          ? 'Check your phone for the M-Pesa prompt. Enter your PIN to complete payment.'
          : 'Check your phone for the Airtel Money prompt. Enter your PIN to complete payment.';
      case 'complete':
        return 'Payment received successfully!';
      case 'failed':
        return payment.errorMessage || 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40">
      <MetaTags
        title="Payment Checkout"
        description="Complete your payment securely via M-Pesa or Airtel Money on Tuma Fundi."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Lock className="h-3.5 w-3.5" />
            Secure Payment
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Payment Checkout
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Pay securely via mobile money. Choose your preferred method below.
          </p>
        </div>

        <AnimatePresence>
          {payment.status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className={`border-2 ${
                payment.status === 'complete' ? 'border-emerald-200 bg-emerald-50/50' :
                payment.status === 'failed' || payment.status === 'cancelled' ? 'border-red-200 bg-red-50/50' :
                'border-primary/20 bg-primary/5'
              }`}>
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
                  {getStatusIcon()}
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900">
                      {getStatusMessage()}
                    </p>
                    {payment.trackingId && (
                      <p className="text-xs text-slate-500 font-mono">
                        Tracking: {payment.trackingId}
                      </p>
                    )}
                    {payment.method && (
                      <Badge variant="outline" className="mt-2">
                        {payment.method === 'M-PESA' ? 'M-Pesa' : 'Airtel Money'} - KES {payment.amount.toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  {(payment.status === 'complete' || payment.status === 'failed') && (
                    <Button
                      onClick={resetPayment}
                      variant="outline"
                      className="mt-4"
                    >
                      Make Another Payment
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {payment.status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-slate-600">
                    Enter amount in KES
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                      KES
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      min="10"
                      max="150000"
                      step="1"
                      placeholder="0.00"
                      value={payment.amount || ''}
                      onChange={(e) => setPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="pl-16 h-14 text-xl font-bold text-slate-900 rounded-xl border-2 focus:border-primary"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Min: KES 10 - Max: KES 150,000
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => initiatePayment('M-PESA')}
                    disabled={!sdkLoaded || sdkError || payment.amount <= 0}
                    className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 transition-shadow">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-black text-slate-900 text-base">M-Pesa</p>
                      <p className="text-xs text-slate-500 font-medium">STK Push</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                        <Zap className="h-3 w-3 mr-1" /> Instant
                      </Badge>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => initiatePayment('AIRTEL')}
                    disabled={!sdkLoaded || sdkError || payment.amount <= 0}
                    className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 hover:border-red-400 hover:shadow-lg hover:shadow-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200 group-hover:shadow-red-300 transition-shadow">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-black text-slate-900 text-base">Airtel Money</p>
                      <p className="text-xs text-slate-500 font-medium">STK Push</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                        <Zap className="h-3 w-3 mr-1" /> Instant
                      </Badge>
                    </div>
                  </motion.button>
                </div>
              </CardContent>
            </Card>

            {!sdkLoaded && !sdkError && (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Loading payment gateway...</p>
              </div>
            )}

            {sdkError && (
              <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">
                  Payment gateway failed to load. Please refresh the page and try again.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Secured by IntaSend</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="h-4 w-4 text-slate-400" />
                <span>256-bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-slate-400" />
                <span>PCI DSS Compliant</span>
              </div>
            </div>

            {currentUser && (
              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Payment will be processed for <span className="font-semibold text-slate-600">{currentUser.name}</span>
                  {currentUser.phone && (
                    <span> - <span className="font-mono">{currentUser.phone}</span></span>
                  )}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentCheckout;
