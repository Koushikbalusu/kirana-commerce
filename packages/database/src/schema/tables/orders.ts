import { pgTable, text, timestamp, index, unique, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';
import { checkoutSessions } from './checkout_sessions';
import { financialStatusEnum, fulfillmentStatusEnum } from '../enums/orders';

export const orders = pgTable(
  'orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderNumber: text('order_number').notNull().unique(), // Human-readable e.g. ORD-12345
    userId: text('user_id').references(() => users.id),
    checkoutSessionId: text('checkout_session_id')
      .notNull()
      .unique()
      .references(() => checkoutSessions.id),

    financialStatus: financialStatusEnum('financial_status').default('UNPAID').notNull(),
    fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status').default('UNFULFILLED').notNull(),

    // Snapshots
    customerSnapshot: jsonb('customer_snapshot').notNull(), // { name, email, phone }
    shippingAddressSnapshot: jsonb('shipping_address_snapshot').notNull(),
    billingAddressSnapshot: jsonb('billing_address_snapshot').notNull(),
    totalsSnapshot: jsonb('totals_snapshot').notNull(), // { subtotal, discountTotal, taxTotal, shippingTotal, grandTotal, currency }

    paymentReference: text('payment_reference'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userIdIdx: index('order_user_id_idx').on(t.userId),
    finStatusIdx: index('order_financial_status_idx').on(t.financialStatus),
    fulStatusIdx: index('order_fulfillment_status_idx').on(t.fulfillmentStatus),
  }),
);
