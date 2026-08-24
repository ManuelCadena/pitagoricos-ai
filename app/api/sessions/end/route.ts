import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { syncConversation } from '@/lib/memory';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/sessions/end — sincroniza transcript+resumen desde ElevenLabs
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(session.user as any).isAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { elConversationId } = body as { elConversationId?: string };
  if (!elConversationId) {
    return NextResponse.json({ error: 'elConversationId requerido' }, { status: 400 });
  }

  // Verificar propiedad
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const record = await prisma.conversation.findUnique({ where: { elConversationId } });
  if (!user || !record || record.userId !== user.id) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
  }

  const result = await syncConversation(elConversationId);
  return NextResponse.json(result);
}
