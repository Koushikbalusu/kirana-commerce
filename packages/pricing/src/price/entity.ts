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
