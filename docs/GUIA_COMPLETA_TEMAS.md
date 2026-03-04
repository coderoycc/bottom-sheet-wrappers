# Guía Completa de Temas y Dark Mode

Esta guía documenta la integración final del sistema de temas para el componente `BottomSheet`.

## 1. Concepto Core: "Agnostic Theming"

El componente **NO** tiene estilos hardcodeados. Utiliza **CSS Variables** con valores por defecto.
Esto significa que para cambiar su apariencia, solo necesitas redefinir esas variables en el contexto donde se usa el componente (generalmente en el `body`).

## 2. Variables Disponibles

| Variable                  | Descripción                     | Valor por Defecto              |
| ------------------------- | ------------------------------- | ------------------------------ |
| `--bsw-background`        | Color de fondo del panel        | `#ffffff`                      |
| `--bsw-box-shadow`        | Sombra del panel                | `0 -2px 20px rgba(0,0,0,0.15)` |
| `--bsw-border-radius`     | Radio de bordes superiores      | `16px`                         |
| `--bsw-handle-background` | Color del indicador de arrastre | `rgba(0,0,0,0.2)`              |
| `--bsw-close-btn-color`   | Color del icono cerrar          | `rgba(0,0,0,0.5)`              |

## 3. Integración con Frameworks (Dark Mode)

Si usas Quasar, Vuetify o Tailwind, probablemente ya tengas una clase en el `body` o `html` que indica el modo oscuro (ej. `.body--dark`, `.dark`, `[data-theme="dark"]`).

### El Patrón de Integración

En tu archivo CSS global (`app.css` o `App.vue`), agrega un bloque que escuche esa clase y redefina las variables.

**Ejemplo para Quasar (`body--dark`):**

```css
/* Cuando el body tiene la clase de modo oscuro */
body.body--dark {
	/* Fondo oscuro */
	--bsw-background: #121212;

	/* Handle más claro para contraste */
	--bsw-handle-background: rgba(255, 255, 255, 0.2);

	/* Textos e iconos claros */
	--bsw-close-btn-color: rgba(255, 255, 255, 0.7);
}
```

## 4. El Problema de las Sombras en Dark Mode

En modo oscuro, una sombra negra (`box-shadow`) sobre un fondo negro es **invisible**.

### ❌ Lo que NO funciona

```css
/* Sombra negra estándar */
--bsw-box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5); /* No se ve en fondo #121212 */
```

### ✅ La Solución Pro (Highlight)

Usamos `box-shadow` para simular un borde de luz (highlight) en la parte superior, además de la sombra difusa.

```css
body.body--dark {
	--bsw-box-shadow: 
    /* 1. Sombra negra difusa (para profundidad general) */
		0 -4px 30px rgba(0, 0, 0, 0.6),
		/* 2. Borde blanco interior de 1px (para definir el límite) */ 0 1px 0 0
			rgba(255, 255, 255, 0.1) inset;
}
```

Esta técnica crea una línea sutil brillante en el borde superior del panel, separándolo visualmente del fondo oscuro sin necesidad de usar bordes gruesos.

## 5. Glosario de Archivos Importantes

- `src/components/BottomSheet.vue`: Componente limpio. Solo usa `var(--variable, default)`.
- `src/composables/useTheme.ts`: Composable opcional para manejar temas globales manuales (Blue, Green, Gray).
- `src/App.vue`: Ejemplo en vivo que incluye la simulación de Quasar Dark Mode.
