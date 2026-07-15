import { z } from 'zod';

export const SearchQuerySchema = z.object({
  query: z.string(),
  filters: z.record(z.any()).optional(),
  sort: z.string().optional(),
  pagination: z
    .object({
      limit: z.number().max(100),
      offset: z.number().optional(),
      cursor: z.string().optional(),
    })
    .optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
  userContext: z.record(z.any()).optional(),
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
export type SearchPerformed = ShippingEvent<{ queryId: string; executionTime: number }>;
export type SpellCorrected = ShippingEvent<{ original: string; corrected: string }>;
export type SuggestionGenerated = ShippingEvent<{ term: string }>;
export type FacetGenerated = ShippingEvent<{ queryId: string }>;
export type AnalyticsRecorded = ShippingEvent<{ eventId: string }>;
export type IndexRebuilt = ShippingEvent<{ indexId: string }>;
export type ProviderSwitched = ShippingEvent<{ newProvider: string }>;
