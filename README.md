# 📱 Bottom Sheet Wrappers

A flexible and powerful Vue 3 bottom sheet component designed specifically for **mobile devices** with native-like touch gesture support and multiple display modes. 

[![npm version](https://img.shields.io/npm/v/@coderoycc/bottom-sheet-wrappers.svg)](https://www.npmjs.com/package/@coderoycc/bottom-sheet-wrappers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 📱 **Mobile-First Design**: Built from the ground up for mobile devices with smooth 60fps animations and native-like touch interactions. <a href="https://coderoycc.github.io/bsw-demo/">Demo</a>

## ✨ Features

- 🎯 **Three Display Modes**: Dynamic, Auto-fit, and Fixed
- 👆 **Native Touch Gestures**: Smooth swipe, drag, and tap interactions optimized for mobile
- 🎨 **Customizable Backdrop**: Optional backdrop with configurable behavior
- 📱 **Mobile-First & Responsive**: Optimized for mobile devices, works great on desktop too
- 🔧 **TypeScript Support**: Full TypeScript definitions included
- 🪶 **Lightweight**: Minimal dependencies (only Vue 3)
- ♿ **Accessible**: Keyboard navigation and ARIA support ready
- ⚡ **Performant**: 60fps animations with GPU acceleration

## 📦 Installation

```bash
npm install @coderoycc/bottom-sheet-wrappers
```

Or with yarn:

```bash
yarn add @coderoycc/bottom-sheet-wrappers
```

Or with pnpm:

```bash
pnpm add @coderoycc/bottom-sheet-wrappers
```

## 🚀 Quick Start

### 1. Import the component and styles

```vue
<script setup>
import { ref } from 'vue'
import { BottomSheet } from '@coderoycc/bottom-sheet-wrappers'
import '@coderoycc/bottom-sheet-wrappers/dist/style.css'

const isOpen = ref(false)
</script>

<template>
  <button @click="isOpen = true">Open Bottom Sheet</button>
  
  <BottomSheet 
    v-model="isOpen"
    title="My Bottom Sheet"
    mode="dynamic"
  >
    <p>Your content here</p>
  </BottomSheet>
</template>
```

### 2. Register globally (optional)

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import BottomSheetPlugin from '@coderoycc/bottom-sheet-wrappers'
import '@coderoycc/bottom-sheet-wrappers/dist/style.css'

const app = createApp(App)
app.use(BottomSheetPlugin)
app.mount('#app')
```

## 🎭 Display Modes

### Dynamic Mode (Default)

The sheet can be resized by dragging between three sizes: small, medium, and large.

```vue
<BottomSheet 
  v-model="isOpen"
  mode="dynamic"
  initial-size="medium"
>
  <p>Swipe up or down to resize</p>
</BottomSheet>
```

**Behavior:**
- ✅ Swipe up/down to resize
- ✅ Click header to expand
- ✅ Backdrop collapses to small size
- ✅ Smart expansion (won't expand to large if content fits in medium)

### Auto-fit Mode

The sheet automatically adjusts its height to fit the content.

```vue
<BottomSheet 
  v-model="isOpen"
  mode="auto-fit"
  max-height="90vh"
>
  <p>Height adjusts automatically</p>
</BottomSheet>
```

**Behavior:**
- ✅ Height adjusts to content
- ✅ Swipe down to close
- ✅ Scrolls when content exceeds max-height
- ✅ Optional backdrop with close on click

### Fixed Mode

The sheet stays at a fixed height and cannot be resized.

```vue
<BottomSheet 
  v-model="isOpen"
  mode="fixed"
  initial-size="medium"
>
  <p>Fixed at 45% screen height</p>
</BottomSheet>
```

**Behavior:**
- ✅ Fixed height (small: header only, medium: 45vh, large: 95vh)
- ✅ Swipe down to close
- ✅ No resizing gestures
- ✅ No backdrop

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Controls visibility (v-model) |
| `mode` | `'dynamic' \| 'auto-fit' \| 'fixed'` | `'dynamic'` | Display mode |
| `initialSize` | `'small' \| 'medium' \| 'large'` | `'small'` | Initial size (dynamic/fixed modes) |
| `title` | `string` | `''` | Header title |
| `maxHeight` | `string` | `'95vh'` | Maximum height (auto-fit mode) |
| `showCloseButton` | `boolean` | `true` | Show close button in header |
| `showBackdrop` | `boolean` | `false` | Show semi-transparent backdrop |
| `closeOnBackdrop` | `boolean` | `false` | Close when clicking backdrop (auto-fit mode) |
| `persistent` | `boolean` | `false` | Prevent closing |
| `zIndex` | `number` | `9000` | Z-index of the sheet |
| `component` | `Component` | `undefined` | Dynamic component to render |
| `props` | `object` | `{}` | Props for dynamic component |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when visibility changes |
| `opened` | - | Emitted when sheet is fully opened |
| `closed` | - | Emitted when sheet is fully closed |
| `close` | - | Emitted when close is triggered |
| `size-change` | `'small' \| 'medium' \| 'large'` | Emitted when size changes (dynamic mode) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Main content area |
| `header` | Custom header content (replaces title) |

### Exposed Methods

```vue
<script setup>
import { ref } from 'vue'

const sheetRef = ref()

function openSheet() {
  sheetRef.value.open()
}

function closeSheet() {
  sheetRef.value.close()
}

function resizeToLarge() {
  sheetRef.value.animateToSize('large')
}
</script>

<template>
  <BottomSheet ref="sheetRef" />
</template>
```

| Method | Parameters | Description |
|--------|------------|-------------|
| `open()` | - | Open the sheet |
| `close()` | - | Close the sheet |
| `animateToSize(size)` | `'small' \| 'medium' \| 'large'` | Resize to specific size (dynamic mode only) |

## 🎨 Styling

### Custom Styles

You can override the default styles using CSS variables or by targeting the component classes:

```css
/* Custom backdrop opacity */
.bottom-sheet-backdrop--visible {
  background: rgba(0, 0, 0, 0.6) !important;
}

/* Custom panel background */
.bottom-sheet-panel {
  background: linear-gradient(to bottom, #ffffff, #f5f5f5) !important;
}

/* Custom handle color */
.bottom-sheet-handle {
  background: #007bff !important;
}
```

### Dark Mode

```vue
<BottomSheet 
  v-model="isOpen"
  class="dark-mode"
>
  <p>Content</p>
</BottomSheet>

<style>
.dark-mode .bottom-sheet-panel {
  background: #1a1a1a;
  color: #ffffff;
}
</style>
```

## 🔧 Advanced Usage

### Dynamic Component Rendering

```vue
<script setup>
import { ref, markRaw } from 'vue'
import MyComponent from './MyComponent.vue'

const isOpen = ref(false)
const dynamicComponent = markRaw(MyComponent)
const componentProps = { userId: 123 }
</script>

<template>
  <BottomSheet 
    v-model="isOpen"
    :component="dynamicComponent"
    :props="componentProps"
  />
</template>
```

### Custom Header

```vue
<BottomSheet v-model="isOpen">
  <template #header>
    <div class="custom-header">
      <h2>Custom Title</h2>
      <button @click="doSomething">Action</button>
    </div>
  </template>
  
  <p>Content</p>
</BottomSheet>
```

### Backdrop Behavior by Mode

```vue
<!-- Dynamic: Backdrop collapses to small -->
<BottomSheet 
  v-model="isOpen"
  mode="dynamic"
  :show-backdrop="true"
/>

<!-- Auto-fit: Backdrop closes sheet -->
<BottomSheet 
  v-model="isOpen"
  mode="auto-fit"
  :show-backdrop="true"
  :close-on-backdrop="true"
/>

<!-- Fixed: No backdrop -->
<BottomSheet 
  v-model="isOpen"
  mode="fixed"
/>
```

## 🏗️ Architecture

The component is built with clean code principles and uses Vue 3 Composition API with composables:

- `useModeDetection` - Determines effective display mode
- `useSizeCalculation` - Calculates sizes and styles
- `useGestureHandling` - Manages touch gestures
- `useBackdropInteraction` - Controls backdrop behavior
- `useContentScroll` - Tracks scroll position
- `useResizeObservers` - Observes element dimensions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**coderoycc**

- GitHub: [@coderoycc](https://github.com/coderoycc)
- npm: [@coderoycc](https://www.npmjs.com/~coderoycc)

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- Bundled with [Vite](https://vitejs.dev/)

---

Made with ❤️ by coderoycc
