import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { AuthControls } from '@/components/auth/AuthControls';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const es = locale === 'es';

  return (
    <div className="min-h-screen bg-[rgb(var(--color-charcoal))]">
      {/* Controles flotantes: idioma + sesión (safe-area aware) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 pt-[env(safe-area-inset-top)]">
        <LanguageSwitcher currentLocale={locale} />
        <AuthControls locale={locale} variant="dark" />
      </div>

      {/* ══════════════════════════════════════════════════
          I. EL UMBRAL — Skyspace crepuscular sobre el agua
          Turrell: el crepúsculo como pigmento
          Pitágoras: el cielo reflejado en el alma quieta
      ══════════════════════════════════════════════════ */}
      <section className="relative h-[100svh] overflow-hidden">
        <Image
          src="/images/skyspace-hero.jpg"
          alt={es ? 'Skyspace pitagórico al crepúsculo' : 'Pythagorean skyspace at twilight'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />

        {/* Contenido: mínimo absoluto, posicionado en el tercio inferior
            para no competir con el óculo ni el agua */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-20 sm:pb-24 px-5 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <p className="text-[10px] sm:text-xs font-light text-[rgb(var(--color-white)_/_0.7)] tracking-[0.3em] sm:tracking-[0.4em] uppercase">
              ΠΥΘΑΓΟΡΕΙΟΝ
            </p>
            <h1 className="text-[clamp(2.25rem,9vw,4.5rem)] font-extralight text-[rgb(var(--color-white))] tracking-tight leading-[1.05] drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] text-balance">
              {es ? 'La Escuela de Pitágoras' : 'The School of Pythagoras'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-light text-[rgb(var(--color-white)_/_0.85)] tracking-wide">
              {es ? 'Renace, guiada por la luz' : 'Reborn, guided by light'}
            </p>
          </div>
        </div>

        {/* Scroll hint: una sola línea vertical de luz */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-[rgb(var(--color-white))] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          II. EL SILENCIO — Espacio contemplativo
          Turrell: "I want you to sense yourself sensing"
          Pitágoras: el silencio del iniciado
      ══════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center py-28 sm:py-40 md:py-48 px-6 bg-[rgb(var(--color-charcoal))]">
        <div className="max-w-3xl mx-auto text-center space-y-8 sm:space-y-10">
          <p className="text-xl sm:text-2xl md:text-4xl font-extralight text-[rgb(var(--color-white)_/_0.9)] leading-relaxed tracking-wide text-balance">
            {es
              ? 'El alma que contempla la armonía del cosmos se ordena a sí misma.'
              : 'The soul that contemplates the harmony of the cosmos brings order to itself.'}
          </p>
          <div className="w-10 h-px bg-[rgb(var(--color-twilight))] mx-auto" />
          <p className="text-xs sm:text-sm font-light text-[rgb(var(--color-white)_/_0.5)] tracking-[0.3em] uppercase">
            {es ? 'Tradición pitagórica' : 'Pythagorean tradition'}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          III. LOS TRES PILARES — Número, Armonía, Guía
          Sobre fondo claro: la salida del espacio oscuro
          hacia el conocimiento (caverna → luz)
      ══════════════════════════════════════════════════ */}
      <div className="h-24 sm:h-40 bg-gradient-to-b from-[rgb(var(--color-charcoal))] to-[rgb(var(--color-paper))]" />
      <section className="relative py-20 sm:py-32 px-6 bg-[rgb(var(--color-paper))]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-14 sm:gap-16 md:gap-20 max-w-5xl mx-auto">
            {/* Tetractys */}
            <div className="text-center space-y-6">
              {/* Tetractys de 10 puntos, dibujada en SVG puro */}
              <div className="flex justify-center">
                <svg width="80" height="72" viewBox="0 0 80 72" className="opacity-80">
                  <circle cx="40" cy="8" r="3" fill="rgb(147,197,253)" />
                  <circle cx="30" cy="26" r="3" fill="rgb(147,197,253)" />
                  <circle cx="50" cy="26" r="3" fill="rgb(147,197,253)" />
                  <circle cx="20" cy="44" r="3" fill="rgb(165,180,252)" />
                  <circle cx="40" cy="44" r="3" fill="rgb(165,180,252)" />
                  <circle cx="60" cy="44" r="3" fill="rgb(165,180,252)" />
                  <circle cx="10" cy="62" r="3" fill="rgb(192,132,252)" />
                  <circle cx="30" cy="62" r="3" fill="rgb(192,132,252)" />
                  <circle cx="50" cy="62" r="3" fill="rgb(192,132,252)" />
                  <circle cx="70" cy="62" r="3" fill="rgb(192,132,252)" />
                </svg>
              </div>
              <h3 className="text-lg font-light text-[rgb(var(--color-charcoal))] tracking-[0.2em] uppercase">
                {es ? 'Número' : 'Number'}
              </h3>
              <p className="text-sm text-[rgb(var(--color-stone))] font-light leading-relaxed max-w-xs mx-auto">
                {es
                  ? 'La tetractys: 1 + 2 + 3 + 4 = 10. La estructura que hace cognoscible el mundo.'
                  : 'The tetractys: 1 + 2 + 3 + 4 = 10. The structure that makes the world knowable.'}
              </p>
            </div>

            {/* Armonía */}
            <div className="text-center space-y-6">
              {/* Monocorde: proporciones musicales 1:2, 2:3, 3:4 */}
              <div className="flex justify-center items-end gap-2 h-[72px]">
                <div className="w-px h-12 bg-[rgb(147,197,253)]" />
                <div className="w-px h-8 bg-[rgb(165,180,252)]" />
                <div className="w-px h-9 bg-[rgb(165,180,252)]" />
                <div className="w-px h-6 bg-[rgb(192,132,252)]" />
              </div>
              <h3 className="text-lg font-light text-[rgb(var(--color-charcoal))] tracking-[0.2em] uppercase">
                {es ? 'Armonía' : 'Harmony'}
              </h3>
              <p className="text-sm text-[rgb(var(--color-stone))] font-light leading-relaxed max-w-xs mx-auto">
                {es
                  ? 'Octava, quinta, cuarta: el cosmos afinado como una lira. La música de las esferas.'
                  : 'Octave, fifth, fourth: the cosmos tuned like a lyre. The music of the spheres.'}
              </p>
            </div>

            {/* Teano */}
            <div className="text-center space-y-6">
              {/* Círculos concéntricos: la presencia */}
              <div className="flex justify-center items-center h-[72px]">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute w-16 h-16 rounded-full border border-[rgb(147,197,253)_/_0.4]" />
                  <div className="absolute w-10 h-10 rounded-full border border-[rgb(165,180,252)_/_0.6]" />
                  <div className="absolute w-2 h-2 rounded-full bg-[rgb(192,132,252)]" />
                </div>
              </div>
              <h3 className="text-lg font-light text-[rgb(var(--color-charcoal))] tracking-[0.2em] uppercase">
                Teano
              </h3>
              <p className="text-sm text-[rgb(var(--color-stone))] font-light leading-relaxed max-w-xs mx-auto">
                {es
                  ? 'Tu maestra y guía. La voz que acompaña tu camino por la sabiduría pitagórica.'
                  : 'Your teacher and guide. The voice that walks with you along the Pythagorean path.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          IV. EL DODECAEDRO — Umbral hacia el aula
          El sólido del cosmos invita a entrar
      ══════════════════════════════════════════════════ */}
      <section className="relative h-[80svh] sm:h-[90vh] overflow-hidden">
        <Image
          src="/images/dodecahedron-hall.jpg"
          alt={es ? 'Sala del dodecaedro' : 'Dodecahedron hall'}
          fill
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        {/* Velo sutil solo en la base para el CTA */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 pb-14 sm:pb-20 px-5 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <p className="text-base sm:text-lg md:text-xl font-light text-[rgb(var(--color-white)_/_0.9)] tracking-wide drop-shadow-md">
              {es ? 'El aula te espera' : 'The classroom awaits'}
            </p>
            <Link
              href={`/${locale}/aula`}
              className="group inline-flex items-center justify-center gap-3 px-10 sm:px-12 py-4 min-h-[52px] bg-[rgb(var(--color-white)_/_0.08)] backdrop-blur-xl text-[rgb(var(--color-white))] rounded-full font-light text-sm tracking-[0.3em] uppercase border border-[rgb(var(--color-white)_/_0.25)] hover:bg-[rgb(var(--color-white)_/_0.18)] hover:border-[rgb(var(--color-white)_/_0.5)] active:bg-[rgb(var(--color-white)_/_0.25)] transition-all duration-700"
            >
              {es ? 'Entrar' : 'Enter'}
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer: minimal */}
      <footer className="py-8 sm:py-10 px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] bg-[rgb(var(--color-charcoal))]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] sm:text-xs font-light text-[rgb(var(--color-white)_/_0.4)] tracking-[0.3em] uppercase">
            Fooworks LLC
          </p>
          <p className="text-[10px] sm:text-xs font-light text-[rgb(var(--color-white)_/_0.4)] tracking-[0.3em] uppercase">
            ΚΟΣΜΟΣ · ΑΡΜΟΝΙΑ
          </p>
        </div>
      </footer>
    </div>
  );
}
