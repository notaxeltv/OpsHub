import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'it', 'fr', 'de', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
