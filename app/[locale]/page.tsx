import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen bg-[rgb(var(--color-charcoal))]">
      {/* Language switcher: floating top-right, minimal */}
      <div className="fixed top-8 right-8 z-50">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      {/* TURRELL EXPERIENCE: Imagen como portal de luz, sin distracciones */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* La imagen ES la experiencia — sin overlays agresivos */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/pythagorean-temple.jpg"
            alt="Pythagorean Temple of Light"
            fill
            priority
            className="object-cover"
            quality={100}
          />
        </div>

        {/* Contenido: MÍNIMO, solo lo esencial, flotando sobre la luz */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          {/* Espacio superior: respiración */}
          <div className="flex-1" />

          {/* Título: ultra-minimal, sin competir con la imagen */}
          <div className="text-center space-y-8 max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-extralight text-[rgb(var(--color-white))] tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {locale === 'es' ? 'Pitágoras' : 'Pythagoras'}
            </h1>
            
            <p className="text-lg md:text-xl font-light text-[rgb(var(--color-white)_/_0.9)] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {locale === 'es' ? 'La escuela renace' : 'The school reborn'}
            </p>
          </div>

          {/* Espacio medio: más respiración */}
          <div className="flex-1" />

          {/* CTA: minimal, casi invisible hasta hover */}
          <div className="pb-20">
            <Link
              href={`/${locale}/aula`}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[rgb(var(--color-white)_/_0.05)] backdrop-blur-xl text-[rgb(var(--color-white))] rounded-full font-light text-sm tracking-widest uppercase border border-[rgb(var(--color-white)_/_0.2)] hover:bg-[rgb(var(--color-white)_/_0.15)] hover:border-[rgb(var(--color-white)_/_0.4)] transition-all duration-700"
            >
              {locale === 'es' ? 'Entrar' : 'Enter'}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll indicator: casi invisible, solo un hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgb(var(--color-white))] to-transparent" />
        </div>
      </section>

      {/* SECCIÓN 2: Espacio contemplativo — transición suave */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 bg-gradient-to-b from-[rgb(var(--color-charcoal))] via-[rgb(30,30,40)] to-[rgb(var(--color-paper))]">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          {/* Principio Turrell: espacio antes de contenido */}
          <div className="h-32" />

          {/* Texto: minimal, contemplativo */}
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-extralight text-[rgb(var(--color-white))] tracking-tight leading-tight">
              {locale === 'es' 
                ? 'Un espacio para contemplar' 
                : 'A space to contemplate'}
            </h2>
            
            <p className="text-lg md:text-xl font-light text-[rgb(var(--color-white)_/_0.7)] leading-relaxed max-w-2xl mx-auto">
              {locale === 'es'
                ? 'La filosofía pitagórica renace en un templo de luz. Amelita te acompaña en el silencio.'
                : 'Pythagorean philosophy reborn in a temple of light. Amelita walks with you in silence.'}
            </p>
          </div>

          {/* Espacio después de contenido */}
          <div className="h-32" />
        </div>
      </section>

      {/* SECCIÓN 3: Tres principios — cards minimalistas sobre fondo claro */}
      <section className="relative py-32 px-6 bg-[rgb(var(--color-paper))]">
        <div className="max-w-6xl mx-auto">
          {/* Título de sección: ultra-minimal */}
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extralight text-[rgb(var(--color-charcoal))] tracking-tight">
              {locale === 'es' ? 'Tres principios' : 'Three principles'}
            </h2>
            <div className="w-12 h-px bg-[rgb(var(--color-depth))] mx-auto" />
          </div>

          {/* Cards: extrema simplicidad */}
          <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            {/* Tetractys */}
            <div className="text-center space-y-6">
              <div className="text-7xl font-extralight text-[rgb(var(--color-depth))]">
                ∴
              </div>
              <h3 className="text-xl font-light text-[rgb(var(--color-charcoal))] tracking-wide">
                Tetractys
              </h3>
              <p className="text-[rgb(var(--color-slate))] font-light leading-relaxed">
                {locale === 'es'
                  ? 'El número sagrado: 1, 2, 3, 4 = 10'
                  : 'The sacred number: 1, 2, 3, 4 = 10'}
              </p>
            </div>

            {/* Armonía */}
            <div className="text-center space-y-6">
              <div className="text-7xl font-extralight text-[rgb(var(--color-twilight))]">
                ○
              </div>
              <h3 className="text-xl font-light text-[rgb(var(--color-charcoal))] tracking-wide">
                {locale === 'es' ? 'Armonía' : 'Harmony'}
              </h3>
              <p className="text-[rgb(var(--color-slate))] font-light leading-relaxed">
                {locale === 'es'
                  ? 'La proporción musical del cosmos'
                  : 'The musical proportion of cosmos'}
              </p>
            </div>

            {/* Amelita */}
            <div className="text-center space-y-6">
              <div className="text-7xl font-extralight text-[rgb(var(--color-dusk))]">
                ◇
              </div>
              <h3 className="text-xl font-light text-[rgb(var(--color-charcoal))] tracking-wide">
                Amelita
              </h3>
              <p className="text-[rgb(var(--color-slate))] font-light leading-relaxed">
                {locale === 'es'
                  ? 'Tu guía en el camino pitagórico'
                  : 'Your guide on the Pythagorean path'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer: minimal */}
      <footer className="py-12 px-6 bg-[rgb(var(--color-cloud))] border-t border-[rgb(var(--color-cloud))]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-light text-[rgb(var(--color-stone))] tracking-widest uppercase">
            Fooworks LLC
          </p>
        </div>
      </footer>
    </div>
  );
}
