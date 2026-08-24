import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen">
      {/* Hero: Turrell-inspired light field */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden gradient-sky">
        {/* Subtle light portal effect */}
        <div className="absolute inset-0 light-portal" />
        
        {/* Minimal geometric element: single circle (Tetractys abstracted) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[600px] h-[600px] rounded-full border border-[rgb(var(--color-depth))]" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[rgb(var(--color-twilight))]" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[rgb(var(--color-dusk))]" />
        </div>

        {/* Content: extreme simplicity */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-12">
          {/* Title: ultra-minimal */}
          <h1 className="text-display font-light text-[rgb(var(--color-charcoal))] text-balance">
            {t('hero.title')}
          </h1>
          
          {/* Subtitle: breathing room */}
          <p className="text-xl md:text-2xl font-light text-[rgb(var(--color-slate))] max-w-2xl mx-auto leading-relaxed text-balance">
            {t('hero.subtitle')}
          </p>
          
          {/* CTA: minimal button */}
          <div className="pt-8">
            <Link
              href={`/${locale}/aula`}
              className="inline-flex items-center gap-3 px-12 py-4 bg-[rgb(var(--color-white))] text-[rgb(var(--color-charcoal))] rounded-full font-light tracking-wide hover:shadow-lg transition-all duration-500 border border-[rgb(var(--color-cloud))]"
            >
              {t('hero.cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll indicator: minimal */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-light text-[rgb(var(--color-slate))] uppercase tracking-widest">
            {locale === 'es' ? 'Explorar' : 'Explore'}
          </span>
          <svg className="w-5 h-5 text-[rgb(var(--color-slate))] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Principles: minimal cards with space */}
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
            Academia de Filosofía Pythagorica A.C.
          </p>
        </div>
      </footer>
    </div>
  );
}
