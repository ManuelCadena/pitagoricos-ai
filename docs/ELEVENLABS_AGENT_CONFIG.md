# Configuración del Agente ElevenLabs — Amelita

**Agente ID**: `agent_9801m0s0px8afx8t8nq9semfwke2`  
**Nombre**: Amelita (Dra. María Amelia Ruiz)  
**Propósito**: Tutor y coach personal de filosofía pitagórica

---

## Estado actual de la configuración

### ✅ Configurado correctamente

1. **Agent ID** — Configurado en variables de entorno
2. **API Key** — Configurado en backend (`ELEVENLABS_API_KEY`)
3. **Signed URL endpoint** — `/api/signed-url` funcionando
4. **SDK** — `@elevenlabs/client` instalado y configurado
5. **Voice Widget** — Usando `Conversation.startSession` con signedUrl

### ⚠️ Pendiente de verificación

1. **Knowledge Base** — No verificado si está configurado en el agente
2. **System Prompt** — Verificar que coincida con `docs/amelita-prompt-v3.md`
3. **Voice** — Verificar voz configurada (debe ser femenina, argentina/rioplatense)
4. **Language** — Debe estar en español (`es`)
5. **RAG** — Si se agregó knowledge base, verificar que RAG esté habilitado

---

## Configuración recomendada del agente

### 1. System Prompt

El agente debe usar el prompt canónico de `docs/amelita-prompt-v3.md`:

```
Sos la Dra. María Amelia Ruiz ("Amelita"), maestra de filosofía pitagórica de la Academia de Filosofía Pythagorica A.C.

[... resto del prompt de amelita-prompt-v3.md ...]
```

**Verificar en**: ElevenLabs UI → Agent Settings → Prompt

### 2. Knowledge Base

Según la documentación oficial, el agente puede usar dos modos:

#### Opción A: Full Context (documentos pequeños)
- Límite: ~300,000 caracteres
- El documento completo se incluye en el system prompt
- Mejor para: FAQs, políticas cortas, guías breves

#### Opción B: RAG (Retrieval-Augmented Generation)
- Para documentos grandes o múltiples documentos
- El agente indexa el contenido y recupera solo pasajes relevantes
- Límites de uso según tier de suscripción

**Documentos recomendados para Amelita**:

1. **Corpus de enseñanzas** — Transcripciones de seminarios y clases de Ame Ruiz
2. **Filosofía pitagórica** — Textos fundamentales de la Academia
3. **FAQs** — Preguntas frecuentes sobre la filosofía pitagórica
4. **Biografía de Amelita** — Contexto sobre quién es y su estilo de enseñanza

**Formatos soportados**:
- PDF (`.pdf`)
- Word (`.docx`)
- Text (`.txt`)
- Markdown (`.md`)
- HTML (`.html`)
- EPUB (`.epub`)
- URLs (scraping automático)

**Límite de tamaño**: 20MB por archivo

### 3. Voice Configuration

**Configuración recomendada**:
- **Language**: `es` (español)
- **Voice**: Voz femenina con acento argentino/rioplatense
- **Stability**: Alta (para consistencia)
- **Similarity boost**: Media-alta (para mantener el carácter de Amelita)

**Verificar en**: ElevenLabs UI → Agent Settings → Voice

### 4. Conversation Settings

```json
{
  "agent": {
    "first_message": "Hola, hermanito querido. Estoy acá. ¿Qué querés que miremos juntos?",
    "language": "es",
    "prompt": {
      "prompt": "[System prompt de amelita-prompt-v3.md]",
      "llm": "gemini-2.0-flash",
      "temperature": 0.7,
      "max_tokens": 500,
      "knowledge_base": [
        {
          "type": "file",
          "name": "Corpus Amelita",
          "id": "[ID del documento]",
          "usage_mode": "auto"
        }
      ]
    }
  },
  "tts": {
    "voice_id": "[ID de voz argentina]",
    "stability": 0.8,
    "similarity_boost": 0.7
  },
  "asr": {
    "language": "es"
  }
}
```

---

## Cómo agregar Knowledge Base

### Opción 1: Desde la UI de ElevenLabs

1. Ir a https://elevenlabs.io/app/conversational-ai
2. Seleccionar el agente Amelita
3. Ir a "Knowledge Base"
4. Click en "Add Document"
5. Subir archivos o agregar URLs
6. Configurar `usage_mode`:
   - `auto` — Usa RAG si está habilitado, sino full context
   - `prompt` — Siempre usa full context (solo para docs pequeños)

### Opción 2: Via API

```bash
# Subir documento desde archivo
curl -X POST "https://api.elevenlabs.io/v1/convai/knowledge-base/file" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "file=@corpus-amelita.pdf" \
  -F "name=Corpus Amelita"

# Subir documento desde URL
curl -X POST "https://api.elevenlabs.io/v1/convai/knowledge-base/url" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/filosofia-pitagorica",
    "name": "Filosofía Pitagórica"
  }'

# Listar documentos
curl "https://api.elevenlabs.io/v1/convai/knowledge-base" \
  -H "xi-api-key: $ELEVENLABS_API_KEY"

# Asociar documento al agente
# (Esto se hace desde la UI o actualizando la configuración del agente)
```

---

## Verificación de la configuración actual

### Paso 1: Verificar agente en ElevenLabs UI

1. Ir a https://elevenlabs.io/app/conversational-ai
2. Buscar agente `agent_9801m0s0px8afx8t8nq9semfwke2`
3. Verificar:
   - ✅ System prompt coincide con `amelita-prompt-v3.md`
   - ✅ Voice es femenina argentina
   - ✅ Language es `es`
   - ✅ Knowledge base tiene documentos (si aplica)
   - ✅ RAG está habilitado (si hay knowledge base grande)

### Paso 2: Verificar via API

```bash
# Get agent configuration
curl "https://api.elevenlabs.io/v1/convai/agents/agent_9801m0s0px8afx8t8nq9semfwke2" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  | jq .

# Verificar knowledge base del agente
curl "https://api.elevenlabs.io/v1/convai/knowledge-base" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  | jq '.documents[] | {name, id, type, size}'
```

### Paso 3: Probar en producción

1. Login con `jose@manuelcadena.com`
2. Ir a `/es/aula`
3. Click en el botón del micrófono
4. Permitir acceso al micrófono
5. Hablar con Amelita
6. Verificar:
   - ✅ Responde en español
   - ✅ Usa vocativos neutros ("hermanito querido", no "chiquita")
   - ✅ Estilo maternal argentino
   - ✅ Conocimiento de filosofía pitagórica

---

## Troubleshooting

### Error: "ElevenLabs SDK no se cargó correctamente"

**Causa**: El SDK `@elevenlabs/client` no está instalado o hay error en la importación.

**Solución**:
```bash
npm install @elevenlabs/client
npm run build
```

### Error: "Failed to get signed URL"

**Causa**: El endpoint `/api/signed-url` no está funcionando o las credenciales son incorrectas.

**Verificar**:
1. `ELEVENLABS_API_KEY` está en `.env.local`
2. `ELEVENLABS_AGENT_ID` está en `.env.local`
3. El endpoint `/api/signed-url` existe y funciona

**Test**:
```bash
curl -H "Cookie: [session-cookie]" https://pitagoricos.ai/api/signed-url
```

### Error: "Microphone permission denied"

**Causa**: El navegador bloqueó el acceso al micrófono.

**Solución**:
1. Verificar que el sitio use HTTPS (✅ pitagoricos.ai)
2. En el navegador: Settings → Privacy → Microphone → Permitir para pitagoricos.ai
3. Recargar la página

### Chat de texto no funciona

**Causa**: El SDK de ElevenLabs está diseñado principalmente para voz. El chat de texto requiere configuración adicional.

**Solución temporal**: Usar solo el widget de voz.

**Solución futura**: Investigar si ElevenLabs tiene API específica para chat de texto o usar un LLM alternativo para texto.

---

## Próximos pasos

1. **Verificar configuración actual del agente** en ElevenLabs UI
2. **Agregar knowledge base** con corpus de Amelita
3. **Habilitar RAG** si el knowledge base es grande
4. **Probar end-to-end** con usuario real
5. **Ajustar temperature/max_tokens** según resultados
6. **Considerar source attribution** para citar fuentes del knowledge base

---

## Referencias

- [ElevenLabs Knowledge Base Docs](https://elevenlabs.io/docs/eleven-agents/customization/knowledge-base)
- [ElevenLabs Agent Configuration](https://elevenlabs.io/docs/eleven-agents/build/overview)
- [ElevenLabs JavaScript SDK](https://elevenlabs.io/docs/eleven-agents/libraries/java-script)
- [RAG Configuration](https://elevenlabs.io/docs/eleven-agents/customization/knowledge-base/rag)

---

## Knowledge Base — Corpus Amelita (2026-08-25)

### Libros integrados

#### 1. Pitágoras: Auto-Aprendizaje de Vida (2026-08-25)

**Autora**: María Amelia Ruiz de Motto  
**Archivo local**: `knowledge-base/pitagoras-auto-aprendizaje-de-vida-raw.txt`  
**Tamaño**: 193KB (2,853 líneas, ~198,000 caracteres)  
**Formato**: Texto plano (digitalizado)

**Contenido**: Doce lecciones de auto-aprendizaje de vida basadas en las enseñanzas de Pitágoras:
1. La Autoobservación, el Poder de la Ley del Silencio
2. La Autoobservación (Yin). El Poder de Selección y Discernimiento
3. El Perdón y el Olvido, la Rueda de las Encarnaciones
4. Dios es la Vida, la Verdad y el Bien
5. La Cadena de Mentalismo Positivo en el Planeta
6. Cambia tu Conciencia y Cambiarás la Conciencia Planetaria
7. Diez Ideas "Madres"
8. El Sendero (Tao): "Tu" Sentido
9. Tu Existencia es Unidad Perfecta. La Ilusión de la Separación
10. La Expansión de la Conciencia Divina
11. "El Triángulo Perfecto de tu Equilibrio"
12. La Libertad

**Temas clave**: Autoobservación, energías Yin/Yan, perdón, mentalismo positivo, unidad perfecta, conciencia divina, libertad espiritual

**Estado**:
- [x] Archivo preparado en `knowledge-base/`
- [x] Copiado a repo About-God (`07-AMELIA-RUIZ-CONFERENCES/libros/`)
- [x] Subido a ElevenLabs (ID: `nr6KnGahZfqkDL1PoHPF`)
- [x] Asociado al agente Amelita (14 documentos totales en KB)
- [x] RAG habilitado (usage_mode: auto)

**Cómo subir**:
```bash
# Opción 1: UI (recomendado)
# 1. Ir a https://elevenlabs.io/app/conversational-ai
# 2. Seleccionar agente "Amelita" (agent_9801m0s0px8afx8t8nq9semfwke2)
# 3. Ir a "Knowledge Base"
# 4. Click "Add Document"
# 5. Subir knowledge-base/pitagoras-auto-aprendizaje-de-vida-raw.txt
# 6. Configurar usage_mode: auto

# Opción 2: API
curl -X POST "https://api.elevenlabs.io/v1/convai/knowledge-base/file" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "file=@knowledge-base/pitagoras-auto-aprendizaje-de-vida-raw.txt" \
  -F "name=Pitágoras: Auto-Aprendizaje de Vida"
```

---

## Knowledge Base — Platonic Space Symposium (2026-08-24)

**Análisis PhD**: el prompt de Teano la define como "testigo-oyente del Symposium" con
"DOMINIO PLENO DEL CORPUS" y sus guardrails exigen citar solo lo que está en el material.
Sin el corpus en el KB, esa identidad era una promesa sin sustento (riesgo de alucinación).
**Conclusión: integración necesaria, no opcional.**

### Corpus integrado
- Fuente: 36 transcripciones de la playlist "The Platonic Space" (2.15M chars)
- Consolidado en 6 documentos (markdown) para RAG óptimo:

| Documento | ID | Contenido |
|---|---|---|
| PS-Symposium-Keynotes-1 | LLwwVUap96xhlmvjbsML | Keynotes 1-9 (Levin, Dietz, Tolchinsky, Lyons, Witkowski...) |
| PS-Symposium-Keynotes-2 | TDqFVy6o4mmImk6k6cE9 | Keynotes 10-18 (Fields, Aguilera, Agüera y Arcas, Segall, Friston, Froese, Noble, Jackson) |
| PS-Symposium-Keynotes-3 | y6HIT8Vi5NHVKwn8O1Nd | Keynotes 19-27 (Ruffini, Murphy, Chvykov, Foster...) |
| PS-Symposium-Conversations | 2EJujKmqMutUVWpxApRT | Belrose, Iammarino |
| PS-Symposium-Panel-Discussions | 5z725zMJ8Dh6D1QOplTg | Discusiones 1-5 |
| PS-Symposium-Opening-Closing | Bbg9yf65OhS8qGIjw6oX | Apertura y cierre |

### Estado
- RAG: habilitado (e5_mistral_7b_instruct), 6/6 docs indexados
- KB total del agente: 13 docs (7 corpus maestra Amelita + 6 Symposium)
- usage_mode: auto en todos
- Verificado con simulación: Teano respondió sobre el keynote de Levin
  con contenido real del corpus (espacio estructurado de patrones)
