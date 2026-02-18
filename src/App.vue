<script setup lang="ts">
import { ref, watch } from "vue";
import BottomSheet from "./components/BottomSheet.vue";
import { useBottomSheetStack } from "./composables/useBottomSheetStack";
import { useTheme, type Theme } from "./composables/useTheme";
import FixedBottomSheet from "./components/FixedBottomSheet.vue";
import DynamicBottomSheet from "./components/DynamicBottomSheet.vue";

const isOpen = ref(false);
const openFixed = ref(false);
const openDynamic = ref(false);
const isCustomOpen = ref(false);
const mode = ref<"dynamic" | "auto-fit" | "fixed">("fixed");
const title = ref("Dynamic");

// Sistema de temas global
const { currentTheme, setTheme } = useTheme();

// Simulación integración Quasar (o cualquier framework)
const isQuasarDark = ref(false);
const toggleQuasarDark = () => {
  isQuasarDark.value = !isQuasarDark.value;
  // Simula lo que hace Quasar: poner clase en body
  document.body.classList.toggle('body--dark', isQuasarDark.value);
};

// Sistema de apilamiento automático
const { zIndex: zIndex1, register: register1 } = useBottomSheetStack();
const { zIndex: zIndex2, register: register2 } = useBottomSheetStack();

// Registrar z-index cuando se abre cada sheet
watch(isOpen, (newVal) => {
  if (newVal) register1();
});

watch(isCustomOpen, (newVal) => {
  if (newVal) register2();
});
const close = () => {
  isOpen.value = false
}
const onClose = () => {
  console.log('Quiere cerrar')
}
</script>

<template>
  <div class="app-container">
    <h1>Bottom Sheet Global Themes</h1>

    <div class="controls-wrapper">
      <!-- Sección de Simulación de Framework -->
      <div class="control-group"
        style="padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.1); width: 100%;">
        <label>Framework:</label>
        <button @click="toggleQuasarDark" :style="{
          background: isQuasarDark ? '#333' : '#e0e0e0',
          color: isQuasarDark ? 'white' : 'black',
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px'
        }">
          <span>{{ isQuasarDark ? '🌙' : '☀️' }}</span>
          <span>{{ isQuasarDark ? 'Quasar Dark' : 'Quasar Light' }}</span>
        </button>
      </div>

      <div class="control-group">
        <label>Mode:</label>
        <select v-model="mode">
          <option value="dynamic">Dynamic</option>
          <option value="auto-fit">Auto-Fit</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>

      <button @click="close">HOla</button>
      <div class="control-group">
        <label>Global Theme:</label>
        <select :value="currentTheme" @change="e => setTheme((e.target as HTMLSelectElement).value as Theme)">
          <option value="blue">Blue (Default)</option>
          <option value="green">Light Green</option>
          <option value="gray">Professional Gray</option>
        </select>
      </div>
    </div>

    <div class="buttons-container">
      <button @click="isOpen = true">Open Default Sheet</button>
      <button @click="isCustomOpen = true" class="custom-button">Open Custom Sheet</button>
    </div>
    <div class="buttons-container">
      <button @click="openFixed = true" class="custom-button">Open fixed</button>
      <button @click="openDynamic = true" class="custom-button">Open dynamic</button>
    </div>

    <!-- BottomSheet original -->
    <BottomSheet v-model="isOpen" :mode="mode" :title="`${title} Example`" show-close-button
      :show-backdrop="mode === 'dynamic' || mode === 'auto-fit'" :close-on-backdrop="mode === 'auto-fit'"
      initial-size="medium" :z-index="9000">
      <div class="sheet-content">
        <div class="content-section">
          <h4>
            {{ mode.charAt(0).toUpperCase() + mode.slice(1) }} Mode Features
          </h4>

          <ul v-if="mode === 'dynamic'" class="feature-list">
            <li>✅ Swipe up/down to resize between small, medium, and large</li>
            <li>✅ Click header to expand to next size</li>
            <li>✅ Backdrop collapses to small size when clicked</li>
            <li>✅ Smart expansion logic</li>
            <li>✅ Smooth animations</li>
          </ul>

          <ul v-else-if="mode === 'auto-fit'" class="feature-list">
            <li>✅ Height automatically adjusts to content</li>
            <li>✅ Swipe down to close</li>
            <li>✅ Perfect for dynamic content</li>
          </ul>

          <ul v-else class="feature-list">
            <li>✅ Fixed height at 45% screen height</li>
            <li>✅ Swipe down to close</li>
            <li>✅ No resizing gestures</li>
          </ul>
        </div>
      </div>
    </BottomSheet>

    <!-- BottomSheet con estilos personalizados -->
    <BottomSheet v-model="isCustomOpen" mode="fixed" initial-size="medium" :z-index="9000">
      <template #header>
        <div class="custom-header">
          <span class="custom-icon">🎨</span>
          <h2 class="custom-title">Custom Sheet</h2>
        </div>
      </template>

      <div class="custom-content">
        <h3>Inherits Global Theme</h3>
        <p>This sheet overrides some styles but still respects the global theme foundation if configured to do so.</p>

        <div class="custom-actions">
          <button class="action-btn primary">Main Action</button>
          <button class="action-btn secondary">Cancel</button>
        </div>
      </div>
    </BottomSheet>

    <fixed-bottom-sheet v-model="openFixed" title="Un nuevo titulo simple fixed" @before-close="onClose" show-backdrop :height="500">
      <div class="content" style="border: 1px solid red">
        <ul>
          <li v-for="i in 15" :key="i">Item {{ i }}</li>
        </ul>
        <div><button>Aceptar</button></div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi commodi earum maiores et veniam nesciunt quam? Incidunt, rem quia, hic minus corrupti exercitationem magni perferendis in autem beatae eligendi laboriosam.</div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi commodi earum maiores et veniam nesciunt quam? Incidunt, rem quia, hic minus corrupti exercitationem magni perferendis in autem beatae eligendi laboriosam.</p>
        <div><button @click="openFixed = false">cerrar</button></div>
      </div>
    </fixed-bottom-sheet>
    <dynamic-bottom-sheet v-model="openDynamic" title="Un nuevo titulo simple dynamic">
      <div>
        <ul>
          <ol v-for="i in 15" :key="i">Item {{ i }}</ol>
        </ul>
      </div>
      <div class="">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi rem, nam nostrum doloremque voluptatum at facere quisquam porro laudantium ea accusamus, nemo cum maxime deleniti numquam in consectetur beatae ut.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi rem, nam nostrum doloremque voluptatum at facere quisquam porro laudantium ea accusamus, nemo cum maxime deleniti numquam in consectetur beatae ut.</p>
        <div class="action-buttons">
              <button class="btn-action primary">
                <span class="icon">↱</span> Indicaciones
              </button>
              <button class="btn-icon">
                <span class="icon">📞</span> Llamar
              </button>
              <button class="btn-icon">
                <span class="icon">🏢</span> Directorio
              </button>
            </div>
      </div>
      <template #collapsed-content>
        <div class="bs-header">
          <!-- <div class="header-content"> -->
            
            <div class="action-buttons">
              <button class="btn-action primary">
                <span class="icon">↱</span> Indicaciones
              </button>
              <button class="btn-icon">
                <span class="icon">📞</span> Llamar
              </button>
              <button class="btn-icon">
                <span class="icon">🏢</span> Directorio
              </button>
            </div>
          <!-- </div> -->
        </div>
      </template>
    </dynamic-bottom-sheet>
  </div>
</template>

<style>
.bs-header {
  background-color: #0d2129; /* Color oscuro de la captura */
  color: white;
  padding: 8px 16px 16px 16px;
  border-radius: 24px 24px 0 0;
  font-family: 'Roboto', sans-serif;
}

.drag-handle {
  width: 40px;
  height: 4px;
  background-color: #5f6368;
  border-radius: 2px;
  margin: 0 auto 12px auto;
}

.place-title {
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons {
  display: flex;
  gap: 12px;
  overflow-x: auto; /* Para scroll horizontal si hay muchos botones */
}

.btn-action {
  background-color: #8ab4f8; /* Azul claro Google */
  color: #202124;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  background-color: #17313a;
  color: #8ab4f8;
  border: 1px solid #3c4043;
  padding: 10px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.xborde {
  border: 1px solid red;
}
/* Theme: Blue (Default) */
.theme-blue {
  --bsw-background: #ffffff;
  --bsw-border-radius: 2px;
  --bsw-box-shadow: 0 -4px 30px rgba(30, 58, 138, 0.15);
  --bsw-handle-background: rgba(30, 64, 175, 0.2);
  --bsw-handle-width: 40px;
  --bsw-handle-height: 4px;
  --bsw-handle-border-radius: 2px;
  --bsw-close-btn-color: rgba(30, 64, 175, 0.6);
  --bsw-close-btn-hover-color: #1e3a8a;

  /* App Background for context */
  background-color: #eff6ff;
  color: #1e3a8a;
}

/* Theme: Green (Light Nature) */
.theme-green {
  --bsw-background: #f0fdf4;
  --bsw-border-radius: 2px;
  --bsw-box-shadow: 0 -4px 30px rgba(21, 128, 61, 0.15);
  --bsw-handle-background: rgba(21, 128, 61, 0.3);
  --bsw-handle-width: 60px;
  --bsw-handle-height: 5px;
  --bsw-handle-border-radius: 4px;
  --bsw-close-btn-color: rgba(22, 101, 52, 0.7);
  --bsw-close-btn-hover-color: #14532d;

  /* App Background for context */
  background-color: #f0fdf4;
  color: #14532d;
}

/* Theme: Gray (Professional) */
.theme-gray {
  --bsw-background: #ffffff;
  --bsw-border-radius: 8px;
  /* Sharp professional look */
  --bsw-box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  --bsw-handle-background: rgba(75, 85, 99, 0.3);
  --bsw-handle-width: 32px;
  --bsw-handle-height: 4px;
  --bsw-handle-border-radius: 2px;
  --bsw-close-btn-color: #4b5563;
  --bsw-close-btn-hover-color: #111827;

  /* App Background for context */
  background-color: #f9fafb;
  color: #111827;
}

/* ============================================================================
   App Layout & Controls
   ============================================================================ */
.app-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  transition: color 0.3s;
}

.controls-wrapper {
  background: rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.control-group label {
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}

select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;
}

.buttons-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

button {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  transition: transform 0.1s, opacity 0.2s;
}

button:active {
  transform: translateY(1px);
}

.primary-btn {
  background: currentColor;
  color: white;
  /* Doesnt work directly with currentColor bg, but implies logic */
  opacity: 0.9;
}

/* Helper to invert color for primary button text based on theme */
.theme-blue .primary-btn {
  background: #1e3a8a;
  color: white;
}

.theme-green .primary-btn {
  background: #15803d;
  color: white;
}

.theme-gray .primary-btn {
  background: #111827;
  color: white;
}

.secondary-btn {
  background: rgba(0, 0, 0, 0.05);
  color: currentColor;
}

.sheet-content {
  padding: 0 16px 32px;
}

.content-section {
  margin-bottom: 24px;
  text-align: left;
}

.content-section h4 {
  margin: 0 0 12px;
  opacity: 0.8;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 8px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-list li {
  font-size: 14px;
  opacity: 0.9;
}

/* Custom Sheet Styles */
.custom-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -8px -8px 0;
  border-radius: 16px 16px 0 0;
  background: rgba(0, 0, 0, 0.03);
  /* Subtle bg to distinguish header */
  width: 100%;
}

.custom-title {
  margin: 0;
  font-size: 18px;
}

.custom-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
}

.action-btn.primary {
  background: red;
  /* Overridden below */
}

/* Theme-aware inner styles */
.theme-blue .action-btn.primary {
  background: #1e3a8a;
  color: white;
}

.theme-green .action-btn.primary {
  background: #15803d;
  color: white;
}

.theme-gray .action-btn.primary {
  background: #111827;
  color: white;
}

/* ============================================================================
   Custom Sheet Overrides (Demonstrates local override of global theme)
   ============================================================================ */
.custom-sheet .bsw-bottom-sheet-panel {
  --bsw-background: linear-gradient(135deg, #fefcd0 0%, #fef3c7 100%);
  --bsw-border-radius: 24px;
  --bsw-box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.1);
  /* Note: It will still inherit other variables like handle size from global theme */
}

/* Custom header specific override */
.custom-header {
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
  color: white;
}

/* ============================================================================
   QUASAR SIMULATION: Dark Mode Bridge
   ============================================================================ */
/* 
   Esto simula lo que harías en tu app.scss global.
   Cuando Quasar agrega clase "body--dark", nosotros re-mapeamos las variables.
*/
body.body--dark {
  /* Fondo oscuro (Simulando --q-dark-page) */
  --bsw-background: #121212;

  /* Handle más claro para contraste */
  --bsw-handle-background: rgba(255, 255, 255, 0.2);

  /* Textos e iconos */
  --bsw-close-btn-color: rgba(255, 255, 255, 0.7);
  --bsw-close-btn-hover-color: #ffffff;

  /* 
     TRUCO PRO PARA DARK MODE:
     Las sombras negras no se ven en fondos negros.
     Solución: Agregamos un borde sutil blanco (1px) usando box-shadow combinado.
     1. Sombra negra profunda: 0 -4px 30px rgba(0,0,0,0.5)
     2. Borde sutil (highlight): 0 1px 0 0 rgba(255,255,255,0.1) inset (o spread positivo)
  */
  --bsw-box-shadow:
    0 -4px 30px rgba(0, 0, 0, 0.6),
    /* Sombra difusa */
    0 1px 0 0 rgba(255, 255, 255, 0.1) inset;
  /* Borde interior sutil (Top Highlight) */

  /* App Context Styles (Solo para el demo) */
  background-color: #121212 !important;
  /* Force override themes */
  color: #ffffff !important;
}

/* Ajustes visuales de demo para el contenido en modo oscuro */
body.body--dark .sheet-content,
body.body--dark .content-section,
body.body--dark .feature-list li,
body.body--dark h4 {
  color: #e0e0e0;
  border-color: rgba(255, 255, 255, 0.1);
}

body.body--dark .sample-item {
  background: #1e1e1e;
}

body.body--dark .sample-item:hover {
  background: #2d2d2d;
}

body.body--dark .item-title {
  color: #fff;
}

body.body--dark .item-subtitle {
  color: #aaa;
}
</style>
