import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { shipments } from './shipments';
import { carriers } from './carriers';
import { shipmentAttemptStatusEnum } from '../enums/shipping';

export const shipmentAttempts = pgTable(
  'shipment_attempts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    shipmentId: text('shipment_id')
      .notNull()
      .references(() => shipments.id),
    carrierId: text('carrier_id')
      .notNull()
      .references(() => carriers.id),
    trackingNumber: text('tracking_number').notNull(), // internal carrier tracking number
    trackingHash: text('tracking_hash').notNull().unique(), // public safe tracking hash
    status: shipmentAttemptStatusEnum('status').default('PENDING').notNull(),
    carrierMetadata: jsonb('carrier_metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    shipmentIdx: index('shipment_attempt_shipment_idx').on(t.shipmentId),
    trackingHashIdx: index('shipment_attempt_tracking_hash_idx').on(t.trackingHash),
    trackingNumberIdx: index('shipment_attempt_tracking_number_idx').on(t.trackingNumber),
  }),
);
