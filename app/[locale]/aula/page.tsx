import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Aula } from '@/components/amelita/Aula';

export default async function AulaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  if (!(session.user as any).isAllowed) {
    redirect(`/${locale}/no-autorizado`);
  }

  const t = await getTranslations('aula');

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif text-gold mb-3">{t('title')}</h1>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </div>
        <Aula locale={locale} userEmail={session.user.email} />
      </div>
    </div>
  );
}
