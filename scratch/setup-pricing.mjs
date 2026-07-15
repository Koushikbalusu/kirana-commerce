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
  path.join(dbSchemaEnums, 'pricing.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const discountTypeEnum = pgEnum("discount_type", [
  "PERCENTAGE",
  "FIXED_AMOUNT"
]);

export const promotionConditionTypeEnum = pgEnum("promotion_condition_type", [
  "MIN_CART_VALUE",
  "INCLUDES_CATEGORY",
  "INCLUDES_BRAND",
  "USER_ROLE"
]);

export const promotionActionTypeEnum = pgEnum("promotion_action_type", [
  "ORDER_DISCOUNT",
  "ITEM_DISCOUNT",
  "FREE_SHIPPING"
]);
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'currencies.ts'),
  `
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const currencies = pgTable("currencies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(), // e.g. "USD"
  symbol: text("symbol").notNull(), // e.g. "$"
  precision: integer("precision").default(2).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'prices.ts'),
  `
import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { productVariants } from "./product_variants";
import { currencies } from "./currencies";

export const prices = pgTable("prices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  variantId: text("variant_id").notNull().references(() => productVariants.id),
  currencyId: text("currency_id").notNull().references(() => currencies.id),
  amount: integer("amount").notNull(), // Smallest currency unit (cents)
  msrp: integer("msrp"),
  startsAt: timestamp("starts_at").defaultNow().notNull(),
  endsAt: timestamp("ends_at"), // Null means forever
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  variantTimeIdx: index("variant_time_idx").on(t.variantId, t.startsAt, t.endsAt),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'price_history.ts'),
  `
import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { prices } from "./prices";

export const priceHistory = pgTable("price_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  priceId: text("price_id").notNull().references(() => prices.id),
  amount: integer("amount").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
}, (t) => ({
  priceIdIdx: index("history_price_id_idx").on(t.priceId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'promotions.ts'),
  `
import { pgTable, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const promotions = pgTable("promotions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  priority: integer("priority").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startsAt: timestamp("starts_at").defaultNow().notNull(),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  promoTimeIdx: index("promo_time_idx").on(t.startsAt, t.endsAt),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'promotion_conditions.ts'),
  `
import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { promotions } from "./promotions";
import { promotionConditionTypeEnum } from "../enums/pricing";

export const promotionConditions = pgTable("promotion_conditions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  promotionId: text("promotion_id").notNull().references(() => promotions.id, { onDelete: "cascade" }),
  type: promotionConditionTypeEnum("type").notNull(),
  parameters: jsonb("parameters").notNull(), // Flexible constraints matrix
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'promotion_actions.ts'),
  `
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { promotions } from "./promotions";
import { promotionActionTypeEnum, discountTypeEnum } from "../enums/pricing";

export const promotionActions = pgTable("promotion_actions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  promotionId: text("promotion_id").notNull().references(() => promotions.id, { onDelete: "cascade" }),
  type: promotionActionTypeEnum("type").notNull(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(), // Percentage mapped to integer or fixed cents
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'coupons.ts'),
  `
import { pgTable, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { discountTypeEnum } from "../enums/pricing";

export const coupons = pgTable("coupons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0).notNull(),
  eligibilityRules: jsonb("eligibility_rules"), // e.g., ["FIRST_ORDER", "PREMIUM_MEMBER"]
  canStack: boolean("can_stack").default(false).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  couponCodeIdx: index("coupon_code_idx").on(t.code),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'tax_categories.ts'),
  `
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const taxCategories = pgTable("tax_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(), // e.g., "Standard", "Exempt"
  ratePercentage: integer("rate_percentage").notNull(), // Integer representing precision. e.g. 850 = 8.5%
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'pricing.ts'),
  `
import { relations } from "drizzle-orm";
import { productVariants } from "../tables/product_variants";
import { currencies } from "../tables/currencies";
import { prices } from "../tables/prices";
import { priceHistory } from "../tables/price_history";
import { promotions } from "../tables/promotions";
import { promotionConditions } from "../tables/promotion_conditions";
import { promotionActions } from "../tables/promotion_actions";

export const currencyRelations = relations(currencies, ({ many }) => ({
  prices: many(prices),
}));

export const priceRelations = relations(prices, ({ one, many }) => ({
  variant: one(productVariants, {
    fields: [prices.variantId],
    references: [productVariants.id]
  }),
  currency: one(currencies, {
    fields: [prices.currencyId],
    references: [currencies.id]
  }),
  history: many(priceHistory),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  price: one(prices, {
    fields: [priceHistory.priceId],
    references: [prices.id]
  }),
}));

export const promotionRelations = relations(promotions, ({ many }) => ({
  conditions: many(promotionConditions),
  actions: many(promotionActions),
}));

export const promotionConditionRelations = relations(promotionConditions, ({ one }) => ({
  promotion: one(promotions, {
    fields: [promotionConditions.promotionId],
    references: [promotions.id]
  }),
}));

export const promotionActionRelations = relations(promotionActions, ({ one }) => ({
  promotion: one(promotions, {
    fields: [promotionActions.promotionId],
    references: [promotions.id]
  }),
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Pricing
export * from "./enums/pricing";
export * from "./tables/currencies";
export * from "./tables/prices";
export * from "./tables/price_history";
export * from "./tables/promotions";
export * from "./tables/promotion_conditions";
export * from "./tables/promotion_actions";
export * from "./tables/coupons";
export * from "./tables/tax_categories";
export * from "./relations/pricing";
`;
if (!schemaIndex.includes('./tables/prices')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. PRICING PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const pricingDir = path.join(rootDir, 'packages/pricing');
const srcDir = path.join(pricingDir, 'src');

['price', 'promotion', 'coupon', 'tax', 'currency', 'shared'].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});
ensureDir(path.join(srcDir, 'shared/events'));
ensureDir(path.join(srcDir, 'shared/pipeline'));

fs.writeFileSync(
  path.join(pricingDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/pricing',
      version: '0.1.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      dependencies: {
        zod: '^3.23.8',
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

fs.writeFileSync(
  path.join(pricingDir, 'tsconfig.json'),
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

// Shared Events
fs.writeFileSync(
  path.join(srcDir, 'shared/events/index.ts'),
  `
export interface PricingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type PriceChanged = PricingEvent<{ variantId: string, oldPrice: number, newPrice: number }>;
export type PromotionActivated = PricingEvent<{ promotionId: string }>;
export type PromotionExpired = PricingEvent<{ promotionId: string }>;
export type CouponRedeemed = PricingEvent<{ couponCode: string, orderId: string }>;
export type CouponExpired = PricingEvent<{ couponCode: string }>;
`,
);

// Shared Value Object
fs.writeFileSync(
  path.join(srcDir, 'shared/money.ts'),
  `
export interface Money {
  amount: number; // Integer representation of smallest unit
  currencyCode: string;
  precision: number;
}
`,
);

// Shared Pipeline
fs.writeFileSync(
  path.join(srcDir, 'shared/pipeline/index.ts'),
  `
import type { Money } from "../money";
import type { PriceEntity } from "../../price/entity";
import type { PromotionEntity } from "../../promotion/entity";
import type { CouponEntity } from "../../coupon/entity";
import type { TaxCategoryEntity } from "../../tax/entity";

export interface PriceResolutionContext {
  basePrice: PriceEntity;
  activePromotions: PromotionEntity[];
  coupon?: CouponEntity;
  taxCategory?: TaxCategoryEntity;
}

export function resolveFinalPrice(context: PriceResolutionContext): Money {
  // 1. Base / Scheduled Price
  let currentAmount = context.basePrice.amount;
  
  // 2. Promotion (Simplified condition pass assuming pre-filtered)
  let promoDiscount = 0;
  // Apply highest priority promotion (prevent stacking simplifier)
  if (context.activePromotions.length > 0) {
    const promo = context.activePromotions.sort((a, b) => b.priority - a.priority)[0];
    const action = promo.actions?.[0]; // Assume single action for architectural demo
    if (action) {
      if (action.discountType === "PERCENTAGE") {
        promoDiscount = Math.floor(currentAmount * (action.discountValue / 10000)); // Assuming 10000 = 100.00%
      } else {
        promoDiscount = action.discountValue;
      }
    }
  }

  // 3. Coupon
  let couponDiscount = 0;
  if (context.coupon && (context.coupon.canStack || promoDiscount === 0)) {
    if (context.coupon.discountType === "PERCENTAGE") {
      couponDiscount = Math.floor(currentAmount * (context.coupon.discountValue / 10000));
    } else {
      couponDiscount = context.coupon.discountValue;
    }
  }
  
  // Apply total discount
  currentAmount -= (context.coupon && !context.coupon.canStack && couponDiscount > promoDiscount) 
    ? couponDiscount 
    : (promoDiscount + couponDiscount);
    
  // 5. Floor Safeguard
  if (currentAmount < 0) currentAmount = 0;

  // 4. Tax
  let taxAmount = 0;
  if (context.taxCategory) {
     taxAmount = Math.floor(currentAmount * (context.taxCategory.ratePercentage / 10000));
  }
  
  currentAmount += taxAmount;

  return {
    amount: currentAmount,
    currencyCode: "USD", // Example
    precision: 2
  };
}
`,
);

// Price Slice
fs.writeFileSync(
  path.join(srcDir, 'price/entity.ts'),
  `
export interface PriceEntity {
  id: string;
  variantId: string;
  currencyId: string;
  amount: number;
  msrp: number | null;
  startsAt: Date;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'price/dto.ts'),
  `
import { z } from "zod";
import { priceValidator } from "./validators";

export type CreatePriceDTO = z.infer<typeof priceValidator.create>;
export type PriceResponseDTO = z.infer<typeof priceValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'price/validators.ts'),
  `
import { z } from "zod";

export const priceValidator = {
  create: z.object({
    variantId: z.string().uuid(),
    currencyId: z.string().uuid(),
    amount: z.number().int().nonnegative(),
    msrp: z.number().int().nonnegative().optional(),
    startsAt: z.date().optional(),
    endsAt: z.date().optional(),
  }),
  response: z.object({
    id: z.string().uuid(),
    variantId: z.string().uuid(),
    currencyId: z.string().uuid(),
    amount: z.number().int(),
    msrp: z.number().int().nullable(),
    startsAt: z.date(),
    endsAt: z.date().nullable(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'price/mapper.ts'),
  `
import type { PriceEntity } from "./entity";
import type { PriceResponseDTO } from "./dto";

export function toPriceResponse(entity: PriceEntity): PriceResponseDTO {
  return {
    id: entity.id,
    variantId: entity.variantId,
    currencyId: entity.currencyId,
    amount: entity.amount,
    msrp: entity.msrp,
    startsAt: entity.startsAt,
    endsAt: entity.endsAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'price/repository.ts'),
  `
import { db, prices, priceHistory } from "@kirana/database";
import { and, eq, lte, isNull, or, gte } from "drizzle-orm";
import type { PriceEntity } from "./entity";

export class PriceRepository {
  async getActivePriceForVariant(variantId: string): Promise<PriceEntity | null> {
    const now = new Date();
    const [row] = await db.select().from(prices).where(
      and(
        eq(prices.variantId, variantId),
        lte(prices.startsAt, now),
        or(isNull(prices.endsAt), gte(prices.endsAt, now))
      )
    ).limit(1);
    
    return (row as PriceEntity) || null;
  }
  
  async create(data: Omit<PriceEntity, "id" | "createdAt" | "updatedAt">): Promise<PriceEntity> {
    const result = await db.transaction(async (tx) => {
      const [row] = await tx.insert(prices).values(data).returning();
      
      // Append-only Immutable History
      await tx.insert(priceHistory).values({
        priceId: row.id,
        amount: row.amount,
      });
      
      return row;
    });
    
    return result as PriceEntity;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'price/service.ts'),
  `
import { PriceRepository } from "./repository";
import { priceValidator } from "./validators";
import { toPriceResponse } from "./mapper";
import type { CreatePriceDTO, PriceResponseDTO } from "./dto";

const repo = new PriceRepository();

export class PriceService {
  async createPrice(dto: CreatePriceDTO): Promise<PriceResponseDTO> {
    const validData = priceValidator.create.parse(dto);
    const entity = await repo.create({
      ...validData,
      startsAt: validData.startsAt || new Date(),
      endsAt: validData.endsAt || null,
      msrp: validData.msrp || null,
    });
    return toPriceResponse(entity);
  }
  
  async getActivePrice(variantId: string): Promise<PriceResponseDTO | null> {
    const entity = await repo.getActivePriceForVariant(variantId);
    return entity ? toPriceResponse(entity) : null;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'price/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { PriceService } from "./service";
`,
);

// Promotion Slice
fs.writeFileSync(
  path.join(srcDir, 'promotion/entity.ts'),
  `
export interface PromotionActionEntity {
  id: string;
  type: string;
  discountType: string;
  discountValue: number;
}
export interface PromotionEntity {
  id: string;
  name: string;
  priority: number;
  isActive: boolean;
  actions?: PromotionActionEntity[];
}
`,
);
fs.writeFileSync(path.join(srcDir, 'promotion/index.ts'), `export * from "./entity";`);

// Coupon Slice
fs.writeFileSync(
  path.join(srcDir, 'coupon/entity.ts'),
  `
export interface CouponEntity {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  canStack: boolean;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'coupon/index.ts'), `export * from "./entity";`);

// Tax Slice
fs.writeFileSync(
  path.join(srcDir, 'tax/entity.ts'),
  `
export interface TaxCategoryEntity {
  id: string;
  name: string;
  ratePercentage: number;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'tax/index.ts'), `export * from "./entity";`);

// Currency Slice
fs.writeFileSync(
  path.join(srcDir, 'currency/entity.ts'),
  `
export interface CurrencyEntity {
  id: string;
  code: string;
  symbol: string;
  precision: number;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'currency/index.ts'), `export * from "./entity";`);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./price";
export * from "./shared/events";
export * from "./shared/money";
export * from "./shared/pipeline";
`,
);

console.log('Pricing workspace scaffolded.');
