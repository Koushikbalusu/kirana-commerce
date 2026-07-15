import type { CustomerSnapshot, AddressSnapshot, TotalsSnapshot } from '../shared/types';
import type { OrderItemEntity } from '../order-item/entity';

export interface OrderEntity {
  id: string;
  orderNumber: string;
  userId: string | null;
  checkoutSessionId: string;
  financialStatus: 'UNPAID' | 'AUTHORIZED' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  fulfillmentStatus: 'UNFULFILLED' | 'PROCESSING' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'DELIVERED';
  customerSnapshot: CustomerSnapshot;
  shippingAddressSnapshot: AddressSnapshot;
  billingAddressSnapshot: AddressSnapshot;
  totalsSnapshot: TotalsSnapshot;
  paymentReference: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemEntity[];
}
