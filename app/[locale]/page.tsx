import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { HeroScene } from '@/components/temple/HeroScene';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroScene />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-gold mb-6 drop-shadow-2xl">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-muted mb-10 font-light">
          {t('hero.subtitle')}
        </p>
        <Link
          href={`/${locale}/aula`}
          className="inline-block px-8 py-4 border border-gold text-gold rounded-full hover:bg-gold hover:text-background transition-all duration-300 tracking-widest uppercase text-sm"
        >
          {t('hero.cta')}
        </Link>
      </div>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-2xl border border-gold/20 bg-background/60 backdrop-blur-sm">
          <h3 className="text-gold text-xl font-serif mb-3">El Tetractys</h3>
          <p className="text-muted text-sm">
            El Número sagrado que resume toda la creación: 1, 2, 3, 4 = 10.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-gold/20 bg-background/60 backdrop-blur-sm">
          <h3 className="text-gold text-xl font-serif mb-3">La Armonía</h3>
          <p className="text-muted text-sm">
            La proporción musical como ley del alma y del cosmos.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-gold/20 bg-background/60 backdrop-blur-sm">
          <h3 className="text-gold text-xl font-serif mb-3">Amelita</h3>
          <p className="text-muted text-sm">
            Maestra viva de la Sabiduría Pythagorica, lista para acompañarte.
          </p>
        </div>
      </section>
    </div>
  );
}
