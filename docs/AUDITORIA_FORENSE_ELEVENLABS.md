# Auditoría Forense — Comunicación con el agente Ame (ElevenLabs)

**Fecha**: 2026-08-24
**SDK auditado**: `@elevenlabs/client` v1.21.0 (evidencia extraída de `node_modules/@elevenlabs/client/dist/`)
**Síntomas reportados**: no deja escribir texto · el texto se cruza con la voz · controles no separados

---

## 1. Evidencia del SDK (fuente: código instalado, no documentación externa)

### 1.1 El SDK separa texto y voz en DOS clases distintas

`dist/index.js` (literal):
```js
export const Conversation = {
    async startSession(options) {
        assertRuntimeCompatibility();
        return isTextOnly(options)
            ? TextConversation.startSession(options)   // ← SIN micrófono, SIN audio
            : VoiceConversation.startSession(options); // ← CAPTURA MICRÓFONO + REPRODUCE AUDIO
    },
};
```

`dist/index.d.ts` (literal):
```ts
startSession<T extends PartialOptions>(options: T): T extends { textOnly: true }
    ? Promise<TextConversation>
    : T extends { textOnly: false }
        ? Promise<VoiceConversation>
        : Promise<TextConversation | VoiceConversation>;
```

**Conclusión**: sin `textOnly: true`, TODA sesión es una VoiceConversation completa.

### 1.2 El método correcto para enviar texto

`dist/BaseConversation.d.ts` (literal):
```ts
sendUserMessage(text: string): void;
sendUserActivity(): void;
sendContextualUpdate(text: string, options?: ContextualUpdateOptions): void;
endSession(): Promise<void>;
```

El método `sendUserInput` que se intentó usar en versiones anteriores **NO EXISTE** en el SDK.

---

## 2. Hallazgos forenses

| # | Severidad | Hallazgo | Evidencia | Síntoma que produce |
|---|---|---|---|---|
| F1 | **CRÍTICO** | `TextChat.tsx` llamaba `startSession({ signedUrl })` **sin `textOnly: true`** | Línea 48-49 del componente | Cada vez que se abría el tab "Texto" se creaba una **VoiceConversation completa**: el SDK capturaba el micrófono y reproducía audio del agente → **"se cruza con la voz"** |
| F2 | **CRÍTICO** | Input de texto deshabilitado: `disabled={true}` y `sendMessage` solo hacía `console.warn` sin enviar nada | Líneas 118, 178, 184 | **"No me deja escribir con texto"** |
| F3 | **ALTO** | La sesión de texto se abría automáticamente en `useEffect` al montar el componente (al cambiar de tab), sin gesto del usuario | `useEffect(() => { connect() }, [])` | Sesión de voz fantasma al solo mirar el tab de texto |
| F4 | **ALTO** | `VoiceWidget` no cerraba la sesión al desmontarse: cambiar del tab Voz al tab Texto dejaba la conversación de voz VIVA | Sin cleanup en unmount | Dos sesiones simultáneas → cruce total de audio |
| F5 | **MEDIO** | El código anterior intentó `conversation.sendUserInput(text)` — método inexistente (error TS2339 en build previo) | Historial de build | Chat de texto nunca funcionó |
| F6 | **BAJO** | Los estilos del TextChat usaban clases de la paleta vieja (`text-gold`, `bg-background`) ya eliminadas del CSS | Clases sin definición | Estados visuales invisibles |

## 3. Arquitectura correcta (según SDK + docs oficiales)

```
┌─────────────────────────────────────────────────────┐
│  TAB VOZ                                            │
│  GET /api/conversation-token  (auth 401/403)        │
│  → startSession({ conversationToken,               │
│                   connectionType: 'webrtc' })       │
│  → VoiceConversation (micrófono + audio)            │
│  → cleanup: endSession() al desmontar               │
├─────────────────────────────────────────────────────┤
│  TAB TEXTO                                          │
│  GET /api/signed-url  (auth 401/403)                │
│  → startSession({ signedUrl,                        │
│                   connectionType: 'websocket',      │
│                   textOnly: true })                 │
│  → TextConversation (SIN micrófono, SIN audio)      │
│  → envío: conversation.sendUserMessage(text)        │
│  → cleanup: endSession() al desmontar               │
└─────────────────────────────────────────────────────┘
```

Separación garantizada por diseño: la clase `TextConversation` tiene stubs vacíos
para `setVolume()`, `setMicMuted()` — **físicamente no puede tocar el micrófono**.

## 4. Correcciones aplicadas

1. **TextChat.tsx** reescrito:
   - `textOnly: true` + `connectionType: 'websocket'` → `TextConversation` real
   - `sendUserMessage(text)` (método verificado en el .d.ts)
   - Input HABILITADO cuando hay conexión
   - `sendUserActivity()` al teclear (señal de presencia según SDK)
   - Cleanup con `endSession()` al desmontar
   - Estilos migrados a la paleta Turrell actual
2. **VoiceWidget.tsx**:
   - Cleanup al desmontar: si cambias de tab con la voz activa, la sesión se cierra
3. **Aula.tsx**: sin cambios — el montaje exclusivo por tab + cleanups garantiza cero cruce

## 5. Sobre el Knowledge Base (docs/eleven-agents/customization/knowledge-base)

El knowledge base NO afecta el transporte (texto/voz): se configura en el agente
(ElevenLabs UI → Agent → Knowledge Base) y aplica a ambos canales por igual.
Para que Ame responda con su corpus en texto y voz:
- Subir documentos (PDF/DOCX/TXT/MD/HTML/EPUB, ≤20MB)
- `usage_mode: auto` (RAG si está habilitado; prompt si es pequeño)
- El agente debe tener habilitado el canal de texto en la configuración
  (Agent → Advanced → Text input) — verificar en la UI de ElevenLabs.

## 6. Verificación

- Build: exit 0
- `TextConversation` sin audio: garantizado por clase del SDK (stubs vacíos)
- Voz WebRTC intacta (fix iOS previo conservado)
