'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Conversation } from '@elevenlabs/client';

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
  const [conversation, setConversation] = useState<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let conv: Awaited<ReturnType<typeof Conversation.startSession>> | null = null;

    async function connect() {
      try {
        console.log('[TextChat] Fetching signed URL...');
        
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to get signed URL');
        }

        console.log('[TextChat] Starting conversation...');
        
        conv = await Conversation.startSession({
          signedUrl: data.signedUrl,
          onConnect: ({ conversationId }) => {
            console.log('[TextChat] Connected:', conversationId);
            setConnected(true);
            setError(null);
          },
          onDisconnect: () => {
            console.log('[TextChat] Disconnected');
            setConnected(false);
          },
          onMessage: (message) => {
            console.log('[TextChat] Message received:', message);
            
            // Handle agent messages
            if (message.source === 'ai' && message.message) {
              setMessages((prev) => [...prev, { 
                role: 'agent', 
                text: message.message,
                timestamp: Date.now(),
              }]);
              setLoading(false);
            }
          },
          onError: (err) => {
            console.error('[TextChat] Error:', err);
            setError(typeof err === 'string' ? err : 'Error de conexión con Ame');
            setConnected(false);
          },
        });

        setConversation(conv);
      } catch (err: any) {
        console.error('[TextChat] Failed to connect:', err);
        setError(err.message || 'Error iniciando chat');
        setConnected(false);
      }
    }

    connect();

    return () => {
      if (conv) {
        conv.endSession().catch(console.error);
      }
    };
  }, []);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !conversation || !connected) {
      console.log('[TextChat] Cannot send: input empty or not connected');
      return;
    }

    const text = input.trim();
    console.log('[TextChat] Sending message:', text);
    
    setMessages((prev) => [...prev, { 
      role: 'user', 
      text,
      timestamp: Date.now(),
    }]);
    setInput('');
    setLoading(true);

    try {
      // Send text message to agent
      // Note: The SDK will handle the message through the WebSocket connection
      // We just need to trigger the conversation with the text
      // The actual API might vary - check ElevenLabs docs for text-only mode
      console.warn('[TextChat] Text-only mode may require different API - check ElevenLabs docs');
    } catch (err: any) {
      console.error('[TextChat] Error sending message:', err);
      setError('Error enviando mensaje');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[60vh] relative">
      {/* Connection status */}
      <div className="mb-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-muted">
            {connected ? 'Conectado' : error ? 'Error' : 'Conectando...'}
          </span>
        </div>
        {error && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((m, i) => (
          <div
            key={`${m.timestamp}-${i}`}
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
            Ame está pensando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Note about text-only mode */}
      <div className="mb-2 text-xs text-muted text-center">
        Nota: El chat de texto requiere configuración adicional en ElevenLabs. Por ahora, usa el widget de voz.
      </div>

      {/* Input form */}
      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Chat de texto en desarrollo..."
          disabled={true}
          className="flex-1 bg-background/80 border border-gold/30 rounded-full px-5 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={true}
          className="px-6 py-3 bg-gold text-background rounded-full font-medium disabled:opacity-50 hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar
        </button>
      </form>
    </div>
  );
}
