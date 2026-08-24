'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthControls } from '@/components/auth/AuthControls';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;
  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Navbar invisible en homepage (controles flotantes propios)
  if (isHomepage) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--color-white)_/_0.95)] backdrop-blur-xl border-b border-[rgb(var(--color-cloud))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        {/* Logo: minimal */}
        <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0">
          <span className="text-base sm:text-lg font-light text-[rgb(var(--color-charcoal))] tracking-wide">
            Pitágoras
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Language switcher: siempre visible */}
          <LanguageSwitcher currentLocale={locale} />

          {session && (
            <Link
              href={`/${locale}/aula`}
              className={`hidden sm:block text-sm font-light tracking-wide transition-colors ${
                isActive(`/${locale}/aula`)
                  ? 'text-[rgb(var(--color-depth))]'
                  : 'text-[rgb(var(--color-slate))] hover:text-[rgb(var(--color-charcoal))]'
              }`}
            >
              {locale === 'es' ? 'Aula' : 'Classroom'}
            </Link>
          )}

          {/* Auth: entrar / salir */}
          <AuthControls locale={locale} variant="light" />
        </div>
      </div>
    </nav>
  );
}
