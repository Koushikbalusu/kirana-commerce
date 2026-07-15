import { relations } from 'drizzle-orm';
import { categories } from '../tables/categories';
import { brands } from '../tables/brands';
import { products } from '../tables/products';
import { productImages } from '../tables/product_images';
import { productVariants } from '../tables/product_variants';
import { productAttributes } from '../tables/product_attributes';
import { attributeValues } from '../tables/attribute_values';

export const categoryRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_hierarchy',
  }),
  children: many(categories, { relationName: 'category_hierarchy' }),
  products: many(products),
}));

export const brandRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
}));

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  attributeValues: many(attributeValues),
}));

export const attributeValueRelations = relations(attributeValues, ({ one }) => ({
  attribute: one(productAttributes, {
    fields: [attributeValues.attributeId],
    references: [productAttributes.id],
  }),
  variant: one(productVariants, {
    fields: [attributeValues.variantId],
    references: [productVariants.id],
  }),
}));
