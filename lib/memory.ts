import { prisma } from '@/lib/prisma';
import { getConversationDetails } from '@/lib/elevenlabs';

const PROFILE_MAX_CHARS = 4000;
const RECENT_SESSIONS_DETAILED = 5;
const SYNC_RETRY_DELAYS_MS = [2000, 5000, 10000];

interface StoredMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Sincroniza una conversación de ElevenLabs a la DB local.
 * Idempotente: si ya está synced, no hace nada.
 * El transcript de EL tarda unos segundos en estar listo tras colgar → retry.
 */
export async function syncConversation(elConversationId: string): Promise<{ synced: boolean; reason?: string }> {
  const record = await prisma.conversation.findUnique({ where: { elConversationId } });
  if (!record) return { synced: false, reason: 'not_found' };
  if (record.status === 'synced') return { synced: true };

  let lastError: string | undefined;
  for (let attempt = 0; attempt <= SYNC_RETRY_DELAYS_MS.length; attempt++) {
    try {
      const details = await getConversationDetails(elConversationId);

      // El transcript puede no estar procesado aún
      if (details.status === 'processing' || (details.transcript.length === 0 && !details.summary)) {
        lastError = `status=${details.status}, transcript vacío`;
        if (attempt < SYNC_RETRY_DELAYS_MS.length) {
          await sleep(SYNC_RETRY_DELAYS_MS[attempt]);
          continue;
        }
        break;
      }

      const messages: StoredMessage[] = details.transcript
        .filter((t) => t.message)
        .map((t) => ({
          role: t.role === 'user' ? 'user' : 'agent',
          content: t.message as string,
          timestamp: record.createdAt.getTime() + (t.time_in_call_secs ?? 0) * 1000,
        }));

      const summary = details.summary ?? deriveSummaryFromMessages(messages);
      const title = deriveTitle(summary, messages);

      await prisma.conversation.update({
        where: { elConversationId },
        data: {
          messages: JSON.stringify(messages),
          summary,
          title,
          status: 'synced',
        },
      });

      await rebuildProfile(record.userId);
      return { synced: true };
    } catch (err: any) {
      lastError = err.message;
      if (attempt < SYNC_RETRY_DELAYS_MS.length) {
        await sleep(SYNC_RETRY_DELAYS_MS[attempt]);
      }
    }
  }

  await prisma.conversation.update({
    where: { elConversationId },
    data: { status: 'sync_failed' },
  });
  return { synced: false, reason: lastError };
}

function deriveSummaryFromMessages(messages: StoredMessage[]): string {
  if (messages.length === 0) return 'Sesión sin contenido registrado.';
  const userMsgs = messages.filter((m) => m.role === 'user').slice(0, 3);
  const topics = userMsgs.map((m) => m.content.slice(0, 100)).join(' · ');
  return `Temas tratados: ${topics}`.slice(0, 500);
}

function deriveTitle(summary: string | null, messages: StoredMessage[]): string {
  const source = messages.find((m) => m.role === 'user')?.content ?? summary ?? 'Sesión';
  return source.slice(0, 60);
}

/**
 * Reconstruye el perfil acumulado del alumno desde TODAS las sesiones synced.
 * Determinista, sin LLM: sesiones recientes detalladas, antiguas comprimidas.
 * Cap total: PROFILE_MAX_CHARS.
 */
export async function rebuildProfile(userId: string): Promise<string> {
  const [user, conversations] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.conversation.findMany({
      where: { userId, status: 'synced' },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) throw new Error('User not found');

  const lines: string[] = [];
  lines.push(`Alumno: ${user.name ?? user.email}`);
  lines.push(`Sesiones completadas: ${conversations.length}`);
  if (conversations.length > 0) {
    const first = conversations[conversations.length - 1];
    lines.push(`Primera sesión: ${first.createdAt.toISOString().slice(0, 10)}`);
    lines.push('');
    lines.push('HISTORIAL DE SESIONES (más reciente primero):');

    conversations.forEach((c, i) => {
      const date = c.createdAt.toISOString().slice(0, 10);
      const kind = c.type === 'voice' ? 'voz' : 'texto';
      if (i < RECENT_SESSIONS_DETAILED) {
        lines.push(`- [${date}, ${kind}] ${c.summary ?? c.title ?? 'Sin resumen'}`);
      } else {
        lines.push(`- [${date}] ${(c.title ?? c.summary ?? 'Sesión').slice(0, 80)}`);
      }
    });
  }

  let profileText = lines.join('\n');
  if (profileText.length > PROFILE_MAX_CHARS) {
    profileText = profileText.slice(0, PROFILE_MAX_CHARS - 20) + '\n[historial truncado]';
  }

  await prisma.studentProfile.upsert({
    where: { userId },
    create: { userId, profileText, sessionCount: conversations.length },
    update: { profileText, sessionCount: conversations.length },
  });

  return profileText;
}

/**
 * Construye el texto de contexto para sendContextualUpdate al iniciar sesión.
 * Retorna null si no hay historial (primera sesión → no inyectar nada).
 */
export async function buildContextText(userId: string, resumeConversationId?: string): Promise<string | null> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile || profile.sessionCount === 0) return null;

  const parts: string[] = [];
  parts.push(
    'MEMORIA DE SESIONES ANTERIORES (contexto interno; usalo con naturalidad como recuerdos propios, sin mencionar que es un sistema de memoria):'
  );
  parts.push(profile.profileText);

  if (resumeConversationId) {
    const resumed = await prisma.conversation.findFirst({
      where: { id: resumeConversationId, userId, status: 'synced' },
    });
    if (resumed) {
      const date = resumed.createdAt.toISOString().slice(0, 10);
      parts.push('');
      parts.push(
        `EL ALUMNO RETOMA EXPLÍCITAMENTE LA SESIÓN DEL ${date}: "${resumed.summary ?? resumed.title}". Retomá esa conversación desde donde quedó, con tu estilo de "retoma y encuadre".`
      );
      // Últimos intercambios de esa sesión para contexto fino
      try {
        const msgs: StoredMessage[] = JSON.parse(resumed.messages || '[]');
        const tail = msgs.slice(-6);
        if (tail.length > 0) {
          parts.push('Últimos intercambios de esa sesión:');
          tail.forEach((m) => parts.push(`${m.role === 'user' ? 'Alumno' : 'Teano'}: ${m.content.slice(0, 200)}`));
        }
      } catch {
        // messages malformado: continuar sin el tail
      }
    }
  } else {
    parts.push('');
    parts.push(
      'Si corresponde, saludá retomando lo último trabajado y preguntá por el ejercicio práctico que quedó pendiente.'
    );
  }

  return parts.join('\n');
}

/**
 * Lazy-sync: sincroniza conversaciones que quedaron 'active' hace más de 2 minutos
 * (el cliente cerró sin avisar). Se llama al listar sesiones.
 */
export async function syncStaleConversations(userId: string): Promise<void> {
  const cutoff = new Date(Date.now() - 2 * 60 * 1000);
  const stale = await prisma.conversation.findMany({
    where: { userId, status: 'active', updatedAt: { lt: cutoff }, elConversationId: { not: null } },
    take: 5,
  });
  for (const c of stale) {
    if (c.elConversationId) {
      await syncConversation(c.elConversationId).catch(() => {});
    }
  }
}
