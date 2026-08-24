'use client';

import { useEffect, useState } from 'react';
import { Mic, MessageSquare, RotateCcw } from 'lucide-react';

export interface SessionItem {
  id: string;
  type: string;
  title: string | null;
  summary: string | null;
  status: string;
  createdAt: string;
}

export function SessionList({
  locale,
  onResume,
  refreshKey,
}: {
  locale: string;
  onResume: (session: SessionItem) => void;
  refreshKey: number;
}) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const es = locale === 'es';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSessions(data.sessions ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const synced = sessions.filter((s) => s.status === 'synced');

  if (loading) {
    return (
      <div className="text-center text-sm font-light text-[rgb(var(--color-stone))] py-6 animate-pulse">
        {es ? 'Cargando sesiones...' : 'Loading sessions...'}
      </div>
    );
  }

  if (synced.length === 0) {
    return (
      <div className="text-center text-sm font-light text-[rgb(var(--color-stone))] py-6">
        {es
          ? 'Todavía no hay sesiones guardadas. Tu primera conversación con Teano quedará registrada aquí.'
          : 'No saved sessions yet. Your first conversation with Teano will be recorded here.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-light text-[rgb(var(--color-slate))] tracking-[0.2em] uppercase text-center mb-4">
        {es ? 'Sesiones anteriores' : 'Previous sessions'}
      </h3>
      {synced.map((s) => {
        const date = new Date(s.createdAt);
        const dateStr = date.toLocaleDateString(es ? 'es-AR' : 'en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return (
          <div
            key={s.id}
            className="card-minimal rounded-2xl px-4 sm:px-5 py-3.5 flex items-center gap-3 sm:gap-4"
          >
            <div className="shrink-0 w-9 h-9 rounded-full bg-[rgb(var(--color-sky))] flex items-center justify-center">
              {s.type === 'voice' ? (
                <Mic className="w-4 h-4 text-[rgb(var(--color-depth))]" />
              ) : (
                <MessageSquare className="w-4 h-4 text-[rgb(var(--color-depth))]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[rgb(var(--color-stone))] font-light">{dateStr}</p>
              <p className="text-sm text-[rgb(var(--color-charcoal))] font-light truncate">
                {s.summary ?? s.title ?? (es ? 'Sesión' : 'Session')}
              </p>
            </div>
            <button
              onClick={() => onResume(s)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 min-h-[40px] text-xs font-light tracking-wide text-[rgb(var(--color-depth))] border border-[rgb(var(--color-depth)_/_0.4)] rounded-full hover:bg-[rgb(var(--color-sky))] active:bg-[rgb(var(--color-horizon))] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {es ? 'Retomar' : 'Resume'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
