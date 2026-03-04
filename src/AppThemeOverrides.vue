<script setup lang="ts">
import { ref, watchEffect } from "vue";
import DynamicBottomSheet from "./components/DynamicBottomSheet.vue";
import FixedBottomSheet from "./components/FixedBottomSheet.vue";
import { useBottomSheetStack } from "./composables/useBottomSheetStack";

type ThemeKey = "default" | "rounded" | "dark" | "soft";

const theme = ref<ThemeKey>("default");

const openDynamic = ref(false);
const openFixed = ref(false);
const openLocal = ref(false);

const { zIndex: zIndexDynamic, register: registerDynamic } = useBottomSheetStack();
const { zIndex: zIndexFixed, register: registerFixed } = useBottomSheetStack();
const { zIndex: zIndexLocal, register: registerLocal } = useBottomSheetStack();

watchEffect(() => {
  document.body.classList.remove("theme-default", "theme-rounded", "theme-dark", "theme-soft");
  document.body.classList.add(`theme-${theme.value}`);
});

watchEffect(() => {
  if (openDynamic.value) registerDynamic();
});
watchEffect(() => {
  if (openFixed.value) registerFixed();
});
watchEffect(() => {
  if (openLocal.value) registerLocal();
});
</script>

<template>
  <div class="theme-demo">
    <h1>Overrides de estilos</h1>
    <div class="theme-controls">
      <button :class="{ active: theme === 'default' }" @click="theme = 'default'">Default</button>
      <button :class="{ active: theme === 'rounded' }" @click="theme = 'rounded'">Rounded</button>
      <button :class="{ active: theme === 'dark' }" @click="theme = 'dark'">Dark</button>
      <button :class="{ active: theme === 'soft' }" @click="theme = 'soft'">Soft</button>
    </div>
    <div class="demo-actions">
      <button class="primary-btn" @click="openDynamic = true">Dynamic global</button>
      <button class="primary-btn" @click="openFixed = true">Fixed global</button>
      <button class="primary-btn" @click="openLocal = true">Override local</button>
    </div>
  </div>

  <dynamic-bottom-sheet v-model="openDynamic" title="Dynamic con tema global" :z-index="zIndexDynamic">
    <div class="sheet-body">
      <h3>Theme global</h3>
      <p>Las variables CSS se aplican desde el body.</p>
      <button class="secondary-btn" @click="openDynamic = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <fixed-bottom-sheet v-model="openFixed" title="Fixed con tema global" :z-index="zIndexFixed">
    <div class="sheet-body">
      <h3>Theme global</h3>
      <p>Border radius, fondo y handle cambian con el theme.</p>
      <button class="secondary-btn" @click="openFixed = false">Cerrar</button>
    </div>
  </fixed-bottom-sheet>

  <dynamic-bottom-sheet v-model="openLocal" title="Override local" :z-index="zIndexLocal" class="local-theme">
    <div class="sheet-body">
      <h3>Override local</h3>
      <p>Solo este sheet modifica sus variables.</p>
      <button class="secondary-btn" @click="openLocal = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.theme-demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px 16px 40px;
}

.theme-controls,
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

button {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn {
  background: #111827;
  color: white;
}

.secondary-btn {
  background: rgba(0, 0, 0, 0.08);
  color: #111827;
  padding: 8px 16px;
  border-radius: 8px;
}

.theme-controls button {
  background: rgba(0, 0, 0, 0.08);
  color: #111827;
}

.theme-controls button.active {
  background: #111827;
  color: white;
}

.sheet-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-default {
  --bsw-background: #ffffff;
  --bsw-border-radius: 16px;
  --bsw-box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.15);
  --bsw-handle-background: rgba(0, 0, 0, 0.2);
  --bsw-close-btn-color: rgba(0, 0, 0, 0.5);
  --bsw-close-btn-hover-color: rgba(0, 0, 0, 0.8);
  background: #f5f5f5;
  color: #111827;
}

.theme-rounded {
  --bsw-background: #ffffff;
  --bsw-border-radius: 28px;
  --bsw-box-shadow: 0 -10px 32px rgba(0, 0, 0, 0.18);
  --bsw-handle-background: rgba(17, 24, 39, 0.35);
  --bsw-handle-width: 56px;
  --bsw-handle-height: 6px;
  --bsw-handle-border-radius: 6px;
  background: #eef2ff;
  color: #111827;
}

.theme-dark {
  --bsw-background: #111827;
  --bsw-border-radius: 14px;
  --bsw-box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.5);
  --bsw-handle-background: rgba(255, 255, 255, 0.2);
  --bsw-close-btn-color: rgba(255, 255, 255, 0.7);
  --bsw-close-btn-hover-color: #ffffff;
  background: #0b0f19;
  color: #f9fafb;
}

.theme-soft {
  --bsw-background: #fff7ed;
  --bsw-border-radius: 20px;
  --bsw-box-shadow: 0 -6px 18px rgba(124, 45, 18, 0.2);
  --bsw-handle-background: rgba(124, 45, 18, 0.35);
  --bsw-close-btn-color: rgba(124, 45, 18, 0.7);
  --bsw-close-btn-hover-color: #7c2d12;
  background: #fff7ed;
  color: #7c2d12;
}

.local-theme {
  --bsw-background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
  --bsw-border-radius: 24px;
  --bsw-box-shadow: 0 -8px 28px rgba(8, 145, 178, 0.25);
  --bsw-handle-background: rgba(8, 145, 178, 0.4);
  --bsw-close-btn-color: rgba(8, 145, 178, 0.8);
  --bsw-close-btn-hover-color: #0e7490;
}
</style>
