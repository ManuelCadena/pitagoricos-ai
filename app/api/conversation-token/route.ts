import { auth } from '@/auth';
import { getConversationToken } from '@/lib/elevenlabs';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(session.user as any).isAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const token = await getConversationToken(session.user.email);
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Error getting conversation token:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
