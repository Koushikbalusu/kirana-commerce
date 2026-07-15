import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@kirana/database';

export const adapter = DrizzleAdapter(db);
