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

export type WishlistVisibility =
  'PRIVATE' | 'SHARED' | 'COLLABORATIVE' | 'FAVORITES' | 'SAVE_FOR_LATER';

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
