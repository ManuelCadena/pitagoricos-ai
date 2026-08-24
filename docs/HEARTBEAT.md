# Pitagóricos.ai — Heartbeat

## Estado actual
- **Versión desplegada**: `pitagoricos-ai-20260824-004254.tar.gz`
- **Git SHA**: `6e94bf6`
- **Servidor**: EC2 Chatita (`i-0994d0887cc3c3476`)
- **Proceso PM2**: `pitagoricos-ai` online en puerto `3200` (PID 58585, 119.9 MB RAM)
- **Nginx**: proxy_pass a `http://127.0.0.1:3200`, SSL activo
- **DNS**: ✅ Propagado correctamente a `54.212.177.221` en todos los resolvers públicos
- **Health check**: 
  - HTTP → HTTPS: `301 Moved Permanently` ✅
  - HTTPS `/` → `/es` o `/en` según idioma: `307 Temporary Redirect` ✅
  - PM2: online ✅
- **E2E Playwright**: ✅ TODOS LOS TESTS PASARON (ver `docs/E2E_TEST_REPORT.md`)

## Últimos cambios (2026-08-24)
- Robustecido el system prompt de Amelita en ElevenLabs con la Persona Canónica completa.
- Corregido uso de vocativos: neutros por defecto, sin asumir género del interlocutor.
- Implementada app Next.js 16 con Google OAuth, lista blanca, i18n es/en.
- Corregidas redirecciones del middleware para respetar el locale.
- Corregidas traducciones en server pages pasando locale explícito.
- **FIX CRÍTICO**: Auth callback ahora crea usuarios automáticamente si están en `ALLOWED_EMAILS`.
- **FIX CRÍTICO**: Middleware ahora redirige `/` → `/es` o `/en` según `Accept-Language` header.
- Creada homepage con escena 3D de Tetractys (canvas verificado funcionando).
- Creada sala `/aula` con widget de voz y chat de texto ElevenLabs.
- Configurado deploy automatizado S3 + SSM + PM2.
- Configurado nginx proxy reverso con SSL.
- **DEPLOY VERIFICADO**: E2E tests completos ejecutados y documentados.
- **DNS VERIFICADO**: Propagado correctamente en Google DNS, Cloudflare, OpenDNS, Route53.

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
# Health check HTTP → HTTPS
curl -sI http://pitagoricos.ai/ | head -5

# Health check HTTPS root → locale
curl -sI https://pitagoricos.ai/ | head -5

# PM2 status
aws ssm send-command --instance-ids i-0994d0887cc3c3476 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["pm2 status pitagoricos-ai"]' \
  --region us-west-2

# DNS check
dig pitagoricos.ai +short
```

## Evidencia de deploy
- Build: ✅ Exit code 0
- Upload S3: ✅ `s3://chatita-deployments-temp/pitagoricos-ai/pitagoricos-ai-20260824-004254.tar.gz`
- SSM deploy: ✅ CommandId `a625c241-08e9-4d6f-b7b1-621d1b92fba3` Success
- PM2 reload: ✅ Process online, PID 58585, 119.9 MB RAM
- Git push: ✅ SHA `6e94bf6`
- E2E tests: ✅ 10/10 pasaron (ver `docs/E2E_TEST_REPORT.md`)
- DNS propagation: ✅ Verificado en 6 resolvers públicos
- HTTP redirect: ✅ 301 → HTTPS
- Root redirect: ✅ 307 → `/es` o `/en` según idioma
- 3D canvas: ✅ Verificado en homepage
