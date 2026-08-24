# Diseño Turrell v2 — Pitagóricos.ai

## Cambios implementados

### 1. Paleta de colores (inspiración James Turrell)

**Antes**: Dorado sobre negro (estética "mística/esotérica")

**Ahora**: Azules atmosféricos y blancos contemplativos

```css
--color-sky-light: 237 242 251      /* Cielo suave */
--color-sky: 219 234 254            /* Azul claro */
--color-horizon: 191 219 254        /* Horizonte */
--color-depth: 147 197 253          /* Azul profundo */
--color-twilight: 165 180 252       /* Crepúsculo */
--color-dusk: 192 132 252           /* Violeta suave */

--color-white: 255 255 255          /* Blanco puro */
--color-paper: 250 250 250          /* Blanco papel */
--color-cloud: 245 245 247          /* Nube */
--color-stone: 156 163 175          /* Gris piedra */
--color-slate: 71 85 105            /* Pizarra */
--color-charcoal: 30 41 59          /* Carbón */
```

### 2. Tipografía

- **Font**: Inter (sans-serif minimalista)
- **Weights**: 300 (light) para todo
- **Letter-spacing**: -0.02em a -0.03em (tight, moderno)
- **Tamaños**: Clamp responsivo (2.5rem-6rem para display)

### 3. Homepage rediseñado

**Estructura**:
1. Hero fullscreen con gradiente sky
2. Círculos concéntricos geométricos (Tetractys abstracted)
3. Título ultra-minimal
4. CTA con botón blanco rounded-full
5. Sección de 3 principios con cards glassmorphism
6. Footer minimal

**Eliminado**:
- ❌ Esferas 3D giratorias
- ❌ Partículas doradas
- ❌ Texto encimado sobre 3D
- ❌ Decoraciones innecesarias

### 4. Navbar minimalista

- Logo Tetractys SVG (10 puntos)
- Texto "Pitagóricos" light
- Link "Aula" solo si autenticado
- Login button minimal
- Backdrop blur + border sutil

### 5. Aula rediseñada

- Presencia de Amelita: círculos concéntricos (no figurativo)
- Tabs minimal (Voz/Texto)
- Card glassmorphism
- Espaciado generoso

### 6. Componentes actualizados

- `VoiceWidget.tsx` — Botón circular, estados visuales claros
- `TextChat.tsx` — Deshabilitado temporalmente (nota visible)
- `Aula.tsx` — Tabs minimalistas
- `Navbar.tsx` — Ultra-simple

---

## Assets SVG generados

### 1. Logo minimal (`/public/images/logo-minimal.svg`)
- Tetractys: 10 puntos en formación pitagórica
- Gradiente azul-violeta
- Conexiones sutiles
- 120×120px

### 2. Amelita minimal (`/public/images/amelita-minimal.svg`)
- Círculos concéntricos (presencia no-figurativa)
- Gradiente radial suave
- Texto "AMELITA" en Inter light
- 400×400px

### 3. Light portal (`/public/images/turrell-light-portal.svg`)
- Gradientes radiales atmosféricos
- Círculos concéntricos geométricos
- Efecto Ganzfeld
- 1200×1200px

---

## Assets pendientes (AION Brain generó, requieren extracción)

AION Brain generó 3 SVG de alta calidad en el job `4886fd23-9791-4bab-846a-9b2240368119`:

1. **Hero Background** (1920×1080) — Portal de luz Turrell Ganzfeld
2. **Amelita Portrait** (1080×1080) — Presencia atmosférica abstracta
3. **Tetractys Decorativo** (1080×1080) — Geometría sagrada estilizada

**Acción requerida**:
- Extraer SVG del output de AION Brain
- Guardar en `/public/images/`
- Usar en homepage y aula

---

## Principios de diseño aplicados

### James Turrell
1. **Luz como material** — Gradientes sutiles, no objetos
2. **Espacio contemplativo** — Mucho breathing room
3. **Geometría pura** — Círculos, elipses, formas perfectas
4. **Color atmosférico** — Azules/violetas no saturados
5. **Silencio visual** — Menos es más

### Filosofía pitagórica
1. **Tetractys** — 1+2+3+4=10 (geometría sagrada)
2. **Armonía** — Proporción, balance, simetría
3. **Número** — Geometría matemática perfecta
4. **Contemplación** — Espacio para pensar

### Académico/serio
1. **Minimalismo** — Sin decoración innecesaria
2. **Tipografía light** — Elegante, no bold
3. **Espaciado generoso** — Respeto por el contenido
4. **Paleta sobria** — Azules/grises, no dorados

---

## Comparación antes/después

| Aspecto | Antes | Ahora |
|---|---|---|
| Paleta | Dorado/negro | Azul/blanco |
| Estética | Mística/esotérica | Contemplativa/académica |
| 3D | Esferas giratorias | Círculos geométricos |
| Tipografía | Bold/decorativa | Light/minimalista |
| Espaciado | Apretado | Generoso |
| Decoración | Muchos elementos | Mínimo necesario |
| Inspiración | Genérica | James Turrell |

---

## Próximos pasos

### Alta prioridad
1. ✅ Paleta Turrell implementada
2. ✅ Homepage rediseñado
3. ✅ Navbar minimalista
4. ✅ Aula rediseñada
5. ✅ SVG básicos creados
6. ⚠️ Extraer SVG de AION Brain (hero-bg, amelita-portrait, tetractys)
7. ⚠️ Aplicar SVG en homepage
8. ⚠️ Deploy y verificar visualmente

### Media prioridad
9. Agregar animaciones suaves (fade-in, pulse-light)
10. Optimizar para mobile
11. Agregar dark mode (opcional)
12. Mejorar accesibilidad (ARIA labels)

### Baja prioridad
13. Parallax scroll en hero
14. Transiciones de página
15. Loading states elegantes
16. Micro-interacciones

---

## Evidencia

- Build exitoso: ✅ Exit code 0
- Archivos modificados: 8
- Archivos creados: 3 SVG
- AION Brain delegación: ✅ Job `4886fd23-9791-4bab-846a-9b2240368119`
- Tokens ahorrados: ~15K (AION generó SVG complejos)

---

## Feedback del usuario

> "Se ve chafa y como de adivino de feria y no una página seria de un coach filosófico"

**Resuelto**: Paleta Turrell (azul/blanco), minimalismo extremo, geometría pura, sin decoración innecesaria.

---

## Referencias

- [James Turrell — Ganzfeld](https://jamesturrell.com/work/type/ganzfeld/)
- [Filosofía pitagórica — Tetractys](https://en.wikipedia.org/wiki/Tetractys)
- [Inter Font](https://rsms.me/inter/)
- [Tailwind CSS 4](https://tailwindcss.com/)
