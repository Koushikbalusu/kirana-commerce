import { z } from 'zod';

export const shipmentResponseSchema = z.object({
  id: z.string().uuid(),
  fulfillmentId: z.string().uuid(),
  status: z.enum([
    'CREATED',
    'PACKED',
    'READY_FOR_PICKUP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'RETURNED',
  ]),
  shippingAddressSnapshot: z.any(),
  customerNameSnapshot: z.string(),
  customerPhoneSnapshot: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShipmentResponseDTO = z.infer<typeof shipmentResponseSchema>;
