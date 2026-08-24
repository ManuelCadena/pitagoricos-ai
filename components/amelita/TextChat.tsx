'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

export function TextChat({ userEmail }: { userEmail: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: 'Hola, hermanito querido. Estoy acá. Escribime lo que quieras que miremos juntos.' },
  ]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket;

    async function connect() {
      try {
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'No se pudo obtener la URL de conversación');

        const url = `wss://api.elevenlabs.io/v1/convai/conversation?signed_url=${encodeURIComponent(data.signedUrl)}`;
        ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'agent_response' && msg.agent_response_event?.agent_response) {
              setMessages((prev) => [...prev, { role: 'agent', text: msg.agent_response_event.agent_response }]);
              setLoading(false);
            } else if (msg.type === 'agent_chat_response_part') {
              const part = msg.text_response_part?.text || '';
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'agent') {
                  return [...prev.slice(0, -1), { ...last, text: last.text + part }];
                }
                return [...prev, { role: 'agent', text: part }];
              });
              if (msg.text_response_part?.type === 'stop') {
                setLoading(false);
              }
            }
          } catch {
            // ignore malformed
          }
        };

        ws.onerror = () => {
          setError('Error de conexión con Amelita. Intentá de nuevo.');
          setConnected(false);
        };

        ws.onclose = () => {
          setConnected(false);
        };
      } catch (err: any) {
        setError(err.message || 'Error iniciando chat');
      }
    }

    connect();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || !connected) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    wsRef.current.send(JSON.stringify({ type: 'user_message', text }));
  }

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-gold text-background'
                : 'mr-auto border border-gold/20 bg-background/80 text-foreground'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto border border-gold/20 bg-background/80 rounded-2xl px-5 py-3 text-gold animate-pulse">
            Amelita está pensando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mb-3 text-red-400 text-sm text-center">{error}</div>
      )}

      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? 'Escribile a Amelita...' : 'Conectando...'}
          disabled={!connected}
          className="flex-1 bg-background/80 border border-gold/30 rounded-full px-5 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="px-6 py-3 bg-gold text-background rounded-full font-medium disabled:opacity-50 hover:bg-gold-light transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
