import { z } from 'zod';

export const categoryValidator = {
  create: z.object({
    name: z.string().min(1),
    parentId: z.string().uuid().optional().nullable(),
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    parentId: z.string().uuid().optional().nullable(),
  }),
  response: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    parentId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};
