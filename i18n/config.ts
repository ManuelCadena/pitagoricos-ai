import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en'];
export const defaultLocale = 'es';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale ?? defaultLocale;
  const messages = (await import(`./messages/${safeLocale}.json`)).default;
  return { locale: safeLocale, messages };
});
