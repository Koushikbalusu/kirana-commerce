import { db } from '../client';

export async function withTransaction<T>(
  callback: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>,
): Promise<T> {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
}
