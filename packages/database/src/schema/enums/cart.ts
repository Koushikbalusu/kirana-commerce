import { pgEnum } from 'drizzle-orm/pg-core';

export const cartStatusEnum = pgEnum('cart_status', [
  'ACTIVE',
  'CHECKOUT_PENDING',
  'ABANDONED',
  'CONVERTED_TO_ORDER',
  'EXPIRED',
]);
