# Sistema de Temas Global

Se ha implementado un sistema de temas centralizado que permite cambiar la apariencia de **toda la aplicación** instantáneamente.

## 🚀 Cómo Funciona

1.  **Selector Global**: En la interfaz principal existe un selector que permite elegir entre:
    - 🔵 **Blue (Default)**: Tema azul corporativo.
    - 🟢 **Green (Light Nature)**: Tema verde fresco y natural.
    - ⚪ **Gray (Professional)**: Tema monocromático y minimalista.

2.  **Cambio Instantáneo**: Al seleccionar un tema, **todos** los BottomSheets (abiertos o cerrados) adoptan el nuevo estilo inmediatamente.

3.  **Arquitectura**:
    - Un composable `useTheme` inyecta una clase en el `<body>` (`theme-blue`, `theme-green`, etc.).
    - Las variables CSS se definen globalmente bajo estas clases.
    - Los componentes heredan estas variables automáticamente.

## 🛠️ Cómo Agregar Nuevos Temas

Simplemente define las variables en tu CSS global:

```css
/* Nuevo Tema: Rojo */
.theme-red {
	--bsw-background: #fff1f2;
	--bsw-handle-background: rgba(225, 29, 72, 0.2);
	--bsw-close-btn-color: #e11d48;
	/* ... otras variables ... */
}
```

Y agrégalo al selector en `App.vue`.

## 🎨 Sobrescritura (Custom Sheets)

Aún puedes crear sheets "únicos" que ignoren el tema global si lo deseas. El ejemplo "Custom Sheet" muestra cómo hacerlo:

```css
/* Sobrescribe el tema global solo para este componente */
.custom-sheet .bsw-bottom-sheet-panel {
	--bsw-background: linear-gradient(...);
}
```
