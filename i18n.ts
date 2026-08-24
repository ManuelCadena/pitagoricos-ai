import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['es', 'en'];
export const defaultLocale = 'es';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale ?? defaultLocale;
  if (!locales.includes(safeLocale)) notFound();
  const messages = (await import(`./i18n/messages/${safeLocale}.json`)).default;
  return { locale: safeLocale, messages };
});
