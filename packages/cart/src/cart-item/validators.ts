import { z } from 'zod';

export const cartItemValidator = {
  response: z.object({
    id: z.string().uuid(),
    cartId: z.string().uuid(),
    variantId: z.string().uuid(),
    quantity: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};
