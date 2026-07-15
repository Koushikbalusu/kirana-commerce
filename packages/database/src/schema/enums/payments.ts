import { pgEnum } from 'drizzle-orm/pg-core';

export const paymentIntentStatusEnum = pgEnum('payment_intent_status', [
  'REQUIRES_PAYMENT_METHOD',
  'REQUIRES_ACTION',
  'PROCESSING',
  'SUCCEEDED',
  'CANCELED',
]);

export const paymentInternalStatusEnum = pgEnum('payment_internal_status', [
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
]);

export const captureStrategyEnum = pgEnum('capture_strategy', ['AUTOMATIC', 'MANUAL']);

export const refundStatusEnum = pgEnum('refund_status', ['PENDING', 'SUCCEEDED', 'FAILED']);

export const webhookStatusEnum = pgEnum('webhook_status', [
  'RECEIVED',
  'VALIDATED',
  'PROCESSED',
  'FAILED',
]);
