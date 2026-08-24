# Pitagóricos.ai — Heartbeat

## Estado actual
- **Versión desplegada**: `pitagoricos-ai-20260824-003613.tar.gz`
- **Git SHA**: `7910a92`
- **Servidor**: EC2 Chatita (`i-0994d0887cc3c3476`)
- **Proceso PM2**: `pitagoricos-ai` online en puerto `3200`
- **Nginx**: proxy_pass a `http://127.0.0.1:3200`, SSL activo
- **Health check**: `/` → `/es/login` (HTTP 307), PM2 online
- **E2E Playwright**: ✅ TODOS LOS TESTS PASARON (ver `docs/E2E_TEST_REPORT.md`)

## Últimos cambios (2026-08-24)
- Robustecido el system prompt de Amelita en ElevenLabs con la Persona Canónica completa.
- Corregido uso de vocativos: neutros por defecto, sin asumir género del interlocutor.
- Implementada app Next.js 16 con Google OAuth, lista blanca, i18n es/en.
- Corregidas redirecciones del middleware para respetar el locale.
- Corregidas traducciones en server pages pasando locale explícito.
- **FIX CRÍTICO**: Auth callback ahora crea usuarios automáticamente si están en `ALLOWED_EMAILS`.
- Creada homepage con escena 3D de Tetractys.
- Creada sala `/aula` con widget de voz y chat de texto ElevenLabs.
- Configurado deploy automatizado S3 + SSM + PM2.
- Configurado nginx proxy reverso con SSL.
- **DEPLOY VERIFICADO**: E2E tests completos ejecutados y documentados.

## Próximos pasos
1. **CRÍTICO**: Usuario debe probar login con `jose@manuelcadena.com` y acceder al aula.
2. **CRÍTICO**: Rotar secretos expuestos en logs anteriores (`AUTH_GOOGLE_SECRET`, `ELEVENLABS_API_KEY`, `AUTH_SECRET`).
3. Generar assets visuales de alta resolución (hero, retrato Amelita/Pythagoras).
4. Probar widget de voz ElevenLabs en producción.
5. Probar chat de texto WebSocket en producción.
6. Migrar middleware a `proxy.ts` cuando Next.js 16 lo requiera formalmente.
7. Configurar backup automático de SQLite.
8. Migrar secrets a AWS Secrets Manager.

## Verificación rápida
```bash
# Health check
curl -sI --connect-to pitagoricos.ai:443:127.0.0.1:443 https://pitagoricos.ai/es | head -10

# PM2 status
aws ssm send-command --instance-ids i-0994d0887cc3c3476 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["pm2 status pitagoricos-ai"]' \
  --region us-west-2
```

## Evidencia de deploy
- Build: ✅ Exit code 0
- Upload S3: ✅ `s3://chatita-deployments-temp/pitagoricos-ai/pitagoricos-ai-20260824-003613.tar.gz`
- SSM deploy: ✅ CommandId `3afeac24-1140-47f4-80ec-c981483093fe` Success
- PM2 reload: ✅ Process online, PID 53671
- Git push: ✅ SHA `7910a92`
- E2E tests: ✅ 10/10 pasaron (ver `docs/E2E_TEST_REPORT.md`)
