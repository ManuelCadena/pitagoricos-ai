import { getTranslations } from 'next-intl/server';
import { Aula } from '@/components/amelita/Aula';
import Image from 'next/image';

export default async function AulaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen relative">
      {/* Fondo: sala de la Tetraktys — el espacio interior de estudio */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/tetraktys-hall.jpg"
          alt="Tetraktys hall"
          fill
          sizes="100vw"
          className="object-cover object-center"
          quality={85}
        />
        {/* Velo cálido para legibilidad del contenido */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-paper)_/_0.88)] via-[rgb(var(--color-paper)_/_0.82)] to-[rgb(var(--color-paper)_/_0.92)]" />
      </div>

      {/* Hero: minimal, contemplativo */}
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16 px-5 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Presencia de Teano: círculos concéntricos */}
          <div className="flex justify-center mb-4 sm:mb-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <div className="absolute inset-0 light-portal" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[rgb(var(--color-depth))] opacity-30" />
                <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[rgb(var(--color-twilight))] opacity-40" />
                <div className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[rgb(var(--color-dusk))] opacity-50" />
                <div className="absolute w-2 h-2 rounded-full bg-[rgb(var(--color-depth))]" />
              </div>
            </div>
          </div>

          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-light text-[rgb(var(--color-charcoal))] text-balance leading-tight">
            {t('aula.title')}
          </h1>

          <p className="text-base sm:text-lg font-light text-[rgb(var(--color-slate))] max-w-2xl mx-auto leading-relaxed">
            {t('aula.subtitle')}
          </p>
        </div>
      </section>

      {/* Aula component */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Aula locale={locale} />
        </div>
      </section>
    </div>
  );
}
