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
  path.join(dbSchemaTables, 'search_indices.ts'),
  `
import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const searchIndices = pgTable("search_indices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(), // e.g. "products_v1"
  provider: text("provider").notNull(), // e.g. "POSTGRES", "TYPESENSE"
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'search_documents.ts'),
  `
import { pgTable, text, timestamp, jsonb, boolean, integer, index } from "drizzle-orm/pg-core";
import { searchIndices } from "./search_indices";

export const searchDocuments = pgTable("search_documents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  indexId: text("index_id").notNull().references(() => searchIndices.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  brand: text("brand"),
  category: text("category"),
  attributes: jsonb("attributes"),
  thumbnail: text("thumbnail"),
  availability: boolean("availability").default(false).notNull(),
  searchPrice: integer("search_price").notNull(), // Smallest currency unit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  indexIdx: index("search_doc_index_idx").on(t.indexId),
  productIdx: index("search_doc_product_idx").on(t.productId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'search_suggestions.ts'),
  `
import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";

export const searchSuggestions = pgTable("search_suggestions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  term: text("term").notNull().unique(),
  weight: integer("weight").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  termIdx: index("search_sugg_term_idx").on(t.term),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'search_synonyms.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const searchSynonyms = pgTable("search_synonyms", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  rootTerm: text("root_term").notNull(),
  synonyms: jsonb("synonyms").notNull(), // array of strings
  isBidirectional: boolean("is_bidirectional").default(true).notNull(),
  locale: text("locale").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  rootTermIdx: index("search_syn_root_term_idx").on(t.rootTerm),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'search_analytics.ts'),
  `
import { pgTable, text, timestamp, integer, date, index } from "drizzle-orm/pg-core";

export const searchAnalytics = pgTable("search_analytics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  term: text("term").notNull(),
  queryCount: integer("query_count").default(0).notNull(),
  clickCount: integer("click_count").default(0).notNull(),
  zeroResultCount: integer("zero_result_count").default(0).notNull(),
  recordedDate: date("recorded_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  termDateIdx: index("search_analytics_term_date_idx").on(t.term, t.recordedDate),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'search_events.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

export const searchEvents = pgTable("search_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(), // e.g. SEARCH, CLICK, ADD_TO_CART
  term: text("term"),
  documentId: text("document_id"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  sessionIdx: index("search_event_session_idx").on(t.sessionId),
  eventTypeIdx: index("search_event_type_idx").on(t.eventType),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'search.ts'),
  `
import { relations } from "drizzle-orm";
import { searchIndices } from "../tables/search_indices";
import { searchDocuments } from "../tables/search_documents";

export const searchIndexRelations = relations(searchIndices, ({ many }) => ({
  documents: many(searchDocuments),
}));

export const searchDocumentRelations = relations(searchDocuments, ({ one }) => ({
  index: one(searchIndices, {
    fields: [searchDocuments.indexId],
    references: [searchIndices.id],
  }),
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Search
export * from "./tables/search_indices";
export * from "./tables/search_documents";
export * from "./tables/search_suggestions";
export * from "./tables/search_synonyms";
export * from "./tables/search_analytics";
export * from "./tables/search_events";
export * from "./relations/search";
`;
if (!schemaIndex.includes('./tables/search_documents')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. SEARCH PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const searchPkgDir = path.join(rootDir, 'packages/search');
const srcDir = path.join(searchPkgDir, 'src');

[
  'query-engine',
  'index-engine',
  'search',
  'autocomplete',
  'facet',
  'ranking',
  'spell-correction',
  'synonyms',
  'merchandising',
  'cache',
  'analytics',
  'shared',
].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});

fs.writeFileSync(
  path.join(searchPkgDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/search',
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
  path.join(searchPkgDir, 'tsconfig.json'),
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

// Shared Value Objects & Provider Abstraction
fs.writeFileSync(
  path.join(srcDir, 'shared/index.ts'),
  `
import { z } from "zod";

export const SearchQuerySchema = z.object({
  query: z.string(),
  filters: z.record(z.any()).optional(),
  sort: z.string().optional(),
  pagination: z.object({
    limit: z.number().max(100),
    offset: z.number().optional(),
    cursor: z.string().optional()
  }).optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
  userContext: z.record(z.any()).optional()
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export interface SearchResult {
  documents: any[];
  facets: any[];
  pagination: {
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
  executionTime: number;
  provider: string;
  spellCorrection?: string;
  suggestions?: string[];
}

export interface SearchProviderAdapter {
  search(query: SearchQuery): Promise<SearchResult>;
  indexDocument(indexName: string, document: any): Promise<void>;
  deleteDocument(indexName: string, documentId: string): Promise<void>;
  bulkIndex(indexName: string, documents: any[]): Promise<void>;
}

export interface ShippingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type ProductIndexed = ShippingEvent<{ productId: string }>;
export type ProductUpdated = ShippingEvent<{ productId: string }>;
export type ProductRemoved = ShippingEvent<{ productId: string }>;
export type SearchPerformed = ShippingEvent<{ queryId: string, executionTime: number }>;
export type SpellCorrected = ShippingEvent<{ original: string, corrected: string }>;
export type SuggestionGenerated = ShippingEvent<{ term: string }>;
export type FacetGenerated = ShippingEvent<{ queryId: string }>;
export type AnalyticsRecorded = ShippingEvent<{ eventId: string }>;
export type IndexRebuilt = ShippingEvent<{ indexId: string }>;
export type ProviderSwitched = ShippingEvent<{ newProvider: string }>;
`,
);

// Slices Scaffold
const slices = [
  'query-engine',
  'index-engine',
  'search',
  'autocomplete',
  'facet',
  'ranking',
  'spell-correction',
  'synonyms',
  'merchandising',
  'cache',
  'analytics',
];

slices.forEach((slice) => {
  fs.writeFileSync(
    path.join(srcDir, slice, 'entity.ts'),
    `export interface ${slice.replace(/-./g, (x) => x[1].toUpperCase()).replace(/^./, (x) => x.toUpperCase())}Entity { id: string; }`,
  );
  fs.writeFileSync(
    path.join(srcDir, slice, 'repository.ts'),
    `export class ${slice.replace(/-./g, (x) => x[1].toUpperCase()).replace(/^./, (x) => x.toUpperCase())}Repository {}`,
  );
  fs.writeFileSync(
    path.join(srcDir, slice, 'validator.ts'),
    `import { z } from "zod"; export const schema = z.any();`,
  );
  fs.writeFileSync(
    path.join(srcDir, slice, 'dto.ts'),
    `export interface ${slice.replace(/-./g, (x) => x[1].toUpperCase()).replace(/^./, (x) => x.toUpperCase())}DTO {}`,
  );
  fs.writeFileSync(path.join(srcDir, slice, 'mapper.ts'), `export function map() {}`);

  if (['search', 'autocomplete', 'analytics'].includes(slice)) {
    fs.writeFileSync(
      path.join(srcDir, slice, 'service.ts'),
      `
    export class ${slice.charAt(0).toUpperCase() + slice.slice(1)}Service {
      async execute(payload: any): Promise<any> { throw new Error("Not implemented"); }
    }
    `,
    );
    fs.writeFileSync(
      path.join(srcDir, slice, 'index.ts'),
      `
    export * from "./entity";
    export * from "./dto";
    export { ${slice.charAt(0).toUpperCase() + slice.slice(1)}Service } from "./service";
    `,
    );
  } else {
    fs.writeFileSync(
      path.join(srcDir, slice, 'service.ts'),
      `
    export class ${slice.replace(/-./g, (x) => x[1].toUpperCase()).replace(/^./, (x) => x.toUpperCase())}Service {
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
export { SearchService } from "./search";
export { AutocompleteService } from "./autocomplete";
export { AnalyticsService } from "./analytics";
`,
);

console.log('Search workspace scaffolded.');
