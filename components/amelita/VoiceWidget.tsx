'use client';

import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Conversation } from '@elevenlabs/client';

export function VoiceWidget({ userEmail }: { userEmail: string }) {
  const [conversation, setConversation] = useState<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get signed URL from API
    async function fetchSignedUrl() {
      try {
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to get signed URL');
        }
        
        setSignedUrl(data.signedUrl);
      } catch (err: any) {
        console.error('[VoiceWidget] Error loading signed URL:', err);
        setError(err.message || 'Error cargando configuración');
      }
    }
    
    fetchSignedUrl();
  }, []);

  const startConversation = async () => {
    if (!signedUrl) {
      setError('No hay URL de conversación disponible');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start conversation with ElevenLabs
      const conv = await Conversation.startSession({
        signedUrl,
        onConnect: () => {
          console.log('[VoiceWidget] Connected to Ame');
          setIsActive(true);
          setLoading(false);
        },
        onDisconnect: () => {
          console.log('[VoiceWidget] Disconnected from Ame');
          setIsActive(false);
          setConversation(null);
        },
        onError: (error) => {
          console.error('[VoiceWidget] Error:', error);
          setError(typeof error === 'string' ? error : 'Error en la conversación con Ame');
          setIsActive(false);
          setLoading(false);
        },
        onModeChange: (mode) => {
          console.log('[VoiceWidget] Mode changed:', mode);
        },
      });

      setConversation(conv);
    } catch (err: any) {
      console.error('[VoiceWidget] Failed to start conversation:', err);
      setError(err.message || 'No se pudo iniciar la conversación');
      setIsActive(false);
      setLoading(false);
    }
  };

  const stopConversation = async () => {
    if (conversation) {
      try {
        await conversation.endSession();
        setConversation(null);
        setIsActive(false);
      } catch (err) {
        console.error('[VoiceWidget] Error ending conversation:', err);
      }
    }
  };

  if (!signedUrl && !error) {
    return (
      <div className="flex items-center justify-center h-64 text-gold animate-pulse">
        Invocando a Ame...
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
          Presioná el botón del micrófono para hablar con Ame. La conversación es privada y se guarda para tu seguimiento personal.
        </p>
        {isActive && (
          <p className="text-gold text-sm animate-pulse">
            🎙️ Ame está escuchando...
          </p>
        )}
        {loading && (
          <p className="text-gold text-sm">
            Conectando con Ame...
          </p>
        )}
      </div>

      <button
        onClick={isActive ? stopConversation : startConversation}
        disabled={loading || !signedUrl}
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
        {loading ? (
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : isActive ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-background" />
        )}
      </button>

      <p className="text-sm text-muted">
        {loading 
          ? 'Conectando...' 
          : isActive 
            ? 'Presioná para terminar la conversación' 
            : 'Presioná para hablar con Ame'}
      </p>
    </div>
  );
}
