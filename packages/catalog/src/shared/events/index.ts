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
