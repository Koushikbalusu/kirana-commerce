import { z } from 'zod';

export const paymentResponseSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  amount: z.number().int(),
  currency: z.string(),
  currencyPrecision: z.number().int(),
  internalStatus: z.enum(['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED']),
  providerMetadata: z.any(),
  createdAt: z.date(),
});

export type PaymentResponseDTO = z.infer<typeof paymentResponseSchema>;
