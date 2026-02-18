# Integración con Quasar Framework

Este componente está diseñado para ser **agnóstico** pero **altamente integrable**. No "sabe" que existe Quasar, pero habla el mismo idioma: **CSS Variables**.

## 🎯 El Concepto: "Puente de Variables"

Quasar ya maneja el modo oscuro agregando la clase `body--dark` al `<body>` y define colores como `--q-primary`, `--q-dark`, etc.
Solo necesitas decirle al BottomSheet: _"Oye, usa los colores de Quasar"_.

## 🛠️ Configuración Global (CSS)

Agrega esto en tu `app.scss` o `css` global. No necesitas tocar los componentes `.vue`.

### 1. Mapeo de Colores Base (Modo Claro)

```css
/* En modo claro (por defecto) */
:root {
	/* Conecta las variables del BottomSheet a las de Quasar */
	--bsw-background: #ffffff;
	--bsw-handle-background: var(--q-grey-4); /* Usar paleta de Quasar */
	--bsw-close-btn-color: var(--q-grey-7);
}
```

### 2. Mapeo de Modo Oscuro (Automático)

Cuando Quasar activa el modo oscuro (`$q.dark.set(true)`), agrega la clase `.body--dark`. Usamos eso para re-mapear las variables automáticamente.

```css
/* Cuando Quasar activa el modo oscuro */
body.body--dark {
	/* Fondo del panel = Fondo oscuro de Quasar */
	--bsw-background: var(--q-dark-page);

	/* Sombra más sutil para modo oscuro */
	--bsw-box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);

	/* Handle más claro */
	--bsw-handle-background: var(--q-grey-8);

	/* Botón cerrar claro */
	--bsw-close-btn-color: var(--q-grey-3);
	--bsw-close-btn-hover-color: #ffffff;
}
```

### 3. Temas de Marca (Primary/Secondary)

Si quieres que un BottomSheet específico use el color primario de tu marca (definido en `quasar.config.js`):

```css
/* Clase utilitaria para sheets con marca */
.sheet-primary {
	--bsw-background: var(--q-primary);
	--bsw-handle-background: rgba(255, 255, 255, 0.3);
	--bsw-close-btn-color: white;
	color: white;
}
```

Uso en Vue:

```vue
<BottomSheet class="sheet-primary"> ... </BottomSheet>
```

## 🚀 Resumen para el Desarrollador

1.  **No cambies el JS** del BottomSheet.
2.  **No pases props** de estilo.
3.  Simplemente **copia y pega el CSS de arriba** en tu archivo de estilos global.
4.  El BottomSheet responderá automáticamente a `$q.dark.toggle()`.
