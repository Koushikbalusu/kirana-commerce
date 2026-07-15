export interface PaymentProviderAdapter {
  authorize(amount: number, currency: string, idempotencyKey: string): Promise<any>;
  capture(providerTransactionId: string, amount?: number): Promise<any>;
  refund(providerTransactionId: string, amount: number): Promise<any>;
}
// Do not implement Stripe SDK, Razorpay SDK, etc. Only the interface.
