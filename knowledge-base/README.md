# Knowledge Base — Pitagóricos.ai

Este directorio contiene el corpus de conocimiento para el agente ElevenLabs "Amelita".

## Contenido

### 1. Pitágoras: Auto-Aprendizaje de Vida
- **Archivo**: `pitagoras-auto-aprendizaje-de-vida-raw.txt`
- **Autora**: María Amelia Ruiz de Motto
- **Descripción**: Doce lecciones de auto-aprendizaje de vida basadas en las enseñanzas de Pitágoras
- **Tamaño**: ~198KB (2,853 líneas)
- **Formato**: Texto plano (original digitalizado)
- **Contenido**:
  - Presentación
  - Introducción
  - Capítulo I: La Autoobservación, el Poder de la Ley del Silencio
  - Capítulo II: La Autoobservación (Yin). El Poder de Selección y Discernimiento
  - Capítulo III: El Perdón y el Olvido, la Rueda de las Encarnaciones
  - Capítulo IV: Dios es la Vida, la Verdad y el Bien
  - Capítulo V: La Cadena de Mentalismo Positivo en el Planeta
  - Capítulo VI: Cambia tu Conciencia y Cambiarás la Conciencia Planetaria
  - Capítulo VII: Diez Ideas "Madres"
  - Capítulo VIII: El Sendero (Tao): "Tu" Sentido
  - Capítulo IX: Tu Existencia es Unidad Perfecta. La Ilusión de la Separación
  - Capítulo X: La Expansión de la Conciencia Divina
  - Capítulo XI: "El Triángulo Perfecto de tu Equilibrio"
  - Capítulo XII: La Libertad

## Integración con ElevenLabs

### Formato soportado
- ✅ `.txt` (texto plano)
- ✅ `.md` (Markdown)
- ✅ `.pdf` (PDF)

### Límites
- Tamaño máximo por archivo: 20MB
- Caracteres máximos (full context): ~300,000
- RAG: recomendado para documentos >100KB

### Estado actual
- [x] Archivo copiado al knowledge-base/
- [ ] Subido a ElevenLabs UI
- [ ] Asociado al agente Amelita
- [ ] RAG habilitado

## Cómo subir a ElevenLabs

### Opción 1: UI (recomendado)
1. Ir a https://elevenlabs.io/app/conversational-ai
2. Seleccionar agente "Amelita" (`agent_9801m0s0px8afx8t8nq9semfwke2`)
3. Ir a "Knowledge Base"
4. Click "Add Document"
5. Subir `pitagoras-auto-aprendizaje-de-vida-raw.txt`
6. Configurar `usage_mode: auto` (usa RAG si está habilitado)

### Opción 2: API
```bash
curl -X POST "https://api.elevenlabs.io/v1/convai/knowledge-base/file" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "file=@pitagoras-auto-aprendizaje-de-vida-raw.txt" \
  -F "name=Pitágoras: Auto-Aprendizaje de Vida"
```

## Sincronización con About-God repo

Este contenido también se sincroniza con el repositorio GitHub `About-God`:
- **Destino**: `07-AMELIA-RUIZ-CONFERENCES/libros/`
- **Repo**: https://github.com/ManuelCadena/About-God

Ver `AGENTS.md` en la carpeta raíz para el flujo de sincronización.

## Metadatos

- **Fecha de integración**: 2026-08-25
- **Integrado por**: Manuel Cadena (PhD workflow)
- **Propósito**: Incrementar knowledge base del agente Amelita con enseñanzas pitagóricas canónicas
