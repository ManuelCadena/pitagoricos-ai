import { getTranslations } from 'next-intl/server';
import { Aula } from '@/components/amelita/Aula';
import Image from 'next/image';

export default async function AulaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen relative">
      {/* Background: temple con overlay fuerte para legibilidad */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/pythagorean-temple.jpg"
          alt="Pythagorean Temple"
          fill
          className="object-cover opacity-20"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-paper))] via-[rgb(var(--color-paper)_/_0.95)] to-[rgb(var(--color-paper))]" />
      </div>

      {/* Hero: minimal, contemplative */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Amelita presence: círculos concéntricos */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 light-portal" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-[rgb(var(--color-depth))] opacity-30" />
                <div className="absolute w-16 h-16 rounded-full border border-[rgb(var(--color-twilight))] opacity-40" />
                <div className="absolute w-8 h-8 rounded-full border border-[rgb(var(--color-dusk))] opacity-50" />
                <div className="absolute w-2 h-2 rounded-full bg-[rgb(var(--color-depth))]" />
              </div>
            </div>
          </div>

          <h1 className="text-title font-light text-[rgb(var(--color-charcoal))] text-balance">
            {t('aula.title')}
          </h1>
          
          <p className="text-lg font-light text-[rgb(var(--color-slate))] max-w-2xl mx-auto leading-relaxed">
            {t('aula.subtitle')}
          </p>
        </div>
      </section>

      {/* Aula component */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Aula locale={locale} />
        </div>
      </section>
    </div>
  );
}
