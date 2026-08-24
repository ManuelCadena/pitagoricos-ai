'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';

export function LanguageSwitcher({ currentLocale, variant = 'light' }: { currentLocale: string; variant?: 'light' | 'dark' }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Replace current locale in pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const isHomepage = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
  const actualVariant = isHomepage ? 'dark' : variant;

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1.5 text-xs font-light tracking-widest uppercase transition-all duration-300 rounded-full ${
            actualVariant === 'dark'
              ? currentLocale === locale
                ? 'bg-[rgb(var(--color-white))] text-[rgb(var(--color-charcoal))] shadow-sm'
                : 'text-[rgb(var(--color-white)_/_0.6)] hover:text-[rgb(var(--color-white))] hover:bg-[rgb(var(--color-white)_/_0.1)]'
              : currentLocale === locale
                ? 'bg-[rgb(var(--color-charcoal))] text-[rgb(var(--color-white))] shadow-sm'
                : 'text-[rgb(var(--color-slate))] hover:text-[rgb(var(--color-charcoal))] hover:bg-[rgb(var(--color-cloud))]'
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
