import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { fulfillments } from './fulfillments';
import { shipmentStatusEnum } from '../enums/shipping';

export const shipments = pgTable(
  'shipments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    fulfillmentId: text('fulfillment_id')
      .notNull()
      .references(() => fulfillments.id),
    status: shipmentStatusEnum('status').default('CREATED').notNull(),
    shippingAddressSnapshot: jsonb('shipping_address_snapshot').notNull(),
    customerNameSnapshot: text('customer_name_snapshot').notNull(),
    customerPhoneSnapshot: text('customer_phone_snapshot').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    fulfillmentIdx: index('shipment_fulfillment_idx').on(t.fulfillmentId),
    statusIdx: index('shipment_status_idx').on(t.status),
  }),
);
