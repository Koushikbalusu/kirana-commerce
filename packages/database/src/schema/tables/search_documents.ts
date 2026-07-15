import { pgTable, text, timestamp, jsonb, boolean, integer, index } from 'drizzle-orm/pg-core';
import { searchIndices } from './search_indices';

export const searchDocuments = pgTable(
  'search_documents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    indexId: text('index_id')
      .notNull()
      .references(() => searchIndices.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    brand: text('brand'),
    category: text('category'),
    attributes: jsonb('attributes'),
    thumbnail: text('thumbnail'),
    availability: boolean('availability').default(false).notNull(),
    searchPrice: integer('search_price').notNull(), // Smallest currency unit
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    indexIdx: index('search_doc_index_idx').on(t.indexId),
    productIdx: index('search_doc_product_idx').on(t.productId),
  }),
);
