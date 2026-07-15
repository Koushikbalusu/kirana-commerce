export interface Money {
  amount: number;
  currencyCode: string;
  precision: number;
}

export interface CartSnapshot {
  subtotal: Money;
  discounts: Money;
  couponDiscount: Money;
  estimatedTax: Money;
  estimatedTotal: Money;
  currency: string;
  generatedAt: Date;
}

export interface CartValidationResult {
  isValid: boolean;
  unavailableItems: string[]; // variantIds
  quantityWarnings: string[];
  invalidCoupons: string[];
  inventoryWarnings: string[];
  messages: string[];
}
