import { z } from 'zod';

export const orderItemValidator = {
  response: z.object({
    id: z.string().uuid(),
    orderId: z.string().uuid(),
    variantId: z.string(),
    productName: z.string(),
    sku: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().int(),
    discountAmount: z.number().int(),
    taxAmount: z.number().int(),
    totalPrice: z.number().int(),
    createdAt: z.date(),
  }),
};
