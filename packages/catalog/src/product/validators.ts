import { z } from 'zod';

export const productValidator = {
  create: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.string().uuid(),
    brandId: z.string().uuid().optional().nullable(),
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional().nullable(),
  }),
  response: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']),
    categoryId: z.string().uuid(),
    brandId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
  }),
};
