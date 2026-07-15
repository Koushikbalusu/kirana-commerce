import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const notificationProviders = pgTable('notification_providers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(), // e.g. SENDGRID, TWILIO
  channel: text('channel').notNull(), // EMAIL, SMS, PUSH, WHATSAPP
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
