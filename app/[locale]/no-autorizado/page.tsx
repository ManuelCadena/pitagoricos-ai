import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function UnauthorizedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'unauthorized' });

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center p-8 rounded-3xl border border-gold/20 bg-background/80 backdrop-blur-md">
        <h1 className="text-3xl font-serif text-gold mb-4">{t('title')}</h1>
        <p className="text-muted mb-8">{t('description')}</p>
        <Link
          href={`/${locale}`}
          className="inline-block px-6 py-3 border border-gold text-gold rounded-full hover:bg-gold hover:text-background transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
