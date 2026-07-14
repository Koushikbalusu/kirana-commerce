import { z } from 'zod';

export const commonSchemas = {
  url: z.string().url(),
  booleanString: z.enum(['true', 'false']).transform((val) => val === 'true'),
};
