'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const { data: session, status } = useSession();

  const otherLocale = locale === 'es' ? 'en' : 'es';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3 text-gold font-serif text-xl tracking-wide">
          <Image src="/images/logo.svg" alt="Pitagóricos.ai" width={36} height={36} />
          <span className="hidden sm:inline">Pitagóricos.ai</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href={`/${locale}`} className="hover:text-gold transition-colors">
            {t('home')}
          </Link>
          <Link href={`/${locale}/aula`} className="hover:text-gold transition-colors">
            {t('aula')}
          </Link>
          <Link href={`/${otherLocale}`} className="text-muted hover:text-gold transition-colors">
            {otherLocale.toUpperCase()}
          </Link>
          {status === 'authenticated' ? (
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="text-muted hover:text-gold transition-colors"
            >
              {t('logout')}
            </button>
          ) : (
            <Link href={`/${locale}/login`} className="text-gold hover:text-gold-light transition-colors">
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
