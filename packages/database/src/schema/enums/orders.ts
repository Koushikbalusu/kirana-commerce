import { pgEnum } from 'drizzle-orm/pg-core';

export const checkoutSessionStatusEnum = pgEnum('checkout_session_status', [
  'ACTIVE',
  'PAYMENT_PENDING',
  'COMPLETED',
  'EXPIRED',
  'FAILED',
]);

export const financialStatusEnum = pgEnum('financial_status', [
  'UNPAID',
  'AUTHORIZED',
  'PAID',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
]);

export const fulfillmentStatusEnum = pgEnum('fulfillment_status', [
  'UNFULFILLED',
  'PROCESSING',
  'PARTIALLY_SHIPPED',
  'SHIPPED',
  'DELIVERED',
]);
