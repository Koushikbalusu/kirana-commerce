import { z } from 'zod';

export const warehouseValidator = {
  create: z.object({
    name: z.string().min(1),
    locationCode: z.string().min(1),
    type: z.enum(['STORE', 'FULFILLMENT_CENTER', 'DARK_STORE', 'SUPPLIER', 'TRANSIT']),
  }),
  response: z.object({
    id: z.string().uuid(),
    name: z.string(),
    locationCode: z.string(),
    type: z.enum(['STORE', 'FULFILLMENT_CENTER', 'DARK_STORE', 'SUPPLIER', 'TRANSIT']),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};
