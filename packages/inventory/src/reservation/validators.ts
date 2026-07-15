import { z } from 'zod';

export const reservationValidator = {
  create: z.object({
    variantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    ownerType: z.string().min(1),
    ownerId: z.string().min(1),
    quantity: z.number().int().positive(),
    ttlSeconds: z.number().int().positive().default(900), // 15 mins default
  }),
  response: z.object({
    id: z.string().uuid(),
    inventoryId: z.string().uuid(),
    ownerType: z.string(),
    ownerId: z.string(),
    quantity: z.number(),
    status: z.enum(['PENDING', 'CONSUMED', 'RELEASED', 'EXPIRED']),
    expiresAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};
