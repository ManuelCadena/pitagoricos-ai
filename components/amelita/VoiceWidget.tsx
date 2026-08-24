'use client';

import { useEffect, useState, createElement } from 'react';

export function VoiceWidget({ userEmail }: { userEmail: string }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWidget() {
      try {
        const res = await fetch('/api/signed-url');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load signed URL');
        setSignedUrl(data.signedUrl);

        const existing = document.getElementById('elevenlabs-widget-script');
        if (existing) return;

        const script = document.createElement('script');
        script.id = 'elevenlabs-widget-script';
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);
      } catch (err: any) {
        setError(err.message || 'Error loading widget');
      } finally {
        setLoading(false);
      }
    }
    loadWidget();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gold animate-pulse">
        Invocando a Amelita...
      </div>
    );
  }

  if (error || !signedUrl) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 border border-red-400/20 rounded-2xl p-6">
        {error || 'No se pudo cargar el widget de voz. Intentá recargar la página.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted text-center max-w-lg">
        Presioná el botón para hablar con Amelita. La conversación es privada y se guarda para tu seguimiento personal.
      </p>
      {createElement('elevenlabs-convai', {
        'signed-url': signedUrl,
        style: { width: '100%', maxWidth: '480px' },
      })}
    </div>
  );
}
