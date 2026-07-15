import type { OrderItemEntity } from './entity';

export function toOrderItemResponse(entity: OrderItemEntity) {
  return { ...entity };
}
