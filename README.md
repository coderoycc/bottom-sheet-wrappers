# 📱 Bottom Sheet Wrappers

A flexible and powerful Vue 3 bottom sheet library designed specifically for **mobile devices** with native-like touch gesture support and two distinct display modes.

[![npm version](https://img.shields.io/npm/v/@coderoycc/bottom-sheet-wrappers.svg)](https://www.npmjs.com/package/@coderoycc/bottom-sheet-wrappers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 📱 **Mobile-First Design**: Built from the ground up for mobile devices with smooth 60fps animations and native-like touch interactions. <a href="https://coderoycc.github.io/bsw-demo/">Demo</a>

## ✨ Features

- 🎯 **Two Distinct Components**: `DynamicBottomSheet` (resizeable) and `FixedBottomSheet` (static height or auto-fit).
- 👆 **Native Touch Gestures**: Smooth swipe, drag, and tap interactions optimized for mobile.
- 🎨 **Customizable Backdrop**: Optional backdrop with configurable behavior.
- 📱 **Mobile-First & Responsive**: Optimized for mobile devices, works great on desktop too.
- 🔧 **TypeScript Support**: Full TypeScript definitions included.
- 🪶 **Lightweight**: Minimal dependencies (only Vue 3).
- ♿ **Accessible**: ARIA support and keyboard interaction ready.
- ⚡ **Performant**: 60fps animations with GPU acceleration.

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
import { ref } from "vue";
import { DynamicBottomSheet } from "@coderoycc/bottom-sheet-wrappers";
import "@coderoycc/bottom-sheet-wrappers/dist/bottom-sheet-wrappers.css";

const isOpen = ref(false);
</script>

<template>
	<button @click="isOpen = true">Open Bottom Sheet</button>

	<DynamicBottomSheet v-model="isOpen" title="My Bottom Sheet">
		<p>Your content here</p>
	</DynamicBottomSheet>
</template>
```

### 2. Register globally (optional)

```javascript
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import BottomSheetPlugin from "@coderoycc/bottom-sheet-wrappers";
import "@coderoycc/bottom-sheet-wrappers/dist/bottom-sheet-wrappers.css";

const app = createApp(App);
app.use(BottomSheetPlugin); // Make sure your plugin handles global registration
app.mount("#app");
```

## 🎭 Display Modes

The library consists of two main components acting as distinct modes to perfectly match your use case:

### 1. Dynamic Bottom Sheet (`DynamicBottomSheet`)

This mode allows the user to resize the sheet by dragging up or down between three size states: `collapsed`, `half`, and `full`. It supports a mini-player pattern out of the box.

```vue
<script setup>
import { ref } from 'vue';
import { DynamicBottomSheet } from '@coderoycc/bottom-sheet-wrappers';

const isDynamicOpen = ref(false);
</script>

<template>
  <DynamicBottomSheet 
    v-model="isDynamicOpen" 
    initial-size="half"
    half="45dvh"
    full="95dvh"
  >
    <p>Swipe up or down to resize content</p>

    <!-- Optional collaped slot for a mini-player/bar view -->
    <template #collapsed-content>
      <div>Now Playing...</div>
    </template>
  </DynamicBottomSheet>
</template>
```

**Behavior:**
- ✅ Swipe up/down to resize through specific snap points.
- ✅ Handles its own internal sizes accurately mapping to your UI expectations (`half`, `full`).
- ✅ Provides a seamless collapsed state for a "mini view" via `#collapsed-content` slot.
- ✅ Smart expansion boundaries that block accidental full expansion when limits are hit.

### 2. Fixed Bottom Sheet (`FixedBottomSheet`)

This mode maintains a fixed or auto-adjusted height (based on the content inside it) and **cannot be resized**, though the user can swipe down to close it. This mode perfectly covers both the strict **Fixed** size use-case and the **Auto-fit** use-case.

```vue
<script setup>
import { ref } from 'vue';
import { FixedBottomSheet } from '@coderoycc/bottom-sheet-wrappers';

const isFixedOpen = ref(false);
</script>

<template>
  <!-- Provide a specific height -->
  <FixedBottomSheet v-model="isFixedOpen" title="Fixed Sheet" height="50dvh">
    <p>Fixed at 50% screen height</p>
  </FixedBottomSheet>

  <!-- Or let it auto-adjust (auto-fit behavior) by omitting height -->
  <FixedBottomSheet v-model="isFixedOpen" title="Auto Sheet">
    <p>My height adjusts automatically to fit this content!</p>
  </FixedBottomSheet>
</template>
```

**Behavior:**
- ✅ Fixed height or Auto-Height fallback depending on the provided `height` prop.
- ✅ Swipe down on the handle to close directly.
- ✅ No internal resizing gestures enabled, maintaining focused view boundaries.

## 📚 API Reference

### DynamicBottomSheet

#### Props
| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `modelValue` | `boolean` | `false` | Controls visibility (`v-model`). |
| `title` | `string` | `''` | Header title string. |
| `initialSize` | `'collapsed' \| 'half' \| 'full'` | `'half'` | Starting size when the sheet opens. |
| `half` | `string` | `'45dvh'` | Height when mapped to the `half` size. |
| `full` | `string` | `'95dvh'` | Height when mapped to the `full` size. |
| `showCloseButton` | `boolean` | `true` | Show close icon button in the top right. |
| `showBackdrop` | `boolean` | `false` | Render a dark visual backdrop behind the sheet. |
| `closeOnBackdrop` | `boolean` | `false` | Auto-close the sheet when the user clicks the backdrop. |
| `persistent` | `boolean` | `false` | Prevent closing when clicking outside or backdrop. |
| `zIndex` | `number` | `1` | Added over a base `9000` context z-index layer. |

#### Events
| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when visibility changes. |
| `opened` | - | Emitted when sheet animation has finished and is fully open. |
| `closed` | - | Emitted when fully unloaded/closed. |
| `close` | - | Triggered right before closing starts. |
| `size-change` | `'collapsed' \| 'half' \| 'full'`| Emitted when the sheet switches to a new size mode. |

#### Methods & Slots
**Methods (via Template Ref):** `open()`, `close()`, `animateToSize(size)`
**Slots:** `#default`, `#header`, `#collapsed-content`

---

### FixedBottomSheet

#### Props
| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `modelValue` | `boolean` | `false` | Controls visibility (`v-model`). |
| `title` | `string` | `''` | Header title string. |
| `height` | `string \| number` | `undefined` | Forced static height. Omitting this makes it auto-fit the content inside. |
| `showBackdrop` | `boolean` | `false` | Render a dark visual backdrop. |
| `zIndex` | `number` | `0` | Added over a base `9000` context z-index layer. |
| `props` | `Record<string, any>` | `{}` | Additional payload object binding if needed. |

#### Events
| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when visibility changes. |
| `opened` | - | Emitted when sheet is fully created & mounted in active state. |
| `closed` | - | Emitted when fully unloaded/closed. |
| `before-close`| - | Emitted when the closing sequence begins. |

#### Methods & Slots
**Slots:** `#default`, `#header`

## 🎨 Styling

You can override the default styles using standard CSS variables or by targeting the component classes directly.

```css
/* Custom backdrop opacity */
.bsw-bottom-sheet-backdrop--visible {
	background: rgba(0, 0, 0, 0.75) !important;
}

/* Custom handle color */
.bsw-bottom-sheet-handle {
	background: #007bff !important;
}
```

### Dark Mode Support
The components naturally embrace CSS scopes for overrides, simply wrap components or nest logic within your specific theme identifiers:
```vue
<DynamicBottomSheet v-model="isOpen" class="my-dark-theme">
  <p>Content</p>
</DynamicBottomSheet>

<style>
.my-dark-theme .bsw-bottom-sheet-panel {
	background: #1a1a1a;
	color: #ffffff;
}
</style>
```

## 🏗️ Architecture

The library is built with clean code principles using Vue 3's Composition API structure:

- `DynamicBottomSheet` & `FixedBottomSheet` logic separated for specialized behavior.
- Use of internal composables (e.g., `useDynamicGestures`, `useFixedGestures`, `useAutoHeight`) to decouple gesture tracking and size orchestration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**coderoycc**

- GitHub: [@coderoycc](https://github.com/coderoycc)
- npm: [@coderoycc](https://www.npmjs.com/~coderoycc)

---

Made with ❤️ by coderoycc
