'use client';

import { useEffect, useState, FormEvent, useRef, useCallback } from 'react';
import { Send, AlertCircle, RefreshCw } from 'lucide-react';
import { Conversation, type TextConversation } from '@elevenlabs/client';

interface Message {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const BACKOFF_MS = [1000, 2000, 4000, 8000, 15000];

export function TextChat({ userEmail, resumeId }: { userEmail: string; resumeId?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: 'Hola, hermanito querido. Estoy acá. Escribime lo que quieras que miremos juntos.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversationRef = useRef<TextConversation | null>(null);
  const mountedRef = useRef(true);
  const attemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const elConversationIdRef = useRef<string | null>(null);
  const resumeIdRef = useRef(resumeId);
  resumeIdRef.current = resumeId;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notifica el fin de sesión al backend para sincronizar transcript+resumen (memoria)
  const notifySessionEnd = useCallback(() => {
    const elId = elConversationIdRef.current;
    if (!elId) return;
    elConversationIdRef.current = null;
    const payload = JSON.stringify({ elConversationId: elId });
    if (!navigator.sendBeacon?.('/api/sessions/end', new Blob([payload], { type: 'application/json' }))) {
      fetch('/api/sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  const connect = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const res = await fetch('/api/signed-url');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo obtener la URL firmada');
      if (!mountedRef.current) return;

      const conv = await Conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: 'websocket',
        textOnly: true,
        onConnect: ({ conversationId }) => {
          console.log('[TextChat] Connected (text-only):', conversationId);
          attemptsRef.current = 0;
          setConnected(true);
          setReconnecting(false);
          setError(null);
          elConversationIdRef.current = conversationId;

          // MEMORIA: registrar sesión + inyectar contexto de sesiones anteriores
          fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ elConversationId: conversationId, type: 'text' }),
          }).catch(() => {});

          const rid = resumeIdRef.current;
          const memoryUrl = rid ? `/api/memory?resumeId=${encodeURIComponent(rid)}` : '/api/memory';
          fetch(memoryUrl)
            .then((r) => r.json())
            .then(({ context }) => {
              if (context && conversationRef.current) {
                conversationRef.current.sendContextualUpdate(context);
                console.log('[TextChat] Memoria inyectada:', context.length, 'chars');
              }
            })
            .catch(() => {});
        },
        onDisconnect: (details) => {
          // Diagnóstico: reason = 'error' (red) | 'agent' (timeout/limite del agente) | 'user'
          console.warn('[TextChat] Disconnected:', JSON.stringify(details));
          setConnected(false);
          // La conversación de EL terminó (una reconexión crea otra nueva):
          // sincronizar transcript+resumen de la que acaba de cerrar.
          notifySessionEnd();
          if (!mountedRef.current || details.reason === 'user') return;

          // Reconexión automática con backoff
          if (attemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            const delay = BACKOFF_MS[attemptsRef.current] ?? 15000;
            attemptsRef.current += 1;
            setReconnecting(true);
            console.log(`[TextChat] Reconnecting in ${delay}ms (attempt ${attemptsRef.current})`);
            reconnectTimerRef.current = setTimeout(() => {
              if (mountedRef.current) connect();
            }, delay);
          } else {
            setReconnecting(false);
            setError(
              details.reason === 'agent'
                ? 'Ame cerró la sesión por inactividad. Tocá reconectar para seguir.'
                : 'Conexión perdida. Tocá reconectar para seguir.'
            );
          }
        },
        onMessage: (message) => {
          if (message.source === 'ai' && message.message) {
            setMessages((prev) => [
              ...prev,
              { role: 'agent', text: message.message, timestamp: Date.now() },
            ]);
            setLoading(false);
          }
        },
        onError: (err) => {
          console.error('[TextChat] Error:', err);
        },
      });

      if (!mountedRef.current) {
        conv.endSession().catch(() => {});
        return;
      }
      conversationRef.current = conv;
    } catch (err: any) {
      console.error('[TextChat] Failed to connect:', err);
      if (!mountedRef.current) return;
      if (attemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = BACKOFF_MS[attemptsRef.current] ?? 15000;
        attemptsRef.current += 1;
        setReconnecting(true);
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current) connect();
        }, delay);
      } else {
        setReconnecting(false);
        setError(err.message || 'Error iniciando el chat');
      }
    }
  }, [notifySessionEnd]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      conversationRef.current?.endSession().catch(() => {});
      conversationRef.current = null;
      notifySessionEnd();
    };
  }, [connect, notifySessionEnd]);

  const manualReconnect = () => {
    setError(null);
    attemptsRef.current = 0;
    setReconnecting(true);
    connect();
  };

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    const conv = conversationRef.current;
    const text = input.trim();
    if (!text || !conv || !connected) return;

    setMessages((prev) => [...prev, { role: 'user', text, timestamp: Date.now() }]);
    setInput('');
    setLoading(true);

    try {
      conv.sendUserMessage(text);
    } catch (err) {
      console.error('[TextChat] Error sending message:', err);
      setError('Error enviando el mensaje');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[65vh] sm:h-[60vh]">
      {/* Estado de conexión */}
      <div className="mb-3 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              connected ? 'bg-green-500' : reconnecting ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
            }`}
          />
          <span className="text-[rgb(var(--color-stone))] font-light truncate">
            {connected
              ? 'Conectado'
              : reconnecting
                ? `Reconectando... (intento ${attemptsRef.current})`
                : error
                  ? 'Desconectado'
                  : 'Conectando...'}
          </span>
        </div>
        {error && (
          <button
            onClick={manualReconnect}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] text-[rgb(var(--color-depth))] border border-[rgb(var(--color-depth))] rounded-full hover:bg-[rgb(var(--color-sky))] transition-colors shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            Reconectar
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 mb-4">
        {messages.map((m, i) => (
          <div
            key={`${m.timestamp}-${i}`}
            className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-[rgb(var(--color-depth))] text-white'
                : 'mr-auto border border-[rgb(var(--color-cloud))] bg-[rgb(var(--color-white))] text-[rgb(var(--color-charcoal))]'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto border border-[rgb(var(--color-cloud))] bg-[rgb(var(--color-white))] rounded-2xl px-4 sm:px-5 py-3 text-sm text-[rgb(var(--color-stone))] animate-pulse">
            Ame está pensando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Formulario */}
      <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // Señal de presencia: evita que el agente cierre por inactividad mientras tecleás
            conversationRef.current?.sendUserActivity();
          }}
          placeholder={connected ? 'Escribile a Ame...' : reconnecting ? 'Reconectando...' : 'Sin conexión'}
          disabled={!connected}
          className="flex-1 min-h-[48px] bg-[rgb(var(--color-white))] border border-[rgb(var(--color-cloud))] rounded-full px-4 sm:px-5 py-3 text-sm text-[rgb(var(--color-charcoal))] placeholder:text-[rgb(var(--color-stone))] focus:outline-none focus:border-[rgb(var(--color-depth))] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="px-5 sm:px-6 py-3 min-h-[48px] bg-[rgb(var(--color-depth))] text-white rounded-full text-sm font-light disabled:opacity-40 hover:bg-[rgb(var(--color-twilight))] active:bg-[rgb(var(--color-dusk))] transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
}
