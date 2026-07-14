import { env } from '../env';

export const featureFlags = {
  maintenanceMode: env.NEXT_PUBLIC_MAINTENANCE_MODE,
} as const;
