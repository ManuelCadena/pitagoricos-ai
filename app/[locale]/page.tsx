import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen">
      {/* Hero: Pythagorean Temple — imagen centrada a tamaño completo */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image: temple centrado, tamaño completo */}
        <div className="absolute inset-0 flex items-center justify-center bg-[rgb(var(--color-charcoal))]">
          <Image
            src="/images/pythagorean-temple.jpg"
            alt="Pythagorean Temple"
            width={1920}
            height={1080}
            priority
            className="max-w-full max-h-full object-contain"
            quality={95}
          />
          {/* Overlay: muy sutil, solo para texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] via-transparent to-[rgba(0,0,0,0.3)]" />
        </div>

        {/* Content: minimal, legible */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-12">
          {/* Title: ultra-minimal con text-shadow sutil */}
          <h1 className="text-display font-light text-[rgb(var(--color-white))] text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            {t('hero.title')}
          </h1>
          
          {/* Subtitle: breathing room */}
          <p className="text-xl md:text-2xl font-light text-[rgb(var(--color-white))] max-w-2xl mx-auto leading-relaxed text-balance drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
            {t('hero.subtitle')}
          </p>
          
          {/* CTA: glassmorphism button */}
          <div className="pt-8">
            <Link
              href={`/${locale}/aula`}
              className="inline-flex items-center gap-3 px-12 py-4 bg-[rgb(var(--color-white)_/_0.9)] backdrop-blur-md text-[rgb(var(--color-charcoal))] rounded-full font-light tracking-wide hover:bg-[rgb(var(--color-white))] hover:shadow-2xl transition-all duration-500 border border-[rgb(var(--color-white)_/_0.3)]"
            >
              {t('hero.cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll indicator: minimal */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs font-light text-[rgb(var(--color-white))] uppercase tracking-widest drop-shadow-md">
            {locale === 'es' ? 'Explorar' : 'Explore'}
          </span>
          <svg className="w-5 h-5 text-[rgb(var(--color-white))] animate-bounce drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Principles: minimal cards con espacio */}
      <section className="relative py-32 px-6 bg-[rgb(var(--color-paper))]">
        <div className="max-w-6xl mx-auto">
          {/* Section title: minimal */}
          <div className="text-center mb-24">
            <h2 className="text-title font-light text-[rgb(var(--color-charcoal))] mb-6">
              {locale === 'es' ? 'Tres Principios' : 'Three Principles'}
            </h2>
            <div className="w-16 h-px bg-[rgb(var(--color-depth))] mx-auto" />
          </div>

          {/* Cards: extreme simplicity, lots of space */}
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Tetractys */}
            <div className="group">
              <div className="card-minimal rounded-3xl p-12 h-full flex flex-col items-center text-center space-y-6 transition-all duration-500">
                {/* Icon: single geometric symbol */}
                <div className="w-16 h-16 flex items-center justify-center">
                  <div className="text-6xl font-extralight text-[rgb(var(--color-depth))]">
                    ∴
                  </div>
                </div>
                
                <h3 className="text-2xl font-light text-[rgb(var(--color-charcoal))]">
                  {locale === 'es' ? 'Tetractys' : 'Tetractys'}
                </h3>
                
                <p className="text-[rgb(var(--color-slate))] leading-relaxed font-light">
                  {locale === 'es'
                    ? 'El número sagrado que contiene toda la creación: 1, 2, 3, 4 = 10'
                    : 'The sacred number containing all creation: 1, 2, 3, 4 = 10'}
                </p>
              </div>
            </div>

            {/* Harmony */}
            <div className="group">
              <div className="card-minimal rounded-3xl p-12 h-full flex flex-col items-center text-center space-y-6 transition-all duration-500">
                <div className="w-16 h-16 flex items-center justify-center">
                  <div className="text-6xl font-extralight text-[rgb(var(--color-twilight))]">
                    ○
                  </div>
                </div>
                
                <h3 className="text-2xl font-light text-[rgb(var(--color-charcoal))]">
                  {locale === 'es' ? 'Armonía' : 'Harmony'}
                </h3>
                
                <p className="text-[rgb(var(--color-slate))] leading-relaxed font-light">
                  {locale === 'es'
                    ? 'La proporción musical como ley del cosmos y del alma'
                    : 'Musical proportion as the law of cosmos and soul'}
                </p>
              </div>
            </div>

            {/* Amelita */}
            <div className="group">
              <div className="card-minimal rounded-3xl p-12 h-full flex flex-col items-center text-center space-y-6 transition-all duration-500">
                <div className="w-16 h-16 flex items-center justify-center">
                  <div className="text-6xl font-extralight text-[rgb(var(--color-dusk))]">
                    ◇
                  </div>
                </div>
                
                <h3 className="text-2xl font-light text-[rgb(var(--color-charcoal))]">
                  Amelita
                </h3>
                
                <p className="text-[rgb(var(--color-slate))] leading-relaxed font-light">
                  {locale === 'es'
                    ? 'Maestra de la sabiduría pitagórica, lista para acompañarte'
                    : 'Teacher of Pythagorean wisdom, ready to walk with you'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer: minimal */}
      <footer className="py-12 px-6 bg-[rgb(var(--color-cloud))]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-light text-[rgb(var(--color-stone))]">
            Fooworks LLC
          </p>
        </div>
      </footer>
    </div>
  );
}
