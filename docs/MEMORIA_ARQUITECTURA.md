# Arquitectura de Memoria y Sesiones — Ame (pitagoricos.ai)

**Fecha**: 2026-08-24 · **Decisiones del usuario**: memoria híbrida · sendContextualUpdate · memoria invisible + lista con Retomar · perfil acumulado

## Flujo

```
1. Widget conecta (voz WebRTC / texto WS textOnly)
2. onConnect({conversationId}) → POST /api/sessions  (registro, status=active)
3. GET /api/memory[?resumeId=] → texto de contexto
   → conversation.sendContextualUpdate(contexto)   [memoria invisible]
4. ...conversación...
5. Fin → POST /api/sessions/end (sendBeacon con fallback fetch keepalive)
   → servidor: GET EL /v1/convai/conversations/{id}  (retry 2s/5s/10s)
   → guarda transcript+summary en Conversation (status=synced)
   → rebuildProfile(userId)  [perfil acumulado determinista, cap 4000 chars]
```

## Modelo de datos (Prisma, migración `20260824084454_memoria_sesiones`)

- `Conversation`: + `elConversationId @unique`, `status` (active|synced|sync_failed), `title`
- `StudentProfile` (nuevo, 1:1 User): `profileText`, `sessionCount`

## Módulos

| Archivo | Responsabilidad |
|---|---|
| `lib/memory.ts` | `syncConversation` (retry+idempotente), `rebuildProfile` (acumulado), `buildContextText` (memoria/retoma), `syncStaleConversations` (lazy-sync) |
| `lib/elevenlabs.ts` | `getConversationDetails` → GET /v1/convai/conversations/{id} |
| `app/api/sessions` | POST registro al conectar · GET lista (dispara lazy-sync) |
| `app/api/sessions/end` | POST sincroniza al cerrar (verifica propiedad) |
| `app/api/memory` | GET contexto para sendContextualUpdate |
| `components/amelita/SessionList.tsx` | Lista con botón Retomar |
| `components/amelita/Aula.tsx` | Estado resumeSession + chip + remount de widgets |

## Retomar sesión

`SessionList` → `Aula.handleResume` → prop `resumeId` → widget pide `/api/memory?resumeId=X` → el contexto antepone: "EL ALUMNO RETOMA EXPLÍCITAMENTE LA SESIÓN DEL [fecha]..." + últimos 6 intercambios de esa sesión. El `key` de React fuerza remount para conexión nueva.

## Fix crítico incluido: persistencia de la DB

`scripts/deploy.sh` hacía `rm -rf ${REMOTE_DIR}/*` con la DB dentro → **cada deploy borraba usuarios y conversaciones**. Ahora:
- `DATABASE_URL=file:/opt/chatita-aion/data/pitagoricos-ai/pitagoricos.db` (fuera del árbol de deploy)
- Copia one-time de la DB vieja al nuevo path si no existe
- `prisma migrate deploy` corre contra la DB persistente

## Pruebas

- T1 build: exit 0 ✅
- T2 endpoints 401 sin auth (verificar en prod)
- T3 `scripts/test-memory.mts`: 12/12 ✅ (perfil, contexto, retoma, primera sesión null)
- T4 sync real EL: transcript+summary recuperados de conversación real ✅
- T5 persistencia post-deploy (contar users antes/después)
- T6/T7 E2E producción: Ame recuerda entre sesiones · Retomar funciona
