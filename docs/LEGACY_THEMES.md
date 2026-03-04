# Respaldo de Implementación de Temas con Variables CSS y Clases

Este código muestra cómo se implementaron temas usando clases CSS (`.dark-theme`, `.blue-theme`) aplicadas individualmente a cada componente `BottomSheet`.

## App.vue (Estado Anterior)

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
import BottomSheet from "./components/BottomSheet.vue";
import { useBottomSheetStack } from "./composables/useBottomSheetStack";

const isOpen = ref(false);
const isCustomOpen = ref(false);
const isDarkOpen = ref(false);
const isBlueOpen = ref(false);
const mode = ref<"dynamic" | "auto-fit" | "fixed">("fixed");
const title = ref("Dynamic");

// ... lógica de apilamiento ...
</script>

<template>
	<div class="app-container">
		<!-- ... controles ... -->
		<button @click="isDarkOpen = true" class="dark-button">
			Open Dark Mode
		</button>
		<button @click="isBlueOpen = true" class="blue-button">
			Open Blue Theme
		</button>

		<!-- BottomSheet Dark Mode -->
		<BottomSheet
			v-model="isDarkOpen"
			mode="fixed"
			initial-size="medium"
			:z-index="zIndex3"
			class="dark-theme"
			show-close-button
			title="Dark Mode"
		>
			<!-- ... contenido ... -->
		</BottomSheet>

		<!-- BottomSheet Blue Theme -->
		<BottomSheet
			v-model="isBlueOpen"
			mode="fixed"
			initial-size="medium"
			:z-index="zIndex4"
			class="blue-theme"
			show-close-button
			title="Blue Theme"
		>
			<!-- ... contenido ... -->
		</BottomSheet>
	</div>
</template>

<style>
/* ============================================================================
   Dark Theme
   ============================================================================ */
.dark-theme .bsw-bottom-sheet-panel {
	--bsw-background: #1a1a1a;
	--bsw-box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.8);
	--bsw-border-radius: 20px;
	--bsw-handle-background: rgba(255, 255, 255, 0.3);
	--bsw-close-btn-color: rgba(255, 255, 255, 0.6);
	--bsw-close-btn-hover-color: rgba(255, 255, 255, 1);
}

/* ============================================================================
   Blue Theme
   ============================================================================ */
.blue-theme .bsw-bottom-sheet-panel {
	--bsw-background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
	--bsw-box-shadow: 0 -4px 30px rgba(30, 58, 138, 0.5);
	--bsw-border-radius: 24px;
	--bsw-handle-background: rgba(255, 255, 255, 0.4);
	--bsw-close-btn-color: rgba(255, 255, 255, 0.7);
	--bsw-close-btn-hover-color: #ffffff;
}
</style>
```
