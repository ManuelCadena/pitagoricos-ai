/**
 * T3 — Prueba de lógica de memoria (perfil acumulado + contexto)
 * Ejecutar: DATABASE_URL="file:./prisma/pitagoricos.db" npx tsx scripts/test-memory.mts
 */
import { prisma } from '../lib/prisma';
import { rebuildProfile, buildContextText } from '../lib/memory';

const TEST_EMAIL = 'test-memoria@pitagoricos.test';

async function main() {
  let passed = 0;
  let failed = 0;
  const assert = (cond: boolean, name: string) => {
    if (cond) { console.log(`  ✅ ${name}`); passed++; }
    else { console.log(`  ❌ ${name}`); failed++; }
  };

  // Setup: usuario de prueba + 3 conversaciones synced
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  const user = await prisma.user.create({
    data: { email: TEST_EMAIL, name: 'Alumno Prueba', isAllowed: true },
  });

  const summaries = [
    'El alumno preguntó por la Tetractys y el significado del número 10. Ejercicio: observar en silencio 5 minutos cada mañana.',
    'Se trabajó el perdón y el vaso del corazón. El alumno mencionó un conflicto con su hermano. Ejercicio: escribir una carta de perdón sin enviarla.',
    'Sesión sobre la Ley del UNO. El alumno reportó avances con el silencio matutino. Ejercicio: practicar la palabra medicina toda la semana.',
  ];

  for (let i = 0; i < summaries.length; i++) {
    await prisma.conversation.create({
      data: {
        userId: user.id,
        agentId: 'agent_test',
        type: i % 2 === 0 ? 'text' : 'voice',
        messages: JSON.stringify([
          { role: 'user', content: `Pregunta de la sesión ${i + 1}`, timestamp: Date.now() },
          { role: 'agent', content: `Respuesta de Ame en la sesión ${i + 1}`, timestamp: Date.now() },
        ]),
        summary: summaries[i],
        title: `Sesión ${i + 1}`,
        elConversationId: `test_conv_${i + 1}`,
        status: 'synced',
        createdAt: new Date(Date.now() - (summaries.length - i) * 86400000),
      },
    });
  }

  console.log('\n== T3.1: rebuildProfile ==');
  const profile = await rebuildProfile(user.id);
  assert(profile.includes('Alumno Prueba'), 'perfil incluye nombre del alumno');
  assert(profile.includes('Sesiones completadas: 3'), 'perfil cuenta 3 sesiones');
  assert(profile.includes('Tetractys'), 'perfil incluye resumen de sesión 1');
  assert(profile.includes('palabra medicina'), 'perfil incluye resumen de sesión 3 (más reciente)');
  assert(profile.length <= 4000, `perfil respeta cap 4000 chars (actual: ${profile.length})`);

  console.log('\n== T3.2: buildContextText (memoria automática) ==');
  const ctx = await buildContextText(user.id);
  assert(ctx !== null, 'contexto no es null con historial');
  assert(ctx!.includes('MEMORIA DE SESIONES ANTERIORES'), 'contexto tiene encabezado de memoria');
  assert(ctx!.includes('ejercicio práctico que quedó pendiente'), 'contexto pide retomar ejercicio pendiente');

  console.log('\n== T3.3: buildContextText (retomar sesión específica) ==');
  const conv2 = await prisma.conversation.findFirst({ where: { userId: user.id, title: 'Sesión 2' } });
  const ctxResume = await buildContextText(user.id, conv2!.id);
  assert(ctxResume!.includes('RETOMA EXPLÍCITAMENTE'), 'contexto de retoma presente');
  assert(ctxResume!.includes('vaso del corazón'), 'incluye resumen de la sesión retomada');
  assert(ctxResume!.includes('Últimos intercambios'), 'incluye tail de mensajes');

  console.log('\n== T3.4: usuario sin historial ==');
  const newUser = await prisma.user.create({
    data: { email: 'test-nuevo@pitagoricos.test', isAllowed: true },
  });
  const ctxEmpty = await buildContextText(newUser.id);
  assert(ctxEmpty === null, 'primera sesión → contexto null (no inyectar nada)');

  // Cleanup
  await prisma.user.deleteMany({ where: { email: { in: [TEST_EMAIL, 'test-nuevo@pitagoricos.test'] } } });

  console.log(`\nRESULTADO: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
