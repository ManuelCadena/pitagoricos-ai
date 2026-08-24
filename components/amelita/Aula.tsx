'use client';

import { useSession } from 'next-auth/react';
import { VoiceWidget } from './VoiceWidget';
import { TextChat } from './TextChat';
import { SessionList, type SessionItem } from './SessionList';
import { useState } from 'react';
import { X } from 'lucide-react';

export function Aula({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('voice');
  const [resumeSession, setResumeSession] = useState<SessionItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const es = locale === 'es';

  if (!session?.user?.email) {
    return (
      <div className="card-minimal rounded-3xl p-12 text-center">
        <p className="text-[rgb(var(--color-slate))] font-light">
          {es ? 'Inicia sesión para acceder al aula' : 'Sign in to access the classroom'}
        </p>
      </div>
    );
  }

  const handleResume = (s: SessionItem) => {
    setResumeSession(s);
    setActiveMode(s.type === 'voice' ? 'voice' : 'text');
    // Refrescar lista al volver (la sesión retomada genera una nueva entrada al cerrar)
    setRefreshKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resumeDate = resumeSession
    ? new Date(resumeSession.createdAt).toLocaleDateString(es ? 'es-AR' : 'en-US', {
        day: 'numeric',
        month: 'short',
      })
    : null;

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
            {es ? 'Voz' : 'Voice'}
          </button>
          <button
            onClick={() => setActiveMode('text')}
            className={`px-6 sm:px-8 py-3 min-h-[44px] rounded-full text-sm font-light tracking-wide transition-all ${
              activeMode === 'text'
                ? 'bg-[rgb(var(--color-white))] text-[rgb(var(--color-charcoal))] shadow-sm'
                : 'text-[rgb(var(--color-stone))] hover:text-[rgb(var(--color-slate))]'
            }`}
          >
            {es ? 'Texto' : 'Text'}
          </button>
        </div>
      </div>

      {/* Chip de sesión retomada */}
      {resumeSession && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-sky))] border border-[rgb(var(--color-horizon))] rounded-full text-xs font-light text-[rgb(var(--color-slate))]">
            {es ? `Retomando sesión del ${resumeDate}` : `Resuming session from ${resumeDate}`}
            <button
              onClick={() => setResumeSession(null)}
              className="hover:text-[rgb(var(--color-charcoal))] transition-colors"
              aria-label={es ? 'Cancelar retoma' : 'Cancel resume'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Content: minimal card
          key fuerza remount al cambiar la sesión retomada para que
          el widget abra una conexión nueva con el contexto correcto */}
      <div className="card-minimal rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12">
        {activeMode === 'voice' ? (
          <VoiceWidget
            key={`voice-${resumeSession?.id ?? 'new'}`}
            userEmail={session.user.email}
            resumeId={resumeSession?.id}
          />
        ) : (
          <TextChat
            key={`text-${resumeSession?.id ?? 'new'}`}
            userEmail={session.user.email}
            resumeId={resumeSession?.id}
          />
        )}
      </div>

      {/* Sesiones anteriores */}
      <SessionList locale={locale} onResume={handleResume} refreshKey={refreshKey} />

      {/* Helper text: subtle */}
      <div className="text-center">
        <p className="text-sm font-light text-[rgb(var(--color-stone))]">
          {es
            ? 'Tus conversaciones son privadas y se guardan para tu seguimiento personal'
            : 'Your conversations are private and saved for your personal follow-up'}
        </p>
      </div>
    </div>
  );
}
