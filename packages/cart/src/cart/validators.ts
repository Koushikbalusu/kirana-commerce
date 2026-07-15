import { z } from 'zod';
import { cartItemValidator } from '../cart-item/validators';

export const cartValidator = {
  response: z.object({
    id: z.string().uuid(),
    userId: z.string().nullable(),
    sessionId: z.string().nullable(),
    status: z.enum(['ACTIVE', 'CHECKOUT_PENDING', 'ABANDONED', 'CONVERTED_TO_ORDER', 'EXPIRED']),
    couponCode: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    items: z.array(cartItemValidator.response).optional(),
  }),
};
