import { pgTable, text, timestamp, index, integer } from 'drizzle-orm/pg-core';
import { customerAddresses } from './customer_addresses';

export const addressVersions = pgTable(
  'address_versions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    addressId: text('address_id')
      .notNull()
      .references(() => customerAddresses.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zip: text('zip').notNull(),
    country: text('country').notNull(),
    lat: text('lat'),
    long: text('long'),
    landmark: text('landmark'),
    instructions: text('instructions'),
    validationStatus: text('validation_status').default('UNVALIDATED').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    addrVerIdx: index('addr_ver_idx').on(t.addressId, t.version),
  }),
);
