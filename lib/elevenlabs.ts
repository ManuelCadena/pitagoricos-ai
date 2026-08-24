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
