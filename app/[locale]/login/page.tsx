import { getTranslations } from 'next-intl/server';
import { LoginButton } from '@/components/auth/LoginButton';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('login');

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 via-background to-background" />
      <div className="relative z-10 max-w-md w-full text-center p-8 rounded-3xl border border-gold/20 bg-background/80 backdrop-blur-md shadow-2xl">
        <h1 className="text-3xl font-serif text-gold mb-4">{t('title')}</h1>
        <p className="text-muted mb-8">{t('description')}</p>
        <LoginButton locale={locale} />
      </div>
    </div>
  );
}
