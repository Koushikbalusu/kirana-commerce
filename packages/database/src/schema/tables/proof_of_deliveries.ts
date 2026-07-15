import { pgTable, text, timestamp, numeric, index } from 'drizzle-orm/pg-core';
import { shipmentAttempts } from './shipment_attempts';

export const proofOfDeliveries = pgTable('proof_of_deliveries', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  attemptId: text('attempt_id')
    .notNull()
    .unique()
    .references(() => shipmentAttempts.id),
  signatureUrl: text('signature_url'),
  photoUrl: text('photo_url'),
  otpVerified: text('otp_verified'), // null if not used
  receiverName: text('receiver_name'),
  gpsLatitude: numeric('gps_latitude'),
  gpsLongitude: numeric('gps_longitude'),
  deviceId: text('device_id'),
  deliveryTimestamp: timestamp('delivery_timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
