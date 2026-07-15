export interface PaymentEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type PaymentIntentCreated = PaymentEvent<{ intentId: string }>;
export type PaymentAuthorized = PaymentEvent<{ paymentId: string }>;
export type PaymentCaptured = PaymentEvent<{ paymentId: string }>;
export type PaymentFailed = PaymentEvent<{ attemptId: string; failureCode: string }>;
export type RefundCreated = PaymentEvent<{ refundId: string }>;
export type RefundCompleted = PaymentEvent<{ refundId: string }>;
export type WebhookReceived = PaymentEvent<{ webhookId: string }>;
