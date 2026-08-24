# Pitagóricos.ai — Heartbeat

## Estado actual
- **Versión desplegada**: `pitagoricos-ai-20260824-001659.tar.gz`
- **Servidor**: EC2 Chatita (`i-0994d0887cc3c3476`)
- **Proceso PM2**: `pitagoricos-ai` online en puerto `3200`
- **Health check**: HTTP 307 → `/login` (middleware activo)

## Últimos cambios
- Robustecido el system prompt de Amelita en ElevenLabs con la Persona Canónica completa.
- Implementada app Next.js 16 con Google OAuth, lista blanca, i18n es/en.
- Creada homepage con escena 3D de Tetractys.
- Creada sala `/aula` con widget de voz y chat de texto ElevenLabs.
- Configurado deploy automatizado S3 + SSM + PM2.

## Próximos pasos
1. Generar assets visuales de alta resolución (hero, retrato Amelita/Pythagoras) cuando las herramientas de IA estén disponibles.
2. Probar flujo completo de login con Google OAuth y widget de voz en producción.
3. Iterar chat de texto con WebSocket si es necesario.
4. Migrar middleware a `proxy.ts` cuando Next.js 16 lo requiera formalmente.
5. Rotar secretos expuestos accidentalmente en logs (ver `RECEIPT.md`).

## Verificación rápida
```bash
# Health interno
aws ssm send-command --instance-ids i-0994d0887cc3c3476 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["curl -sI http://127.0.0.1:3200/es | head -5","pm2 status pitagoricos-ai"]'
```
