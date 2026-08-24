'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoginButton } from '@/components/auth/LoginButton';
import Image from 'next/image';

export function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--color-white)_/_0.8)] backdrop-blur-xl border-b border-[rgb(var(--color-cloud))]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo: minimal */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <Image
            src="/images/logo-minimal.svg"
            alt="Pitagóricos"
            width={32}
            height={32}
            className="transition-opacity group-hover:opacity-70"
          />
          <span className="text-lg font-light text-[rgb(var(--color-charcoal))] tracking-wide">
            Pitagóricos
          </span>
        </Link>

        {/* Navigation: minimal */}
        <div className="flex items-center gap-8">
          {session && (
            <Link
              href={`/${locale}/aula`}
              className={`text-sm font-light tracking-wide transition-colors ${
                isActive(`/${locale}/aula`)
                  ? 'text-[rgb(var(--color-depth))]'
                  : 'text-[rgb(var(--color-slate))] hover:text-[rgb(var(--color-charcoal))]'
              }`}
            >
              {locale === 'es' ? 'Aula' : 'Classroom'}
            </Link>
          )}

          {/* Auth */}
          <LoginButton locale={locale} />
        </div>
      </div>
    </nav>
  );
}
