import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { HeroScene } from '@/components/temple/HeroScene';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="relative min-h-screen">
      {/* Hero section with 3D background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Scene as background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-[1]" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8 inline-block">
            <div className="w-16 h-16 mx-auto mb-4 opacity-80">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-gold">
                <circle cx="50" cy="20" r="4" />
                <circle cx="40" cy="35" r="4" />
                <circle cx="50" cy="35" r="4" />
                <circle cx="60" cy="35" r="4" />
                <circle cx="35" cy="50" r="4" />
                <circle cx="45" cy="50" r="4" />
                <circle cx="55" cy="50" r="4" />
                <circle cx="65" cy="50" r="4" />
                <circle cx="30" cy="65" r="4" />
                <circle cx="40" cy="65" r="4" />
                <circle cx="50" cy="65" r="4" />
                <circle cx="60" cy="65" r="4" />
                <circle cx="70" cy="65" r="4" />
              </svg>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif text-gold mb-6 leading-tight tracking-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-3xl text-gold/80 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <Link
            href={`/${locale}/aula`}
            className="group inline-flex items-center gap-3 px-10 py-5 border-2 border-gold text-gold rounded-full hover:bg-gold hover:text-background transition-all duration-500 tracking-widest uppercase text-sm font-medium shadow-2xl hover:shadow-gold/50"
          >
            {t('hero.cta')}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Principles section */}
      <section className="relative bg-background py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gold mb-4">
              {locale === 'es' ? 'Los Tres Pilares' : 'The Three Pillars'}
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {locale === 'es' 
                ? 'Fundamentos de la sabiduría pitagórica que guían nuestro camino'
                : 'Foundations of Pythagorean wisdom that guide our path'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tetractys */}
            <div className="group relative p-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-background to-deep-blue/20 hover:border-gold/40 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all" />
              
              <div className="relative">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-gold/10 text-gold text-2xl font-serif">
                  ∴
                </div>
                
                <h3 className="text-2xl font-serif text-gold mb-4">
                  {locale === 'es' ? 'El Tetractys' : 'The Tetractys'}
                </h3>
                
                <p className="text-muted leading-relaxed">
                  {locale === 'es'
                    ? 'El Número sagrado que resume toda la creación: 1, 2, 3, 4 = 10. La perfección geométrica del universo.'
                    : 'The sacred Number that sums all creation: 1, 2, 3, 4 = 10. The geometric perfection of the universe.'}
                </p>
              </div>
            </div>

            {/* Harmony */}
            <div className="group relative p-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-background to-deep-blue/20 hover:border-gold/40 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all" />
              
              <div className="relative">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-gold/10 text-gold text-2xl font-serif">
                  ♪
                </div>
                
                <h3 className="text-2xl font-serif text-gold mb-4">
                  {locale === 'es' ? 'La Armonía' : 'Harmony'}
                </h3>
                
                <p className="text-muted leading-relaxed">
                  {locale === 'es'
                    ? 'La proporción musical como ley del alma y del cosmos. El orden matemático que rige toda existencia.'
                    : 'Musical proportion as the law of soul and cosmos. The mathematical order that governs all existence.'}
                </p>
              </div>
            </div>

            {/* Amelita */}
            <div className="group relative p-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-background to-deep-blue/20 hover:border-gold/40 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all" />
              
              <div className="relative">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-gold/10 text-gold text-2xl font-serif">
                  ✦
                </div>
                
                <h3 className="text-2xl font-serif text-gold mb-4">
                  Amelita
                </h3>
                
                <p className="text-muted leading-relaxed">
                  {locale === 'es'
                    ? 'Maestra viva de la Sabiduría Pythagorica, lista para acompañarte en tu camino de transformación.'
                    : 'A living teacher of Pythagorean Wisdom, ready to walk with you on your path of transformation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
