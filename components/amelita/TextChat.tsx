'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Conversation, type TextConversation } from '@elevenlabs/client';

interface Message {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export function TextChat({ userEmail }: { userEmail: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: 'Hola, hermanito querido. Estoy acá. Escribime lo que quieras que miremos juntos.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<TextConversation | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      try {
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'No se pudo obtener la URL firmada');
        if (cancelled) return;

        // textOnly: true → TextConversation: SIN micrófono, SIN audio.
        // Garantiza separación total del canal de voz.
        const conv = await Conversation.startSession({
          signedUrl: data.signedUrl,
          connectionType: 'websocket',
          textOnly: true,
          onConnect: () => {
            console.log('[TextChat] Connected (text-only)');
            setConnected(true);
            setError(null);
          },
          onDisconnect: () => {
            console.log('[TextChat] Disconnected');
            setConnected(false);
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
            setError(typeof err === 'string' ? err : 'Error de conexión con Ame');
            setConnected(false);
          },
        });

        if (cancelled) {
          conv.endSession().catch(() => {});
          return;
        }
        conversationRef.current = conv;
      } catch (err: any) {
        console.error('[TextChat] Failed to connect:', err);
        if (!cancelled) {
          setError(err.message || 'Error iniciando el chat');
          setConnected(false);
        }
      }
    }

    connect();

    return () => {
      cancelled = true;
      conversationRef.current?.endSession().catch(() => {});
      conversationRef.current = null;
    };
  }, []);

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
      <div className="mb-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-400'} ${connected ? '' : 'animate-pulse'}`} />
          <span className="text-[rgb(var(--color-stone))] font-light">
            {connected ? 'Conectado' : error ? 'Error' : 'Conectando...'}
          </span>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <span className="max-w-[200px] truncate">{error}</span>
          </div>
        )}
      </div>

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
            conversationRef.current?.sendUserActivity();
          }}
          placeholder={connected ? 'Escribile a Ame...' : 'Conectando...'}
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
