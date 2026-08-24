'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import { Send, AlertCircle } from 'lucide-react';

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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addDebug = (msg: string) => {
    console.log(`[TextChat] ${msg}`);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isUnmounting = false;

    async function connect() {
      if (isUnmounting) return;
      
      try {
        addDebug('Solicitando signed URL...');
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'No se pudo obtener la URL de conversación');
        }

        addDebug('Signed URL obtenida, conectando WebSocket...');
        
        // ElevenLabs WebSocket endpoint for text chat
        const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || 'agent_9801m0s0px8afx8t8nq9semfwke2'}`;
        
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isUnmounting) return;
          addDebug('WebSocket conectado');
          setConnected(true);
          setError(null);
          
          // Send authentication with signed URL
          ws?.send(JSON.stringify({
            type: 'conversation_initiation_client_data',
            conversation_config_override: {
              agent: {
                prompt: {
                  prompt: 'Sos la Dra. María Amelia Ruiz (Amelita), maestra de filosofía pitagórica. Respondé con calidez maternal argentina usando vos.'
                }
              }
            }
          }));
        };

        ws.onmessage = (event) => {
          if (isUnmounting) return;
          
          try {
            const msg = JSON.parse(event.data);
            addDebug(`Mensaje recibido: ${msg.type}`);
            
            // Handle different message types from ElevenLabs
            if (msg.type === 'agent_response') {
              const text = msg.agent_response || msg.text || '';
              if (text) {
                setMessages((prev) => [...prev, { 
                  role: 'agent', 
                  text,
                  timestamp: Date.now(),
                }]);
                setLoading(false);
              }
            } else if (msg.type === 'audio' || msg.type === 'audio_event') {
              // Ignore audio events in text-only mode
              addDebug('Audio event ignorado (modo texto)');
            } else if (msg.type === 'interruption') {
              addDebug('Conversación interrumpida');
              setLoading(false);
            } else if (msg.type === 'ping') {
              // Respond to ping
              ws?.send(JSON.stringify({ type: 'pong' }));
            }
          } catch (err) {
            addDebug(`Error parseando mensaje: ${err}`);
          }
        };

        ws.onerror = (event) => {
          if (isUnmounting) return;
          addDebug('Error de WebSocket');
          setError('Error de conexión con Amelita');
          setConnected(false);
        };

        ws.onclose = (event) => {
          if (isUnmounting) return;
          addDebug(`WebSocket cerrado (code: ${event.code})`);
          setConnected(false);
          
          // Attempt reconnection after 3 seconds
          if (!isUnmounting) {
            reconnectTimeoutRef.current = setTimeout(() => {
              addDebug('Intentando reconectar...');
              connect();
            }, 3000);
          }
        };
      } catch (err: any) {
        if (isUnmounting) return;
        addDebug(`Error: ${err.message}`);
        setError(err.message || 'Error iniciando chat');
        setConnected(false);
      }
    }

    connect();

    return () => {
      isUnmounting = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || !connected) {
      addDebug('No se puede enviar: input vacío o no conectado');
      return;
    }

    const text = input.trim();
    addDebug(`Enviando mensaje: "${text.substring(0, 30)}..."`);
    
    setMessages((prev) => [...prev, { 
      role: 'user', 
      text,
      timestamp: Date.now(),
    }]);
    setInput('');
    setLoading(true);

    try {
      wsRef.current.send(JSON.stringify({ 
        type: 'user_transcript',
        user_transcript: text,
      }));
    } catch (err: any) {
      addDebug(`Error enviando mensaje: ${err.message}`);
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
            {connected ? 'Conectado' : 'Desconectado'}
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
            Amelita está pensando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
        <details className="mb-2 text-xs text-muted">
          <summary className="cursor-pointer">Debug info</summary>
          <div className="mt-2 space-y-1 font-mono">
            {debugInfo.map((info, i) => (
              <div key={i}>{info}</div>
            ))}
          </div>
        </details>
      )}

      {/* Input form */}
      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? 'Escribile a Amelita...' : 'Conectando...'}
          disabled={!connected}
          className="flex-1 bg-background/80 border border-gold/30 rounded-full px-5 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim() || loading}
          className="px-6 py-3 bg-gold text-background rounded-full font-medium disabled:opacity-50 hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar
        </button>
      </form>
    </div>
  );
}
