import { z } from 'zod';

export const priceValidator = {
  create: z.object({
    variantId: z.string().uuid(),
    currencyId: z.string().uuid(),
    amount: z.number().int().nonnegative(),
    msrp: z.number().int().nonnegative().optional(),
    startsAt: z.date().optional(),
    endsAt: z.date().optional(),
  }),
  response: z.object({
    id: z.string().uuid(),
    variantId: z.string().uuid(),
    currencyId: z.string().uuid(),
    amount: z.number().int(),
    msrp: z.number().int().nullable(),
    startsAt: z.date(),
    endsAt: z.date().nullable(),
  }),
};
