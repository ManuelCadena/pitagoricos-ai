import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { syncStaleConversations } from '@/lib/memory';
import { NextRequest, NextResponse } from 'next/server';

async function requireAllowedUser() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!(session.user as any).isAllowed) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) };
  }
  return { user };
}

// POST /api/sessions — registra una sesión al conectar el widget
export async function POST(req: NextRequest) {
  const { user, error } = await requireAllowedUser();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const { elConversationId, type } = body as { elConversationId?: string; type?: string };

  if (!elConversationId || !type || !['voice', 'text'].includes(type)) {
    return NextResponse.json({ error: 'elConversationId y type (voice|text) requeridos' }, { status: 400 });
  }

  const conversation = await prisma.conversation.upsert({
    where: { elConversationId },
    create: {
      userId: user.id,
      agentId: process.env.ELEVENLABS_AGENT_ID ?? 'unknown',
      type,
      messages: '[]',
      elConversationId,
      status: 'active',
    },
    update: {},
  });

  return NextResponse.json({ id: conversation.id });
}

// GET /api/sessions — lista sesiones del usuario (dispara lazy-sync de huérfanas)
export async function GET() {
  const { user, error } = await requireAllowedUser();
  if (error) return error;

  await syncStaleConversations(user.id).catch(() => {});

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id, status: { in: ['synced', 'active'] } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, type: true, title: true, summary: true, status: true, createdAt: true },
  });

  return NextResponse.json({
    sessions: conversations.map((c) => ({
      id: c.id,
      type: c.type,
      title: c.title,
      summary: c.summary,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    })),
  });
}
