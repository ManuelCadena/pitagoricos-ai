import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { buildContextText } from '@/lib/memory';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/memory[?resumeId=] — texto de contexto para sendContextualUpdate
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(session.user as any).isAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const resumeId = req.nextUrl.searchParams.get('resumeId') ?? undefined;

  try {
    const context = await buildContextText(user.id, resumeId);
    return NextResponse.json({ context });
  } catch (error: any) {
    console.error('Error building memory context:', error);
    return NextResponse.json({ context: null });
  }
}
