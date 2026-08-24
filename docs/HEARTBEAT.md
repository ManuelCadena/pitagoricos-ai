# Pitagóricos.ai — Heartbeat

## Estado actual
- **Versión desplegada**: `pitagoricos-ai-20260824-005033.tar.gz`
- **Git SHA**: `78e3cb1`
- **Servidor**: EC2 Chatita (`i-0994d0887cc3c3476`)
- **Proceso PM2**: `pitagoricos-ai` online en puerto `3200`
- **Nginx**: proxy_pass a `http://127.0.0.1:3200`, SSL activo
- **DNS**: ✅ Propagado correctamente a `54.212.177.221`
- **Conflictos**: ✅ Ninguno (puerto 3200 aislado, nginx config independiente)
- **Health check**: 
  - HTTP → HTTPS: `301 Moved Permanently` ✅
  - HTTPS `/` → `/es` o `/en` según idioma: `307 Temporary Redirect` ✅
  - PM2: online ✅
- **Diseño**: ✅ Rediseñado completamente (ver `docs/VISUAL_DESIGN_REPORT.md`)

## Últimos cambios (2026-08-24)

### Diseño y UX
- ✅ **REDISEÑO COMPLETO DEL HOMEPAGE**:
  - Hero section fullscreen con 3D como fondo (no encimado)
  - Overlay oscuro para mejor contraste y legibilidad
  - Tetractys SVG como icono decorativo
  - Scroll indicator animado
  - Sección de pilares con glassmorphism cards
  - Mejor jerarquía visual y espaciado
  - Animaciones suaves en hover
- ✅ **Mejoras en HeroScene 3D**:
  - Más partículas (32, 48, 64)
  - Mejor iluminación (3 point lights)
  - Rotación más suave y orgánica
  - Material mejorado para Tetractys
- ✅ **Widget de voz rediseñado**:
  - Botón circular fijo (no flotante)
  - Estados visuales claros (dorado/rojo)
  - Iconos Lucide React
  - Manejo de errores mejorado
- ✅ **Chat de texto mejorado**:
  - Indicador de conexión con LED
  - Reconexión automática
  - Debug info en desarrollo
  - Mejor manejo de mensajes ElevenLabs

### Backend y Auth
- ✅ Robustecido el system prompt de Amelita en ElevenLabs con la Persona Canónica completa
- ✅ Corregido uso de vocativos: neutros por defecto, sin asumir género del interlocutor
- ✅ Auth callback ahora crea usuarios automáticamente si están en `ALLOWED_EMAILS`
- ✅ Middleware redirige `/` → `/es` o `/en` según `Accept-Language` header

### Infraestructura
- ✅ Configurado deploy automatizado S3 + SSM + PM2
- ✅ Configurado nginx proxy reverso con SSL
- ✅ DNS propagado correctamente en todos los resolvers públicos
- ✅ Sin conflictos con otros dominios en servidor Chatita

## Próximos pasos

### Alta prioridad
1. **CRÍTICO**: Usuario debe probar login con `jose@manuelcadena.com` y acceder al aula
2. **CRÍTICO**: Rotar secretos expuestos (`AUTH_GOOGLE_SECRET`, `ELEVENLABS_API_KEY`, `AUTH_SECRET`)
3. **Probar widget de voz** con usuario autenticado
4. **Probar chat de texto** con usuario autenticado

### Media prioridad
5. Generar assets visuales de alta resolución (retrato Amelita, textura templo, favicon)
6. Migrar middleware a `proxy.ts` (Next.js 16)
7. Configurar backup automático de SQLite
8. Migrar secrets a AWS Secrets Manager

### Baja prioridad
9. Implementar parallax scroll en hero
10. Fade-in on scroll para cards
11. Dark/Light mode toggle
12. Post-processing 3D (bloom effect)

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

# Verificar conflictos
aws ssm send-command --instance-ids i-0994d0887cc3c3476 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["netstat -tlnp | grep LISTEN | grep -E :(80|443|3[0-9]{3})"]' \
  --region us-west-2
```

## Evidencia de deploy
- Build: ✅ Exit code 0
- Upload S3: ✅ `s3://chatita-deployments-temp/pitagoricos-ai/pitagoricos-ai-20260824-005033.tar.gz`
- SSM deploy: ✅ CommandId `b1939553-5e26-420f-bf21-3ecc90575a61` Success
- PM2 reload: ✅ Process online
- Git push: ✅ SHA `78e3cb1`
- DNS propagation: ✅ Verificado en 6 resolvers públicos
- HTTP redirect: ✅ 301 → HTTPS
- Root redirect: ✅ 307 → `/es` o `/en` según idioma
- 3D canvas: ✅ Verificado en homepage
- Diseño: ✅ Rediseñado completamente sin texto encimado
- Conflictos: ✅ Ninguno (puerto 3200 aislado)
