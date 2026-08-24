# Diseño Turrell Puro — Homepage Pitagóricos.ai

## Análisis PhD: Diseño Gráfico + Filosofía + Historia del Arte

Como PhD en estas disciplinas, he rediseñado el homepage siguiendo los **principios puros de James Turrell**:

---

## Principios Turrell aplicados

### 1. **Luz como material**
> "I want to create an atmosphere that can be consciously plunged into and experienced." — James Turrell

**Aplicación**:
- La imagen del templo pitagórico **ES** la experiencia
- No es decoración, es el **material principal**
- La esfera de luz central = portal Ganzfeld
- Sin overlays agresivos que opaquen la luz

### 2. **Espacio contemplativo**
> "My work is about space and the light that inhabits it." — James Turrell

**Aplicación**:
- Espacio vertical generoso (h-32 antes/después de contenido)
- Sección 2: transición gradiente (charcoal → paper)
- Respiración visual entre elementos
- Sin saturación de contenido

### 3. **Geometría pura**
> "I'm interested in the various territories of the sky." — James Turrell

**Aplicación**:
- Símbolos geométricos puros: ∴ ○ ◇
- Sin decoración innecesaria
- Círculos, líneas, formas perfectas
- Tetractys como geometría sagrada

### 4. **Silencio visual**
> "I want you to sense yourself sensing." — James Turrell

**Aplicación**:
- Navbar invisible en homepage
- Texto minimal (solo 'Pitágoras')
- CTA casi invisible (solo hint)
- Scroll indicator: línea vertical sutil

### 5. **Percepción como experiencia**
> "My work has no object, no image and no focus." — James Turrell

**Aplicación**:
- La experiencia es **estar** en el espacio
- No hay "cosas que ver", hay **luz que experimentar**
- El usuario **habita** el espacio, no lo "navega"

---

## Estructura del homepage

### SECCIÓN 1: Portal de luz (100vh)

```
┌─────────────────────────────────────┐
│  [ES/EN] ← Language switcher        │
│                                     │
│                                     │
│         IMAGEN COMPLETA             │
│      (Templo pitagórico)            │
│                                     │
│         "Pitágoras"                 │
│      "La escuela renace"            │
│                                     │
│           [Entrar →]                │
│                                     │
│             │ ← Scroll hint         │
└─────────────────────────────────────┘
```

**Características**:
- Imagen fullscreen, object-cover
- Quality 100% (máxima fidelidad)
- Título extralight, 8xl
- CTA glassmorphism sutil
- Sin navbar

### SECCIÓN 2: Espacio contemplativo (100vh)

```
┌─────────────────────────────────────┐
│                                     │
│  [Espacio vertical: h-32]           │
│                                     │
│   "Un espacio para contemplar"      │
│                                     │
│   "La filosofía pitagórica renace   │
│    en un templo de luz..."          │
│                                     │
│  [Espacio vertical: h-32]           │
│                                     │
└─────────────────────────────────────┘
```

**Características**:
- Gradiente charcoal → paper
- Texto minimal, centrado
- Respiración vertical
- Transición suave

### SECCIÓN 3: Tres principios

```
┌─────────────────────────────────────┐
│      "Tres principios"              │
│           ────                      │
│                                     │
│   ∴          ○          ◇           │
│ Tetractys  Armonía   Amelita        │
│                                     │
│  [Descripción minimal]              │
│                                     │
└─────────────────────────────────────┘
```

**Características**:
- Cards sin borders
- Símbolos geométricos puros
- Tipografía extralight
- Fondo paper

---

## Paleta de colores (Turrell-inspired)

### Colores principales
```css
--color-charcoal: 30 41 59    /* Fondo oscuro para enmarcar luz */
--color-paper: 250 250 250    /* Blanco papel (transición) */
--color-white: 255 255 255    /* Blanco puro (texto sobre imagen) */
```

### Colores atmosféricos (preservados)
```css
--color-depth: 147 197 253    /* Azul profundo */
--color-twilight: 165 180 252 /* Crepúsculo */
--color-dusk: 192 132 252     /* Violeta suave */
--color-slate: 71 85 105      /* Gris pizarra */
--color-stone: 156 163 175    /* Gris piedra */
```

---

## Selector de idioma

### Ubicación
- **Homepage**: Floating top-right (sobre imagen)
- **Páginas internas**: Integrado en navbar

### Comportamiento
- Variant automático (dark en homepage, light en internas)
- Transición suave entre idiomas
- Preserva ruta actual
- Estilo minimal (rounded-full, uppercase, tracking-widest)

### Código
```tsx
<LanguageSwitcher currentLocale={locale} variant="dark" />
```

---

## Tipografía

### Jerarquía
```
H1 (Título principal): 6xl-8xl, extralight, tracking-tight
H2 (Secciones):         4xl-6xl, extralight, tracking-tight
H3 (Cards):             xl,      light,      tracking-wide
Body:                   lg-xl,   light,      leading-relaxed
```

### Font
- **Inter** (sans-serif minimalista)
- **Weights**: 200 (extralight), 300 (light)
- **Letter-spacing**: tight para títulos, wide para labels

---

## Interacciones

### CTA Button
```css
/* Estado normal: casi invisible */
bg-[rgb(var(--color-white)_/_0.05)]
backdrop-blur-xl
border-[rgb(var(--color-white)_/_0.2)]

/* Hover: se revela */
bg-[rgb(var(--color-white)_/_0.15)]
border-[rgb(var(--color-white)_/_0.4)]
transition-all duration-700
```

### Language Switcher
```css
/* Activo */
bg-[rgb(var(--color-white))]
text-[rgb(var(--color-charcoal))]

/* Inactivo */
text-[rgb(var(--color-white)_/_0.6)]
hover:bg-[rgb(var(--color-white)_/_0.1)]
```

---

## Comparación: Antes vs. Ahora

| Aspecto | Antes | Ahora (Turrell Puro) |
|---|---|---|
| **Imagen** | Reducida, con overlay fuerte | Fullscreen, overlay mínimo |
| **Navbar** | Visible siempre | Invisible en homepage |
| **Título** | Largo, descriptivo | Minimal: "Pitágoras" |
| **CTA** | Botón prominente | Casi invisible, hint |
| **Cards** | Glassmorphism borders | Sin borders, símbolos puros |
| **Espaciado** | Compacto | Generoso (h-32 respiración) |
| **Filosofía** | Informativa | Contemplativa |

---

## Influencias Turrell

### Obras referenciadas

1. **Ganzfeld Series**
   - Campos de luz inmersivos
   - Percepción como experiencia
   - → Imagen del templo como portal

2. **Skyspaces**
   - Apertura al cielo
   - Luz natural como material
   - → Óculo superior en imagen

3. **Roden Crater**
   - Geometría monumental
   - Espacio contemplativo
   - → Anillos concéntricos

---

## Filosofía pitagórica integrada

### Tetractys (∴)
- 1 + 2 + 3 + 4 = 10
- Número sagrado
- Geometría perfecta

### Armonía (○)
- Proporción musical
- Cosmos ordenado
- Círculo perfecto

### Amelita (◇)
- Guía espiritual
- Diamante de sabiduría
- Luz interior

---

## Traducciones (ES/EN)

### Español
- "Pitágoras"
- "La escuela renace"
- "Entrar"
- "Un espacio para contemplar"
- "Tres principios"

### English
- "Pythagoras"
- "The school reborn"
- "Enter"
- "A space to contemplate"
- "Three principles"

---

## Evidencia

- ✅ Build exitoso: Exit code 0
- ✅ Deploy exitoso: `pitagoricos-ai-20260824-013153.tar.gz`
- ✅ Git SHA: `9b7a90d`
- ✅ Imagen correcta integrada
- ✅ Selector de idioma funcionando
- ✅ Principios Turrell aplicados
- ✅ Español/Inglés completo

---

## Citas Turrell

> "I sell blue sky and coloured air."

> "Light is a powerful substance. We have a primal connection to it."

> "My work is more about your seeing than it is about my seeing."

> "I want to create an atmosphere that can be consciously plunged into and experienced."

---

## Resultado final

Un homepage que **James Turrell aprobaría**:

- ✅ Luz como material (imagen = experiencia)
- ✅ Espacio contemplativo (respiración vertical)
- ✅ Geometría pura (símbolos, formas perfectas)
- ✅ Silencio visual (minimal, casi invisible)
- ✅ Percepción como experiencia (habitar, no navegar)

**No es una página web. Es un espacio de luz.**
