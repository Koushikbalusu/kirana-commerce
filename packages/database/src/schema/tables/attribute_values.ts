import { pgTable, text } from 'drizzle-orm/pg-core';
import { productAttributes } from './product_attributes';
import { productVariants } from './product_variants';

export const attributeValues = pgTable('attribute_values', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  attributeId: text('attribute_id')
    .notNull()
    .references(() => productAttributes.id, { onDelete: 'cascade' }),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
  value: text('value').notNull(), // e.g. "Large", "Red"
});
