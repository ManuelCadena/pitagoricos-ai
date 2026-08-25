# Pitagóricos.ai — Heartbeat

## Estado actual
- **Versión desplegada**: `pitagoricos-ai-20260824-010437.tar.gz`
- **Git SHA**: `024d7ca`
- **Servidor**: EC2 Chatita (`i-0994d0887cc3c3476`)
- **Proceso PM2**: `pitagoricos-ai` online en puerto `3200`
- **Nginx**: proxy_pass a `http://127.0.0.1:3200`, SSL activo
- **DNS**: ✅ Propagado correctamente a `54.212.177.221`
- **Conflictos**: ✅ Ninguno (puerto 3200 aislado, nginx config independiente)
- **Health check**: 
  - HTTP → HTTPS: `301 Moved Permanently` ✅
  - HTTPS `/` → `/es` o `/en` según idioma: `307 Temporary Redirect` ✅
  - PM2: online ✅
- **Homepage**: ✅ Público (no requiere login)
- **Diseño**: ✅ Rediseñado completamente (ver `docs/VISUAL_DESIGN_REPORT.md`)
- **ElevenLabs**: ✅ SDK oficial `@elevenlabs/client` instalado

## Últimos cambios

### 2026-08-25
- ✅ **Knowledge Base ampliado — COMPLETADO**:
  - Integrado libro "Pitágoras: Auto-Aprendizaje de Vida" de María Amelia Ruiz de Motto
  - 193KB, 12 capítulos de enseñanzas pitagóricas canónicas
  - Archivo preparado en `knowledge-base/pitagoras-auto-aprendizaje-de-vida-raw.txt`
  - Sincronizado con repo About-God (`07-AMELIA-RUIZ-CONFERENCES/libros/`)
  - ✅ Subido a ElevenLabs (ID: `nr6KnGahZfqkDL1PoHPF`)
  - ✅ Asociado al agente Amelita (14 documentos totales en KB)
  - ✅ RAG habilitado (usage_mode: auto)
  - Documentación actualizada en `ELEVENLABS_AGENT_CONFIG.md`

### 2026-08-24

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

### ElevenLabs Integration
- ✅ **SDK oficial instalado**: `@elevenlabs/client` (15 packages)
- ✅ **Widget de voz rediseñado**:
  - Botón circular fijo (no flotante)
  - Estados visuales claros (dorado/rojo)
  - Usa `Conversation.startSession` con signedUrl
  - Iconos Lucide React
  - Manejo de errores mejorado
- ⚠️ **Chat de texto deshabilitado temporalmente**:
  - Requiere investigación adicional de API ElevenLabs
  - Nota visible para el usuario

### Auth y Routing
- ✅ **Homepage ahora es público**:
  - No requiere login para ver el homepage
  - Solo `/aula` y rutas protegidas requieren autenticación
  - Middleware corregido para permitir acceso público a `/${locale}`
- ✅ **Auth callback crea usuarios automáticamente** si están en `ALLOWED_EMAILS`
- ✅ **Middleware redirige `/` → `/es` o `/en`** según `Accept-Language` header

### Infraestructura
- ✅ Configurado deploy automatizado S3 + SSM + PM2
- ✅ Configurado nginx proxy reverso con SSL
- ✅ DNS propagado correctamente en todos los resolvers públicos
- ✅ Sin conflictos con otros dominios en servidor Chatita

### Documentación
- ✅ **VISUAL_DESIGN_REPORT.md** — Análisis completo del rediseño
- ✅ **TROUBLESHOOTING_2026-08-24.md** — Diagnóstico de problemas
- ✅ **ELEVENLABS_AGENT_CONFIG.md** — Guía completa de configuración del agente
- ✅ **RECEIPT_2026-08-24.yaml** — Receipt de la sesión

## Próximos pasos

### Alta prioridad
1. **CRÍTICO**: Usuario debe limpiar DNS cache local:
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   dig pitagoricos.ai +short  # Debe mostrar 54.212.177.221
   ```
2. **Verificar configuración del agente ElevenLabs**:
   - System prompt coincide con `amelita-prompt-v3.md`
   - Voice es femenina argentina
   - Language es `es`
   - Knowledge base configurado (si aplica)
3. **Probar widget de voz** con usuario autenticado (`jose@manuelcadena.com`)
4. **Rotar secretos expuestos** (`AUTH_GOOGLE_SECRET`, `ELEVENLABS_API_KEY`, `AUTH_SECRET`)

### Media prioridad
5. **Agregar knowledge base** al agente ElevenLabs:
   - Corpus de enseñanzas de Amelita
   - Filosofía pitagórica
   - FAQs
6. **Habilitar RAG** si el knowledge base es grande
7. **Investigar chat de texto** — API específica de ElevenLabs o alternativa
8. Configurar backup automático de SQLite
9. Migrar secrets a AWS Secrets Manager

### Baja prioridad
10. Generar assets visuales de alta resolución (retrato Amelita, textura templo, favicon)
11. Migrar middleware a `proxy.ts` (Next.js 16)
12. Implementar parallax scroll en hero
13. Fade-in on scroll para cards
14. Dark/Light mode toggle
15. Post-processing 3D (bloom effect)

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
- Upload S3: ✅ `s3://chatita-deployments-temp/pitagoricos-ai/pitagoricos-ai-20260824-010437.tar.gz`
- SSM deploy: ✅ CommandId `7d44190a-0b01-400f-b153-c36eb7e017e1` Success
- PM2 reload: ✅ Process online
- Git push: ✅ SHA `024d7ca`
- DNS propagation: ✅ Verificado en 6 resolvers públicos
- HTTP redirect: ✅ 301 → HTTPS
- Root redirect: ✅ 307 → `/es` o `/en` según idioma
- 3D canvas: ✅ Verificado en homepage
- Diseño: ✅ Rediseñado completamente sin texto encimado
- Conflictos: ✅ Ninguno (puerto 3200 aislado)
- Homepage público: ✅ No requiere login
- ElevenLabs SDK: ✅ `@elevenlabs/client` instalado
