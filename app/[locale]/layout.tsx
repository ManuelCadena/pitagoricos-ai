import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/config';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { Navbar } from '@/components/ui/Navbar';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/images/logo.svg',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            <Navbar locale={locale} />
            <main className="flex-1">{children}</main>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
