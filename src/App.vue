<script setup lang="ts">
import { ref, watch, computed } from "vue";
import DynamicBottomSheet from "./components/DynamicBottomSheet.vue";
import FixedBottomSheet from "./components/FixedBottomSheet.vue";
import { useBottomSheetStack } from "./composables/useBottomSheetStack";

type UseCaseKey = "basic" | "collapsed" | "backdrop" | "custom";
type FixedCaseKey = "basic" | "customHeight" | "backdrop" | "customHeader";

const activeCase = ref<UseCaseKey>("basic");
const isOpen = ref(false);

const activeFixedCase = ref<FixedCaseKey>("basic");
const isFixedOpen = ref(false);

const { zIndex: zIndexDefault, register: registerDefault } = useBottomSheetStack();
const { zIndex: zIndexCollapsed, register: registerCollapsed } = useBottomSheetStack();
const { zIndex: zIndexBackdrop, register: registerBackdrop } = useBottomSheetStack();
const { zIndex: zIndexCustomSizes, register: registerCustomSizes } = useBottomSheetStack();

const { zIndex: zIndexFixedDefault, register: registerFixedDefault } = useBottomSheetStack();
const { zIndex: zIndexFixedCustomHeight, register: registerFixedCustomHeight } = useBottomSheetStack();
const { zIndex: zIndexFixedBackdrop, register: registerFixedBackdrop } = useBottomSheetStack();
const { zIndex: zIndexFixedHeader, register: registerFixedHeader } = useBottomSheetStack();

const openSelectedCase = () => {
  isOpen.value = true;
};

const closeCase = () => {
  isOpen.value = false;
};

const openFixedSelectedCase = () => {
  isFixedOpen.value = true;
};

const closeFixedCase = () => {
  isFixedOpen.value = false;
};

const caseModel = (key: UseCaseKey) =>
  computed({
    get: () => isOpen.value && activeCase.value === key,
    set: (value) => {
      if (!value) {
        isOpen.value = false;
      }
    },
  });

const fixedCaseModel = (key: FixedCaseKey) =>
  computed({
    get: () => isFixedOpen.value && activeFixedCase.value === key,
    set: (value) => {
      if (!value) {
        isFixedOpen.value = false;
      }
    },
  });

const openDefault = caseModel("basic");
const openCollapsed = caseModel("collapsed");
const openBackdrop = caseModel("backdrop");
const openCustomSizes = caseModel("custom");

const openFixedDefault = fixedCaseModel("basic");
const openFixedCustomHeight = fixedCaseModel("customHeight");
const openFixedBackdrop = fixedCaseModel("backdrop");
const openFixedHeader = fixedCaseModel("customHeader");

watch(openDefault, (newVal) => {
  if (newVal) registerDefault();
});
watch(openCollapsed, (newVal) => {
  if (newVal) registerCollapsed();
});
watch(openBackdrop, (newVal) => {
  if (newVal) registerBackdrop();
});
watch(openCustomSizes, (newVal) => {
  if (newVal) registerCustomSizes();
});

watch(openFixedDefault, (newVal) => {
  if (newVal) registerFixedDefault();
});
watch(openFixedCustomHeight, (newVal) => {
  if (newVal) registerFixedCustomHeight();
});
watch(openFixedBackdrop, (newVal) => {
  if (newVal) registerFixedBackdrop();
});
watch(openFixedHeader, (newVal) => {
  if (newVal) registerFixedHeader();
});
</script>

<template>
  <div class="app-container">
    <section class="case-section">
      <h1>Casos de uso dinámico</h1>
      <div class="selector">
        <button :class="['case-btn', { active: activeCase === 'basic' }]" @click="activeCase = 'basic'">
          Uso básico
        </button>
        <button :class="['case-btn', { active: activeCase === 'collapsed' }]" @click="activeCase = 'collapsed'">
          Contenido colapsado
        </button>
        <button :class="['case-btn', { active: activeCase === 'backdrop' }]" @click="activeCase = 'backdrop'">
          Backdrop y cierre
        </button>
        <button :class="['case-btn', { active: activeCase === 'custom' }]" @click="activeCase = 'custom'">
          Tamaños personalizados
        </button>
      </div>
      <button class="primary-btn" @click="openSelectedCase">
        Mostrar caso seleccionado
      </button>
    </section>

    <section class="case-section">
      <h1>Casos de uso fixed</h1>
      <div class="selector">
        <button :class="['case-btn', { active: activeFixedCase === 'basic' }]" @click="activeFixedCase = 'basic'">
          Auto altura
        </button>
        <button :class="['case-btn', { active: activeFixedCase === 'customHeight' }]"
          @click="activeFixedCase = 'customHeight'">
          Alto fijo
        </button>
        <button :class="['case-btn', { active: activeFixedCase === 'backdrop' }]"
          @click="activeFixedCase = 'backdrop'">
          Backdrop
        </button>
        <button :class="['case-btn', { active: activeFixedCase === 'customHeader' }]"
          @click="activeFixedCase = 'customHeader'">
          Header custom
        </button>
      </div>
      <button class="primary-btn" @click="openFixedSelectedCase">
        Mostrar caso seleccionado
      </button>
    </section>
  </div>

  <dynamic-bottom-sheet v-model="openDefault" title="Caso 1: Uso básico" :z-index="zIndexDefault">
    <div class="sheet-body">
      <h3>Uso básico</h3>
      <p>Sheet con tamaños por defecto y contenido estándar.</p>
      <button class="secondary-btn" @click="closeCase">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openCollapsed" title="Caso 2: Contenido colapsado" :z-index="zIndexCollapsed">
    <div class="sheet-body">
      <h3>Contenido completo</h3>
      <p>Al colapsar, se muestra el slot dedicado.</p>
      <button class="secondary-btn" @click="closeCase">Cerrar</button>
    </div>
    <template #collapsed-content>
      <div class="collapsed-preview">
        <span>Vista rápida</span>
        <button class="secondary-btn" @click="closeCase">Cerrar</button>
      </div>
    </template>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openBackdrop" title="Caso 3: Backdrop y cierre" :z-index="zIndexBackdrop" show-backdrop
    close-on-backdrop>
    <div class="sheet-body">
      <h3>Backdrop activo</h3>
      <p>Click en el fondo cierra el sheet.</p>
      <button class="secondary-btn" @click="closeCase">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openCustomSizes" title="Caso 4: Tamaños personalizados" :z-index="zIndexCustomSizes" 
    initial-size="half" half="35dvh" full="80dvh">
    <div class="sheet-body">
      <h3>Tamaños personalizados</h3>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <p>Half 35dvh y Full 80dvh.</p>
      <button class="secondary-btn" @click="closeCase">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <fixed-bottom-sheet v-model="openFixedDefault" title="Fixed 1: Auto altura" :z-index="zIndexFixedDefault">
    <div class="sheet-body">
      <h3>Auto altura</h3>
      <p>Se ajusta al contenido con tope 95dvh.</p>
      <button class="secondary-btn" @click="closeFixedCase">Cerrar</button>
    </div>
  </fixed-bottom-sheet>

  <fixed-bottom-sheet v-model="openFixedCustomHeight" title="Fixed 2: Alto fijo" :z-index="zIndexFixedCustomHeight"
    :height="360">
    <div class="sheet-body">
      <h3>Alto fijo</h3>
      <p>Altura forzada a 360px y contenido con scroll.</p>
      <div class="long-list">
        <div v-for="i in 10" :key="i" class="long-item">Item {{ i }}</div>
      </div>
      <button class="secondary-btn" @click="closeFixedCase">Cerrar</button>
    </div>
  </fixed-bottom-sheet>

  <fixed-bottom-sheet v-model="openFixedBackdrop" title="Fixed 3: Backdrop" :z-index="zIndexFixedBackdrop" show-backdrop>
    <div class="sheet-body">
      <h3>Backdrop</h3>
      <p>El fondo bloquea clics pero no cierra automáticamente.</p>
      <button class="secondary-btn" @click="closeFixedCase">Cerrar</button>
    </div>
  </fixed-bottom-sheet>

  <fixed-bottom-sheet v-model="openFixedHeader" :z-index="zIndexFixedHeader">
    <template #header>
      <div class="custom-header">
        <strong>Header personalizado</strong>
        <span>Fixed</span>
      </div>
    </template>
    <div class="sheet-body">
      <h3>Header custom</h3>
      <p>Slot header reemplaza el título por defecto.</p>
      <button class="secondary-btn" @click="closeFixedCase">Cerrar</button>
    </div>
  </fixed-bottom-sheet>
</template>

<style>
body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.app-container {
  margin: 0;
  padding: 24px 16px 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 10px;
}

.primary-btn {
  background: #111827;
  color: white;
}

.selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.case-btn {
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.08);
  color: #111827;
  border: 1px solid transparent;
}

.case-btn.active {
  background: #111827;
  color: white;
}

.secondary-btn {
  background: rgba(0, 0, 0, 0.08);
  color: #111827;
  padding: 8px 16px;
  border-radius: 8px;
}

.case-section {
  width: min(640px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.sheet-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collapsed-preview {
  padding: 12px 16px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  font-size: 14px;
  width: 100%;
}

.long-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.long-item {
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
}
</style>
