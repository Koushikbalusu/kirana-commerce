import { z } from 'zod';
import { orderItemValidator } from '../order-item/validators';

export const orderValidator = {
  response: z.object({
    id: z.string().uuid(),
    orderNumber: z.string(),
    userId: z.string().nullable(),
    checkoutSessionId: z.string().uuid(),
    financialStatus: z.enum(['UNPAID', 'AUTHORIZED', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED']),
    fulfillmentStatus: z.enum([
      'UNFULFILLED',
      'PROCESSING',
      'PARTIALLY_SHIPPED',
      'SHIPPED',
      'DELIVERED',
    ]),
    customerSnapshot: z.any(),
    shippingAddressSnapshot: z.any(),
    billingAddressSnapshot: z.any(),
    totalsSnapshot: z.any(),
    paymentReference: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    items: z.array(orderItemValidator.response).optional(),
  }),
};
