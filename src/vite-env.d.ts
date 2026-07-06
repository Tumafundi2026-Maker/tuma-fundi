/// <reference types="vite/client" />

// IntaSend Checkout SDK type declarations
interface IntaSendCheckoutOptions {
  publicKey: string;
  environment?: 'LIVE' | 'SANDBOX';
  currency?: string;
  amount?: number;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  method?: string;
  redirectUrl?: string;
  host?: string;
}

interface IntaSendCheckoutInstance {
  on(event: string, callback: (data: any) => void): void;
  init(): void;
}

interface IntaSendCheckoutConstructor {
  new (options: IntaSendCheckoutOptions): IntaSendCheckoutInstance;
}

declare const IntaSendCheckout: IntaSendCheckoutConstructor;
