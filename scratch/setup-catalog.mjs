import fs from 'fs';
import path from 'path';

const rootDir = '/home/koushik/Documents/kirana-commerce';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ----------------------------------------------------------------------
// 1. DATABASE SCHEMA
// ----------------------------------------------------------------------
const dbSchemaTables = path.join(rootDir, 'packages/database/src/schema/tables');
const dbSchemaEnums = path.join(rootDir, 'packages/database/src/schema/enums');
const dbSchemaRelations = path.join(rootDir, 'packages/database/src/schema/relations');

ensureDir(dbSchemaEnums);
ensureDir(dbSchemaRelations);

fs.writeFileSync(
  path.join(dbSchemaEnums, 'catalog.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const productStatusEnum = pgEnum("product_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "DELETED"
]);
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'categories.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: text("parent_id"), // Adjacency list self-referencing foreign key mapped in relations
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'brands.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'products.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { productStatusEnum } from "../enums/catalog";
import { categories } from "./categories";
import { brands } from "./brands";

export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: productStatusEnum("status").default("DRAFT").notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id),
  brandId: text("brand_id").references(() => brands.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"), // Soft delete
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'product_images.ts'),
  `
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'product_variants.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";

export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'product_attributes.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const productAttributes = pgTable("product_attributes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(), // e.g. "Size", "Color"
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'attribute_values.ts'),
  `
import { pgTable, text } from "drizzle-orm/pg-core";
import { productAttributes } from "./product_attributes";
import { productVariants } from "./product_variants";

export const attributeValues = pgTable("attribute_values", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  attributeId: text("attribute_id").notNull().references(() => productAttributes.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  value: text("value").notNull(), // e.g. "Large", "Red"
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'catalog.ts'),
  `
import { relations } from "drizzle-orm";
import { categories } from "../tables/categories";
import { brands } from "../tables/brands";
import { products } from "../tables/products";
import { productImages } from "../tables/product_images";
import { productVariants } from "../tables/product_variants";
import { productAttributes } from "../tables/product_attributes";
import { attributeValues } from "../tables/attribute_values";

export const categoryRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_hierarchy"
  }),
  children: many(categories, { relationName: "category_hierarchy" }),
  products: many(products),
}));

export const brandRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id]
  }),
  images: many(productImages),
  variants: many(productVariants),
}));

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  }),
}));

export const productVariantRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id]
  }),
  attributeValues: many(attributeValues),
}));

export const attributeValueRelations = relations(attributeValues, ({ one }) => ({
  attribute: one(productAttributes, {
    fields: [attributeValues.attributeId],
    references: [productAttributes.id]
  }),
  variant: one(productVariants, {
    fields: [attributeValues.variantId],
    references: [productVariants.id]
  }),
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Catalog
export * from "./enums/catalog";
export * from "./tables/categories";
export * from "./tables/brands";
export * from "./tables/products";
export * from "./tables/product_images";
export * from "./tables/product_variants";
export * from "./tables/product_attributes";
export * from "./tables/attribute_values";
export * from "./relations/catalog";
`;
if (!schemaIndex.includes('./tables/products')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. CATALOG PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const catalogDir = path.join(rootDir, 'packages/catalog');
const srcDir = path.join(catalogDir, 'src');

['product', 'category', 'brand', 'variant', 'shared'].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});
ensureDir(path.join(srcDir, 'shared/slug'));
ensureDir(path.join(srcDir, 'shared/events'));

// Package.json
fs.writeFileSync(
  path.join(catalogDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/catalog',
      version: '0.1.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      dependencies: {
        zod: '^3.23.8',
        slugify: '^1.6.6',
        '@kirana/database': '*',
        '@kirana/types': '*',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
      },
    },
    null,
    2,
  ),
);

// tsconfig.json
fs.writeFileSync(
  path.join(catalogDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
    },
    null,
    2,
  ),
);

// Shared - Slug Generator
fs.writeFileSync(
  path.join(srcDir, 'shared/slug/index.ts'),
  `
import slugify from "slugify";

export function generateSlug(name: string): string {
  const base = slugify(name, { lower: true, strict: true });
  const suffix = Math.random().toString(36).substring(2, 6);
  return \`\${base}-\${suffix}\`;
}
`,
);

// Shared - Events (Interfaces only)
fs.writeFileSync(
  path.join(srcDir, 'shared/events/index.ts'),
  `
export interface CatalogEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type ProductCreated = CatalogEvent<{ productId: string }>;
export type ProductUpdated = CatalogEvent<{ productId: string }>;
export type ProductPublished = CatalogEvent<{ productId: string }>;
export type ProductArchived = CatalogEvent<{ productId: string }>;
export type ProductDeleted = CatalogEvent<{ productId: string }>;
export type VariantCreated = CatalogEvent<{ variantId: string }>;
export type VariantUpdated = CatalogEvent<{ variantId: string }>;
`,
);

// Category Vertical Slice
fs.writeFileSync(
  path.join(srcDir, 'category/dto.ts'),
  `
import { z } from "zod";
import { categoryValidator } from "./validators";

export type CreateCategoryDTO = z.infer<typeof categoryValidator.create>;
export type UpdateCategoryDTO = z.infer<typeof categoryValidator.update>;
export type CategoryResponseDTO = z.infer<typeof categoryValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'category/validators.ts'),
  `
import { z } from "zod";

export const categoryValidator = {
  create: z.object({
    name: z.string().min(1),
    parentId: z.string().uuid().optional().nullable(),
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    parentId: z.string().uuid().optional().nullable(),
  }),
  response: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    parentId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'category/entity.ts'),
  `
export interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'category/mapper.ts'),
  `
import type { CategoryEntity } from "./entity";
import type { CategoryResponseDTO } from "./dto";

export function toCategoryResponse(entity: CategoryEntity): CategoryResponseDTO {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    parentId: entity.parentId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'category/repository.ts'),
  `
import { db, categories } from "@kirana/database";
import { eq } from "drizzle-orm";
import type { CategoryEntity } from "./entity";

export class CategoryRepository {
  async create(data: Omit<CategoryEntity, "id" | "createdAt" | "updatedAt">): Promise<CategoryEntity> {
    const [row] = await db.insert(categories).values(data).returning();
    return row as CategoryEntity;
  }
  
  async findById(id: string): Promise<CategoryEntity | null> {
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return (row as CategoryEntity) || null;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'category/service.ts'),
  `
import { CategoryRepository } from "./repository";
import { categoryValidator } from "./validators";
import { generateSlug } from "../shared/slug";
import { toCategoryResponse } from "./mapper";
import type { CreateCategoryDTO, CategoryResponseDTO } from "./dto";

const repo = new CategoryRepository();

export class CategoryService {
  async createCategory(dto: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const validData = categoryValidator.create.parse(dto);
    const slug = generateSlug(validData.name);
    
    const entity = await repo.create({
      name: validData.name,
      slug,
      parentId: validData.parentId || null
    });
    
    return toCategoryResponse(entity);
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'category/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { CategoryService } from "./service";
// Intentionally excluding repository and internal mappers/entities
`,
);

// Product Vertical Slice (Core)
fs.writeFileSync(
  path.join(srcDir, 'product/dto.ts'),
  `
import { z } from "zod";
import { productValidator } from "./validators";

export type CreateProductDTO = z.infer<typeof productValidator.create>;
export type UpdateProductDTO = z.infer<typeof productValidator.update>;
export type ProductResponseDTO = z.infer<typeof productValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'product/validators.ts'),
  `
import { z } from "zod";

export const productValidator = {
  create: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.string().uuid(),
    brandId: z.string().uuid().optional().nullable(),
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional().nullable(),
  }),
  response: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "DELETED"]),
    categoryId: z.string().uuid(),
    brandId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'product/entity.ts'),
  `
export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DELETED";
  categoryId: string;
  brandId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'product/mapper.ts'),
  `
import type { ProductEntity } from "./entity";
import type { ProductResponseDTO } from "./dto";

export function toProductResponse(entity: ProductEntity): ProductResponseDTO {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    description: entity.description,
    status: entity.status,
    categoryId: entity.categoryId,
    brandId: entity.brandId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'product/repository.ts'),
  `
import { db, products } from "@kirana/database";
import { eq, and, isNull } from "drizzle-orm";
import type { ProductEntity } from "./entity";

export class ProductRepository {
  async create(data: Omit<ProductEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<ProductEntity> {
    const [row] = await db.insert(products).values(data).returning();
    return row as ProductEntity;
  }
  
  async findById(id: string): Promise<ProductEntity | null> {
    const [row] = await db.select().from(products).where(
      and(eq(products.id, id), isNull(products.deletedAt))
    ).limit(1);
    return (row as ProductEntity) || null;
  }
  
  async updateStatus(id: string, status: ProductEntity["status"]): Promise<ProductEntity> {
    const [row] = await db.update(products).set({ status, updatedAt: new Date() }).where(eq(products.id, id)).returning();
    if (!row) throw new Error("Product not found");
    return row as ProductEntity;
  }
  
  async softDelete(id: string): Promise<void> {
    await db.update(products).set({ status: "DELETED", deletedAt: new Date() }).where(eq(products.id, id));
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'product/service.ts'),
  `
import { ProductRepository } from "./repository";
import { productValidator } from "./validators";
import { generateSlug } from "../shared/slug";
import { toProductResponse } from "./mapper";
import type { CreateProductDTO, ProductResponseDTO } from "./dto";
// Import event definitions (no dispatching per constraints)
import type { ProductCreated, ProductPublished, ProductArchived, ProductDeleted } from "../shared/events";

const repo = new ProductRepository();

export class ProductService {
  async createProduct(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const validData = productValidator.create.parse(dto);
    const slug = generateSlug(validData.name);
    
    const entity = await repo.create({
      name: validData.name,
      slug,
      description: validData.description || null,
      status: "DRAFT",
      categoryId: validData.categoryId,
      brandId: validData.brandId || null
    });
    
    // Future: dispatch ProductCreated event
    
    return toProductResponse(entity);
  }
  
  async publishProduct(id: string): Promise<ProductResponseDTO> {
    // Note: Would typically ensure required relations (images, variants) exist first
    const entity = await repo.updateStatus(id, "PUBLISHED");
    // Future: dispatch ProductPublished event
    return toProductResponse(entity);
  }
  
  async archiveProduct(id: string): Promise<ProductResponseDTO> {
    const entity = await repo.updateStatus(id, "ARCHIVED");
    // Future: dispatch ProductArchived event
    return toProductResponse(entity);
  }
  
  async deleteProduct(id: string): Promise<void> {
    await repo.softDelete(id);
    // Future: dispatch ProductDeleted event
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'product/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { ProductService } from "./service";
// Intentionally excluding repository and internal mappers/entities
`,
);

// Brand Vertical Slice (Minimal setup)
fs.writeFileSync(
  path.join(srcDir, 'brand/index.ts'),
  `
// Brand public API (Service, DTOs, Validators)
export {};
`,
);

// Variant Vertical Slice (Minimal setup)
fs.writeFileSync(
  path.join(srcDir, 'variant/index.ts'),
  `
// Variant public API (Service, DTOs, Validators)
export {};
`,
);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./product";
export * from "./category";
export * from "./brand";
export * from "./variant";
export * from "./shared/events";
`,
);

console.log('Catalog workspace scaffolded via vertical slice architecture.');
