const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

export async function getSignedUrl(userId: string) {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
    throw new Error('ElevenLabs credentials not configured');
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}&user_id=${encodeURIComponent(userId)}`,
    {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs signed URL error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.signed_url as string;
}

export async function getConversationToken(userId: string) {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
    throw new Error('ElevenLabs credentials not configured');
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_AGENT_ID}&user_id=${encodeURIComponent(userId)}`,
    {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs conversation token error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.token as string;
}

export interface ELConversationDetails {
  status: string;
  transcript: { role: string; message: string | null; time_in_call_secs?: number }[];
  summary: string | null;
  callDurationSecs: number | null;
}

export async function getConversationDetails(conversationId: string): Promise<ELConversationDetails> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs credentials not configured');
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: 'GET',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs conversation details error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    status: data.status as string,
    transcript: (data.transcript ?? []) as ELConversationDetails['transcript'],
    summary: (data.analysis?.transcript_summary ?? null) as string | null,
    callDurationSecs: (data.metadata?.call_duration_secs ?? null) as number | null,
  };
}
