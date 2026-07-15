import type { CartItemEntity } from '../cart-item/entity';

export interface CartEntity {
  id: string;
  userId: string | null;
  sessionId: string | null;
  status: 'ACTIVE' | 'CHECKOUT_PENDING' | 'ABANDONED' | 'CONVERTED_TO_ORDER' | 'EXPIRED';
  couponCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: CartItemEntity[]; // Eagerly loaded
}
