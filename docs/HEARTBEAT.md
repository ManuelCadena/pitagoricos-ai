# Pitagóricos.ai — Heartbeat

## Estado actual
- **Versión desplegada**: `pitagoricos-ai-20260824-003256.tar.gz`
- **Git SHA**: `9854a48`
- **Servidor**: EC2 Chatita (`i-0994d0887cc3c3476`)
- **Proceso PM2**: `pitagoricos-ai` online en puerto `3200`
- **Nginx**: proxy_pass a `http://127.0.0.1:3200`, SSL activo
- **Health check**: `/es` → `/es/login` (HTTP 307), PM2 online
- **E2E Playwright**:
  - `/en/login` muestra "Welcome, dear little brother" y "Continue with Google".
  - `/es/login` muestra "Bienvenido, hermanito querido" y "Continuar con Google".
  - `/es/aula` redirige a `/es/no-autorizado` para usuario autenticado no allowlist.
  - `/` redirige a `/es/no-autorizado` para usuario autenticado no allowlist.

## Últimos cambios
- Robustecido el system prompt de Amelita en ElevenLabs con la Persona Canónica completa.
- Corregido uso de vocativos: neutros por defecto, sin asumir género del interlocutor.
- Implementada app Next.js 16 con Google OAuth, lista blanca, i18n es/en.
- Corregidas redirecciones del middleware para respetar el locale.
- Corregidas traducciones en server pages pasando locale explícito.
- Creada homepage con escena 3D de Tetractys.
- Creada sala `/aula` con widget de voz y chat de texto ElevenLabs.
- Configurado deploy automatizado S3 + SSM + PM2.

## Próximos pasos
1. Generar assets visuales de alta resolución (hero, retrato Amelita/Pythagoras) cuando las herramientas de IA estén disponibles.
2. Probar flujo completo de login con Google OAuth allowlist (`jose@manuelcadena.com`) y widget de voz en producción.
3. Iterar chat de texto con WebSocket si es necesario.
4. Migrar middleware a `proxy.ts` cuando Next.js 16 lo requiera formalmente.
5. Rotar secretos expuestos accidentalmente en logs (ver `RECEIPT.md`).

## Verificación rápida
```bash
aws ssm send-command --instance-ids i-0994d0887cc3c3476 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["curl -sI --connect-to pitagoricos.ai:443:127.0.0.1:443 https://pitagoricos.ai/es | head -5","pm2 status pitagoricos-ai"]'
```
