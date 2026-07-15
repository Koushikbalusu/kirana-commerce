import { pgTable, text, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const promotions = pgTable(
  'promotions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    description: text('description'),
    priority: integer('priority').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    startsAt: timestamp('starts_at').defaultNow().notNull(),
    endsAt: timestamp('ends_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    promoTimeIdx: index('promo_time_idx').on(t.startsAt, t.endsAt),
  }),
);
