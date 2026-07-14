import { env } from '../env';

export const appConfig = {
  name: 'Kirana Commerce',
  url: env.NEXT_PUBLIC_APP_URL,
  locales: ['en-US'],
  defaultLocale: 'en-US',
} as const;
