'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { LogOut, LogIn } from 'lucide-react';

export function AuthControls({ locale, variant = 'light' }: { locale: string; variant?: 'light' | 'dark' }) {
  const { data: session, status } = useSession();
  const es = locale === 'es';

  const base =
    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-light tracking-widest uppercase transition-all duration-300 min-h-[40px]';
  const styles =
    variant === 'dark'
      ? 'text-[rgb(var(--color-white)_/_0.8)] border border-[rgb(var(--color-white)_/_0.25)] hover:bg-[rgb(var(--color-white)_/_0.1)] hover:text-[rgb(var(--color-white))] backdrop-blur-md'
      : 'text-[rgb(var(--color-slate))] border border-[rgb(var(--color-cloud))] hover:bg-[rgb(var(--color-cloud))] hover:text-[rgb(var(--color-charcoal))]';

  if (status === 'loading') {
    return <div className={`${base} ${styles} opacity-40`}>···</div>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span
          className={`hidden sm:block text-xs font-light truncate max-w-[140px] ${
            variant === 'dark' ? 'text-[rgb(var(--color-white)_/_0.6)]' : 'text-[rgb(var(--color-stone))]'
          }`}
        >
          {session.user.email}
        </span>
        <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className={`${base} ${styles}`}>
          <LogOut className="w-3.5 h-3.5" />
          {es ? 'Salir' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn('google', { callbackUrl: `/${locale}/aula` })} className={`${base} ${styles}`}>
      <LogIn className="w-3.5 h-3.5" />
      {es ? 'Entrar' : 'Sign in'}
    </button>
  );
}
