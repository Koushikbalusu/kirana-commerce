import type { OrderEntity } from './entity';
import type { OrderResponseDTO } from './dto';
import { toOrderItemResponse } from '../order-item/mapper';

export function toOrderResponse(entity: OrderEntity): OrderResponseDTO {
  return {
    id: entity.id,
    orderNumber: entity.orderNumber,
    userId: entity.userId,
    checkoutSessionId: entity.checkoutSessionId,
    financialStatus: entity.financialStatus,
    fulfillmentStatus: entity.fulfillmentStatus,
    customerSnapshot: entity.customerSnapshot,
    shippingAddressSnapshot: entity.shippingAddressSnapshot,
    billingAddressSnapshot: entity.billingAddressSnapshot,
    totalsSnapshot: entity.totalsSnapshot,
    paymentReference: entity.paymentReference,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    items: entity.items?.map(toOrderItemResponse),
  };
}
