# Troubleshooting Session — 2026-08-24

## Problemas reportados por usuario

1. ❌ **Homepage viejo**: Usuario ve login page en lugar del homepage rediseñado
2. ❌ **ElevenLabs SDK no carga**: Error "ElevenLabs SDK no se cargó correctamente"
3. ❌ **Chat desconectado**: WebSocket no conecta

## Investigación realizada

### Estado del deploy
- **Deploy exitoso**: SHA `78e3cb1`, tarball `pitagoricos-ai-20260824-005033.tar.gz`
- **Archivos actualizados**: Timestamp 06:50-06:51 en `/opt/chatita-aion/apps/pitagoricos-ai/`
- **PM2 reiniciado**: Múltiples reinicios (último 06:48:42)
- **Servidor corriendo**: PID cambiante, puerto 3200

### Problema identificado: DNS cache local del usuario

```bash
# DNS público (correcto)
dig @8.8.8.8 pitagoricos.ai +short
# 54.212.177.221 ✅

# DNS local del usuario (incorrecto)
dig pitagoricos.ai +short
# 217.70.184.38 ❌ (cache viejo)
```

### Problema potencial: Next.js no responde

```bash
# Test desde servidor
curl -s http://127.0.0.1:3200/es
# Sin output (posible error en Next.js)
```

## Acciones tomadas

1. ✅ Verificado que archivos están desplegados correctamente
2. ✅ PM2 reiniciado forzosamente (delete + start)
3. ✅ Verificado que no hay conflictos de puerto
4. ⚠️ Pendiente: Verificar por qué Next.js no responde a requests

## Acciones pendientes (CRÍTICAS)

### 1. Limpiar DNS cache local del usuario

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
dig pitagoricos.ai +short  # Debe mostrar 54.212.177.221
```

### 2. Verificar logs completos de Next.js

```bash
# SSH al servidor
ssh -i ~/.ssh/citrusmax-key.pem -p 2222 ec2-user@54.212.177.221

# Ver logs en tiempo real
pm2 logs pitagoricos-ai --lines 100

# Verificar errores
tail -100 /var/log/pitagoricos-ai/error.log
```

### 3. Verificar que Next.js está sirviendo correctamente

```bash
# Desde el servidor
curl -v http://127.0.0.1:3200/
curl -v http://127.0.0.1:3200/es
curl -v http://127.0.0.1:3200/en

# Debe retornar HTML con el nuevo diseño
```

### 4. Corregir problemas de ElevenLabs

El widget de voz tiene dos problemas potenciales:

#### A. SDK URL incorrecta

**Archivo**: `components/amelita/VoiceWidget.tsx`

**Problema**: La URL del SDK puede estar incorrecta o el SDK puede no existir en esa ruta.

**Solución**: Verificar documentación oficial de ElevenLabs y usar la URL correcta del SDK.

#### B. WebSocket endpoint incorrecto

**Archivo**: `components/amelita/TextChat.tsx`

**Problema**: El WebSocket está intentando conectar a:
```typescript
const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${...}`;
```

Pero debería usar el `signed_url` obtenido del endpoint `/api/signed-url`.

**Solución**: Cambiar la lógica de conexión WebSocket para usar el signed URL correctamente.

### 5. Agregar variable de entorno faltante

El chat de texto intenta leer:
```typescript
process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
```

Pero esta variable no está en `.env.local` ni en el deploy script.

**Solución**: Agregar a `.env.local`:
```
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_9801m0s0px8afx8t8nq9semfwke2
```

Y actualizar el deploy script para incluirla.

## Riesgos identificados

1. **DNS cache persistente**: El usuario puede seguir viendo el sitio viejo hasta que limpie su cache DNS local
2. **Next.js no responde**: Posible error en el build o en el servidor que impide que Next.js sirva páginas
3. **ElevenLabs SDK**: La URL del SDK puede no existir o estar desactualizada
4. **WebSocket auth**: El chat de texto puede no estar usando correctamente el signed URL

## Próximos pasos inmediatos

1. Usuario debe limpiar DNS cache local
2. Verificar logs completos de PM2 para encontrar errores de Next.js
3. Corregir implementación de ElevenLabs (SDK + WebSocket)
4. Agregar variables de entorno faltantes
5. Re-deploy con correcciones

## Evidencia

- Deploy SHA: `78e3cb1`
- Tarball: `pitagoricos-ai-20260824-005033.tar.gz`
- PM2 status: online, PID variable (múltiples reinicios)
- Archivos en servidor: `/opt/chatita-aion/apps/pitagoricos-ai/`
- Timestamp archivos: 2026-08-24 06:50-06:51
- DNS público: 54.212.177.221 ✅
- DNS local usuario: 217.70.184.38 ❌
