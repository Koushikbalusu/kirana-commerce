import { z } from 'zod';

export const inventoryValidator = {
  receive: z.object({
    variantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    quantity: z.number().int().positive(),
  }),
  response: z.object({
    id: z.string().uuid(),
    variantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    availableQuantity: z.number().int(),
    reservedQuantity: z.number().int(),
    version: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};
