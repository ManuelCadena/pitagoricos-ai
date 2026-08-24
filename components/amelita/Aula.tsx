'use client';

import { useEffect, useState } from 'react';
import { VoiceWidget } from './VoiceWidget';
import { TextChat } from './TextChat';

export function Aula({ locale, userEmail }: { locale: string; userEmail: string }) {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

  return (
    <div className="w-full rounded-3xl border border-gold/20 bg-background/60 backdrop-blur-md p-6 md:p-10 shadow-2xl">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-6 py-2 rounded-full border transition-all ${
            activeTab === 'voice'
              ? 'bg-gold text-background border-gold'
              : 'border-gold/30 text-gold hover:bg-gold/10'
          }`}
        >
          {activeTab === 'voice' ? 'Voz' : 'Voice'}
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`px-6 py-2 rounded-full border transition-all ${
            activeTab === 'text'
              ? 'bg-gold text-background border-gold'
              : 'border-gold/30 text-gold hover:bg-gold/10'
          }`}
        >
          {activeTab === 'text' ? 'Chat' : 'Chat'}
        </button>
      </div>

      {activeTab === 'voice' ? (
        <VoiceWidget userEmail={userEmail} />
      ) : (
        <TextChat userEmail={userEmail} />
      )}
    </div>
  );
}
