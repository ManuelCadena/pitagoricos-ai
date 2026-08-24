'use client';

import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Conversation } from '@elevenlabs/client';

export function VoiceWidget({ userEmail }: { userEmail: string }) {
  const [conversation, setConversation] = useState<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const startConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Pedir permiso de micrófono y LIBERARLO de inmediato.
      //    En iOS Safari solo puede existir UNA captura activa:
      //    si no liberamos este stream, el SDK recibe silencio.
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());

      // 2. Obtener conversation token (WebRTC es lo recomendado para voz,
      //    especialmente en móviles iOS/Android)
      const res = await fetch('/api/conversation-token');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo obtener el token de conversación');
      }

      // 3. Iniciar sesión por WebRTC
      const conv = await Conversation.startSession({
        conversationToken: data.token,
        connectionType: 'webrtc',
        onConnect: () => {
          console.log('[VoiceWidget] Connected to Ame (WebRTC)');
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
          console.log('[VoiceWidget] Mode:', mode);
        },
      });

      setConversation(conv);
    } catch (err: any) {
      console.error('[VoiceWidget] Failed to start conversation:', err);
      if (err?.name === 'NotAllowedError') {
        setError('Permiso de micrófono denegado. Habilitalo en la configuración del navegador.');
      } else {
        setError(err.message || 'No se pudo iniciar la conversación');
      }
      setIsActive(false);
      setLoading(false);
    }
  };

  const stopConversation = async () => {
    if (conversation) {
      try {
        await conversation.endSession();
      } catch (err) {
        console.error('[VoiceWidget] Error ending conversation:', err);
      }
      setConversation(null);
      setIsActive(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-56 text-center text-red-500 border border-red-300/40 rounded-2xl p-6 gap-4">
        <p className="text-sm">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-6 py-3 min-h-[44px] border border-red-400 rounded-full text-sm hover:bg-red-400/10 active:bg-red-400/20 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-lg space-y-4">
        <p className="text-sm sm:text-base text-[rgb(var(--color-slate))] font-light">
          Presioná el botón del micrófono para hablar con Ame. La conversación es privada y se guarda para tu seguimiento personal.
        </p>
        {isActive && (
          <p className="text-[rgb(var(--color-depth))] text-sm animate-pulse">
            🎙️ Ame está escuchando...
          </p>
        )}
        {loading && (
          <p className="text-[rgb(var(--color-depth))] text-sm">
            Conectando con Ame...
          </p>
        )}
      </div>

      <button
        onClick={isActive ? stopConversation : startConversation}
        disabled={loading}
        className={`
          relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-2xl
          ${isActive
            ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 animate-pulse'
            : 'bg-[rgb(var(--color-depth))] hover:bg-[rgb(var(--color-twilight))] active:bg-[rgb(var(--color-dusk))]'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : isActive ? (
          <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        ) : (
          <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        )}
      </button>

      <p className="text-xs sm:text-sm text-[rgb(var(--color-stone))] font-light">
        {loading
          ? 'Conectando...'
          : isActive
            ? 'Presioná para terminar la conversación'
            : 'Presioná para hablar con Ame'}
      </p>
    </div>
  );
}
