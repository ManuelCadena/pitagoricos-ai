'use client';

import { useSession } from 'next-auth/react';
import { VoiceWidget } from './VoiceWidget';
import { TextChat } from './TextChat';
import { useState } from 'react';

export function Aula({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('voice');

  if (!session?.user?.email) {
    return (
      <div className="card-minimal rounded-3xl p-12 text-center">
        <p className="text-[rgb(var(--color-slate))] font-light">
          {locale === 'es' ? 'Inicia sesión para acceder al aula' : 'Sign in to access the classroom'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Mode selector: minimal tabs (touch-friendly ≥44px) */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 sm:gap-2 p-1 bg-[rgb(var(--color-cloud))] rounded-full">
          <button
            onClick={() => setActiveMode('voice')}
            className={`px-6 sm:px-8 py-3 min-h-[44px] rounded-full text-sm font-light tracking-wide transition-all ${
              activeMode === 'voice'
                ? 'bg-[rgb(var(--color-white))] text-[rgb(var(--color-charcoal))] shadow-sm'
                : 'text-[rgb(var(--color-stone))] hover:text-[rgb(var(--color-slate))]'
            }`}
          >
            {locale === 'es' ? 'Voz' : 'Voice'}
          </button>
          <button
            onClick={() => setActiveMode('text')}
            className={`px-6 sm:px-8 py-3 min-h-[44px] rounded-full text-sm font-light tracking-wide transition-all ${
              activeMode === 'text'
                ? 'bg-[rgb(var(--color-white))] text-[rgb(var(--color-charcoal))] shadow-sm'
                : 'text-[rgb(var(--color-stone))] hover:text-[rgb(var(--color-slate))]'
            }`}
          >
            {locale === 'es' ? 'Texto' : 'Text'}
          </button>
        </div>
      </div>

      {/* Content: minimal card */}
      <div className="card-minimal rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12">
        {activeMode === 'voice' ? (
          <VoiceWidget userEmail={session.user.email} />
        ) : (
          <TextChat userEmail={session.user.email} />
        )}
      </div>

      {/* Helper text: subtle */}
      <div className="text-center">
        <p className="text-sm font-light text-[rgb(var(--color-stone))]">
          {locale === 'es'
            ? 'Tus conversaciones son privadas y se guardan para tu seguimiento personal'
            : 'Your conversations are private and saved for your personal follow-up'}
        </p>
      </div>
    </div>
  );
}
