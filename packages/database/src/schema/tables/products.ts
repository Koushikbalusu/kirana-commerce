import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { productStatusEnum } from '../enums/catalog';
import { categories } from './categories';
import { brands } from './brands';

export const products = pgTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  status: productStatusEnum('status').default('DRAFT').notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  brandId: text('brand_id').references(() => brands.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});
