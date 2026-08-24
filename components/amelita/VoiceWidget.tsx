'use client';

import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export function VoiceWidget({ userEmail }: { userEmail: string }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    async function loadSignedUrl() {
      try {
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load signed URL');
        }
        
        console.log('[VoiceWidget] Signed URL loaded successfully');
        setSignedUrl(data.signedUrl);
      } catch (err: any) {
        console.error('[VoiceWidget] Error loading signed URL:', err);
        setError(err.message || 'Error loading voice widget');
      } finally {
        setLoading(false);
      }
    }
    
    loadSignedUrl();
  }, []);

  const startConversation = async () => {
    if (!signedUrl) {
      setError('No hay URL de conversación disponible');
      return;
    }

    try {
      setIsActive(true);
      
      // Load ElevenLabs SDK if not already loaded
      if (!window.ElevenLabs) {
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Start conversation
      if (!window.ElevenLabs?.Conversation) {
        throw new Error('ElevenLabs SDK no se cargó correctamente');
      }

      await window.ElevenLabs.Conversation.startSession({
        signedUrl,
        onConnect: () => {
          console.log('[VoiceWidget] Connected to Amelita');
        },
        onDisconnect: () => {
          console.log('[VoiceWidget] Disconnected from Amelita');
          setIsActive(false);
        },
        onError: (error: any) => {
          console.error('[VoiceWidget] Error:', error);
          setError('Error en la conversación con Amelita');
          setIsActive(false);
        },
      });
    } catch (err: any) {
      console.error('[VoiceWidget] Failed to start conversation:', err);
      setError(err.message || 'No se pudo iniciar la conversación');
      setIsActive(false);
    }
  };

  const stopConversation = () => {
    if (window.ElevenLabs?.Conversation) {
      window.ElevenLabs.Conversation.endSession();
    }
    setIsActive(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gold animate-pulse">
        Invocando a Amelita...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-400 border border-red-400/20 rounded-2xl p-6 gap-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-red-400 rounded-full hover:bg-red-400/10 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-lg space-y-4">
        <p className="text-muted">
          Presioná el botón del micrófono para hablar con Amelita. La conversación es privada y se guarda para tu seguimiento personal.
        </p>
        {isActive && (
          <p className="text-gold text-sm animate-pulse">
            🎙️ Amelita está escuchando...
          </p>
        )}
      </div>

      <button
        onClick={isActive ? stopConversation : startConversation}
        disabled={!signedUrl}
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-2xl
          ${isActive 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-gold hover:bg-gold-light'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isActive ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-background" />
        )}
      </button>

      <p className="text-sm text-muted">
        {isActive ? 'Presioná para terminar la conversación' : 'Presioná para hablar con Amelita'}
      </p>
    </div>
  );
}

// Type declarations for ElevenLabs SDK
declare global {
  interface Window {
    ElevenLabs?: {
      Conversation: {
        startSession: (config: any) => Promise<void>;
        endSession: () => void;
      };
    };
  }
}
