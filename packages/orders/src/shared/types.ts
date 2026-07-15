export interface Money {
  amount: number;
  currencyCode: string;
  precision: number;
}

export interface CustomerSnapshot {
  name: string;
  email: string;
  phone?: string;
}

export interface AddressSnapshot {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TotalsSnapshot {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  currency: string;
}
