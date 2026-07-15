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
const dbSchemaRelations = path.join(rootDir, 'packages/database/src/schema/relations');
const dbSchemaEnums = path.join(rootDir, 'packages/database/src/schema/enums');

ensureDir(dbSchemaTables);
ensureDir(dbSchemaRelations);
ensureDir(dbSchemaEnums);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_profiles.ts'),
  `
import { pgTable, text, timestamp, date, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerProfiles = pgTable("customer_profiles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dob: date("dob"),
  gender: text("gender"),
  status: text("status").default("ACTIVE").notNull(), // ACTIVE, SUSPENDED, BLOCKED, DELETED, ARCHIVED
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userStatusIdx: index("cust_prof_status_idx").on(t.userId, t.status),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_addresses.ts'),
  `
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerAddresses = pgTable("customer_addresses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // BILLING, SHIPPING, PICKUP, OFFICE, HOME, TEMPORARY
  isDefaultBilling: boolean("is_default_billing").default(false).notNull(),
  isDefaultShipping: boolean("is_default_shipping").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userTypeIdx: index("cust_addr_user_type_idx").on(t.userId, t.type),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'address_versions.ts'),
  `
import { pgTable, text, timestamp, index, integer } from "drizzle-orm/pg-core";
import { customerAddresses } from "./customer_addresses";

export const addressVersions = pgTable("address_versions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  addressId: text("address_id").notNull().references(() => customerAddresses.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  lat: text("lat"),
  long: text("long"),
  landmark: text("landmark"),
  instructions: text("instructions"),
  validationStatus: text("validation_status").default("UNVALIDATED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  addrVerIdx: index("addr_ver_idx").on(t.addressId, t.version),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_contacts.ts'),
  `
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerContacts = pgTable("customer_contacts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // EMAIL, PHONE, SEC_EMAIL, SEC_PHONE, RECOVERY
  value: text("value").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationProvider: text("verification_provider"),
  verificationAttempts: text("verification_attempts"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userTypeIdx: index("cust_contact_idx").on(t.userId, t.type),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_wishlists.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerWishlists = pgTable("customer_wishlists", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  visibility: text("visibility").default("PRIVATE").notNull(), // PRIVATE, SHARED, COLLABORATIVE, FAVORITES, SAVE_FOR_LATER
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userWishlistIdx: index("cust_wishlist_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_wishlist_items.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { customerWishlists } from "./customer_wishlists";

export const customerWishlistItems = pgTable("customer_wishlist_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  wishlistId: text("wishlist_id").notNull().references(() => customerWishlists.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (t) => ({
  wishlistProdIdx: index("wishlist_item_idx").on(t.wishlistId, t.productId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_payment_references.ts'),
  `
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerPaymentReferences = pgTable("customer_payment_references", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  token: text("token").notNull(),
  last4: text("last4"),
  expMonth: text("exp_month"),
  expYear: text("exp_year"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userPayRefIdx: index("cust_payref_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_loyalty_ledger.ts'),
  `
import { pgTable, text, timestamp, index, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerLoyaltyLedger = pgTable("customer_loyalty_ledger", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  transactionType: text("transaction_type").notNull(), // EARNED, REDEEMED, EXPIRED, ADJUSTED
  points: integer("points").notNull(), // can be negative
  ruleId: text("rule_id"),
  tierId: text("tier_id"),
  expiryDate: timestamp("expiry_date"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  userLoyaltyIdx: index("cust_loyalty_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_notes.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerNotes = pgTable("customer_notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  noteType: text("note_type").notNull(), // CSR, INTERNAL, PINNED
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  userNotesIdx: index("cust_notes_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_metadata.ts'),
  `
import { pgTable, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerMetadata = pgTable("customer_metadata", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  tags: jsonb("tags"), // array of strings
  segments: jsonb("segments"), // array of strings
  labels: jsonb("labels"),
  customAttributes: jsonb("custom_attributes"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userMetaIdx: index("cust_meta_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_preferences.ts'),
  `
import { pgTable, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerPreferences = pgTable("customer_preferences", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  language: text("language").default("en").notNull(),
  currency: text("currency").default("USD").notNull(),
  theme: text("theme").default("system").notNull(),
  accessibility: jsonb("accessibility"),
  marketing: jsonb("marketing"),
  shopping: jsonb("shopping"),
  privacy: jsonb("privacy"),
  notifications: jsonb("notifications"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userPrefIdx: index("cust_prefs_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'customer_timeline.ts'),
  `
import { pgTable, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customerTimeline = pgTable("customer_timeline", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (t) => ({
  userTimelineIdx: index("cust_timeline_idx").on(t.userId, t.timestamp),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'customers.ts'),
  `
import { relations } from "drizzle-orm";
import { users } from "../tables/users";
import { customerProfiles } from "../tables/customer_profiles";
import { customerAddresses } from "../tables/customer_addresses";
import { addressVersions } from "../tables/address_versions";
import { customerWishlists } from "../tables/customer_wishlists";
import { customerWishlistItems } from "../tables/customer_wishlist_items";

export const userCustomerRelations = relations(users, ({ one, many }) => ({
  profile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  addresses: many(customerAddresses),
  wishlists: many(customerWishlists),
}));

export const customerAddressRelations = relations(customerAddresses, ({ many }) => ({
  versions: many(addressVersions),
}));

export const addressVersionRelations = relations(addressVersions, ({ one }) => ({
  address: one(customerAddresses, {
    fields: [addressVersions.addressId],
    references: [customerAddresses.id],
  }),
}));

export const customerWishlistRelations = relations(customerWishlists, ({ many }) => ({
  items: many(customerWishlistItems),
}));

export const customerWishlistItemRelations = relations(customerWishlistItems, ({ one }) => ({
  wishlist: one(customerWishlists, {
    fields: [customerWishlistItems.wishlistId],
    references: [customerWishlists.id],
  }),
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Customers
export * from "./tables/customer_profiles";
export * from "./tables/customer_addresses";
export * from "./tables/address_versions";
export * from "./tables/customer_contacts";
export * from "./tables/customer_wishlists";
export * from "./tables/customer_wishlist_items";
export * from "./tables/customer_payment_references";
export * from "./tables/customer_loyalty_ledger";
export * from "./tables/customer_notes";
export * from "./tables/customer_metadata";
export * from "./tables/customer_preferences";
export * from "./tables/customer_timeline";
export * from "./relations/customers";
`;
if (!schemaIndex.includes('./tables/customer_profiles')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. CUSTOMER PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const pkgDir = path.join(rootDir, 'packages/customer');
const srcDir = path.join(pkgDir, 'src');

[
  'profile',
  'address',
  'contact',
  'wishlist',
  'payment-ref',
  'loyalty',
  'notes',
  'preference',
  'metadata',
  'privacy',
  'timeline',
  'avatar',
  'segments',
  'consent',
  'audit',
  'shared',
].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});

fs.writeFileSync(
  path.join(pkgDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/customer',
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
  path.join(pkgDir, 'tsconfig.json'),
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

// Shared Value Objects & Domain Events
fs.writeFileSync(
  path.join(srcDir, 'shared/index.ts'),
  `
export interface CustomerProfile {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly status: CustomerStatus;
}

export type CustomerStatus = 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED' | 'ARCHIVED';

export interface CustomerAddress {
  readonly id: string;
  readonly type: string;
  readonly line1: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  readonly country: string;
}

export interface CustomerPreference {
  readonly language: string;
  readonly currency: string;
}

export interface CustomerContact {
  readonly type: string;
  readonly value: string;
  readonly isVerified: boolean;
}

export interface CustomerMetadata {
  readonly tags: string[];
}

export interface LoyaltyBalance {
  readonly points: number;
  readonly tier: string;
}

export type WishlistVisibility = 'PRIVATE' | 'SHARED' | 'COLLABORATIVE' | 'FAVORITES' | 'SAVE_FOR_LATER';

// Events
export interface ShippingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}
export type CustomerCreated = ShippingEvent;
export type CustomerUpdated = ShippingEvent;
export type CustomerSuspended = ShippingEvent;
export type CustomerDeleted = ShippingEvent;
export type AddressCreated = ShippingEvent;
export type AddressUpdated = ShippingEvent;
export type AddressDeleted = ShippingEvent;
export type WishlistCreated = ShippingEvent;
export type WishlistUpdated = ShippingEvent;
export type WishlistShared = ShippingEvent;
export type LoyaltyAwarded = ShippingEvent;
export type LoyaltyRedeemed = ShippingEvent;
export type PrivacyExportRequested = ShippingEvent;
export type PrivacyDeletionRequested = ShippingEvent;
`,
);

// Slices Scaffold
const slices = [
  'profile',
  'address',
  'contact',
  'wishlist',
  'payment-ref',
  'loyalty',
  'notes',
  'preference',
  'metadata',
  'privacy',
  'timeline',
  'avatar',
  'segments',
  'consent',
  'audit',
];

slices.forEach((slice) => {
  const cName = slice
    .replace(/-./g, (x) => x[1].toUpperCase())
    .replace(/^./, (x) => x.toUpperCase());
  fs.writeFileSync(
    path.join(srcDir, slice, 'entity.ts'),
    `export interface ${cName}Entity { id: string; }`,
  );
  fs.writeFileSync(path.join(srcDir, slice, 'repository.ts'), `export class ${cName}Repository {}`);
  fs.writeFileSync(
    path.join(srcDir, slice, 'validator.ts'),
    `import { z } from "zod"; export const schema = z.any();`,
  );
  fs.writeFileSync(path.join(srcDir, slice, 'dto.ts'), `export interface ${cName}DTO {}`);
  fs.writeFileSync(path.join(srcDir, slice, 'mapper.ts'), `export function map() {}`);

  if (
    ['profile', 'address', 'contact', 'wishlist', 'preference', 'loyalty', 'privacy'].includes(
      slice,
    )
  ) {
    fs.writeFileSync(
      path.join(srcDir, slice, 'service.ts'),
      `
    export class ${cName}Service {
      async execute(payload: any): Promise<any> { throw new Error("Not implemented"); }
    }
    `,
    );
    fs.writeFileSync(
      path.join(srcDir, slice, 'index.ts'),
      `
    export * from "./entity";
    export * from "./dto";
    export { ${cName}Service } from "./service";
    `,
    );
  } else {
    fs.writeFileSync(
      path.join(srcDir, slice, 'service.ts'),
      `
    export class ${cName}Service {
      async execute(payload: any): Promise<any> { throw new Error("Not implemented"); }
    }
    `,
    );
    fs.writeFileSync(
      path.join(srcDir, slice, 'index.ts'),
      `
    export * from "./entity";
    export * from "./dto";
    `,
    );
  }
});

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./shared";
export { ProfileService } from "./profile";
export { AddressService } from "./address";
export { ContactService } from "./contact";
export { WishlistService } from "./wishlist";
export { PreferenceService } from "./preference";
export { LoyaltyService } from "./loyalty";
export { PrivacyService } from "./privacy";
`,
);

console.log('Customer workspace scaffolded.');
