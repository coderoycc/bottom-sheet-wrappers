<script setup lang="ts">
import { ref, watchEffect } from "vue";
import DynamicBottomSheet from "./components/DynamicBottomSheet.vue";
import SimpleBottomSheet from "./components/SimpleBottomSheet.vue";

type ThemeKey = "default" | "rounded" | "dark" | "soft";

const theme = ref<ThemeKey>("default");

const openAutoShort = ref(false);
const openAutoLong = ref(false);
const openFixedShort = ref(false);
const openFixedFull = ref(false);
const openBackdropClose = ref(false);
const openBackdropNoClose = ref(false);
const openPersistent = ref(false);
const openHiddenElements = ref(false);
const openEvents = ref(false);

const openDynHalf = ref(false);
const openDynFull = ref(false);
const openDynCollapsed = ref(false);
const openDynCustomSizes = ref(false);
const openDynBackdrop = ref(false);
const openDynNoBackdrop = ref(false);
const openDynHeaderSlot = ref(false);
const openDynHideElements = ref(false);
const openDynEvents = ref(false);
const dynCurrentSize = ref("–");
const dynLastEvent = ref("–");
const openDynTheme = ref(false);
const openDynLocal = ref(false);

const handleSimpleEvent = (eventName: string) => {
  console.log(`[SimpleBottomSheet Event] ${eventName}`);
};

const handleDynEvent = (eventName: string) => {
  dynLastEvent.value = eventName;
  console.log(`[DynamicBottomSheet Event] ${eventName}`);
};

watchEffect(() => {
  document.body.classList.remove("theme-default", "theme-rounded", "theme-dark", "theme-soft");
  document.body.classList.add(`theme-${theme.value}`);
});
</script>

<template>
  <div class="theme-demo">
    <h2 style="margin-top: 32px; margin-bottom: 4px;">SimpleBottomSheet</h2>

    <h3 style="margin-bottom: 5px;">1. Alturas</h3>
    <div class="demo-actions">
      <button class="primary-btn" @click="openAutoShort = true">Auto (Contenido corto)</button>
      <button class="primary-btn" @click="openAutoLong = true">Auto (Contenido largo)</button>
      <button class="primary-btn" @click="openFixedShort = true">Fija (300px)</button>
      <button class="primary-btn" @click="openFixedFull = true">Fija (90vh)</button>
    </div>

    <h3 style="margin-bottom: 5px; margin-top: 20px;">2. Gestos y Comportamientos</h3>
    <div class="demo-actions">
      <button class="primary-btn" @click="openBackdropClose = true">Backdrop Normal</button>
      <button class="primary-btn" @click="openBackdropNoClose = true">No cierra al click</button>
      <button class="primary-btn" @click="openPersistent = true">Persistent</button>
    </div>

    <h3 style="margin-bottom: 5px; margin-top: 20px;">3. Personalización y Eventos</h3>
    <div class="demo-actions">
      <button class="primary-btn" @click="openHiddenElements = true">Elementos Ocultos</button>
      <button class="primary-btn" @click="openEvents = true">Test Eventos (Consola)</button>
    </div>

    <h2 style="margin-top: 40px; margin-bottom: 4px;">DynamicBottomSheet</h2>

    <h3 style="margin-bottom: 5px;">1. Tamaños y initialSize</h3>
    <div class="demo-actions">
      <button class="primary-btn" @click="openDynHalf = true">Inicia en Half (45dvh)</button>
      <button class="primary-btn" @click="openDynFull = true">Inicia en Full (95dvh)</button>
      <button class="primary-btn" @click="openDynCollapsed = true">Inicia Colapsado</button>
      <button class="primary-btn" @click="openDynCustomSizes = true">Tamaños personalizados</button>
    </div>

    <h3 style="margin-bottom: 5px; margin-top: 20px;">2. Comportamientos</h3>
    <div class="demo-actions">
      <button class="primary-btn" @click="openDynBackdrop = true">Con Backdrop</button>
      <button class="primary-btn" @click="openDynNoBackdrop = true">Sin Backdrop (click fuera = colapsar)</button>
    </div>

    <h3 style="margin-bottom: 5px; margin-top: 20px;">3. Personalización</h3>
    <div class="demo-actions">
      <button class="primary-btn" @click="openDynHeaderSlot = true">Slot #header y #collapsed-content</button>
      <button class="primary-btn" @click="openDynHideElements = true">Sin handle ni close btn</button>
    </div>

    <h3 style="margin-bottom: 5px; margin-top: 20px;">4. Eventos</h3>
    <p style="font-size: 13px; margin: 0;">Último evento: <code>{{ dynLastEvent }}</code> &nbsp;|&nbsp; Tamaño actual:
      <code>{{ dynCurrentSize }}</code></p>
    <div class="demo-actions">
      <button class="primary-btn" @click="openDynEvents = true">Monitor de Eventos</button>
    </div>

    <h3 style="margin-bottom: 5px; margin-top: 20px;">5. Temas</h3>
    <div class="theme-controls" style="margin-bottom: 8px;">
      <button :class="{ active: theme === 'default' }" @click="theme = 'default'">Default</button>
      <button :class="{ active: theme === 'rounded' }" @click="theme = 'rounded'">Rounded</button>
      <button :class="{ active: theme === 'dark' }" @click="theme = 'dark'">Dark</button>
      <button :class="{ active: theme === 'soft' }" @click="theme = 'soft'">Soft</button>
    </div>
    <div class="demo-actions">
      <button class="primary-btn" @click="openDynTheme = true">Tema Global</button>
      <button class="primary-btn" @click="openDynLocal = true">Override Local</button>
    </div>

  </div>

  <simple-bottom-sheet v-model="openAutoShort" title="Auto Height (Corto)">
    <div class="sheet-body">
      <p>La altura se ajusta automáticamente a su contenido.</p>
      <p>Arrastra hacia abajo (swipe-down) desde la cabecera o desde cualquier parte vacía del contenido para probar el
        gesto de cierre natural.</p>
      <button class="secondary-btn" @click="openAutoShort = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openAutoLong" title="Auto Height (Largo / Scroll)">
    <div class="sheet-body">
      <p>Este panel crece dinámicamente según su contenido pero está <strong>topado hasta un máximo (generalmente
          95dvh)</strong> para llenar la pantalla sin taparla del todo.</p>
      <p>Prueba estos gestos clave para entender cómo convive el touch con el scroll:</p>
      <ul style="padding-left: 20px;">
        <li><strong>Swipe desde la cabecera:</strong> Siempre cerrará el panel independientemente del resto.</li>
        <li><strong>Swipe desde el contenido <i>(Estando Arriba del todo)</i>:</strong> Procederá a cerrarlo.</li>
        <li><strong>Scroll hacia abajo en el modal:</strong> Notarás que navegas sobre este contenido interno.</li>
        <li><strong>Swipe desde el centro del texto:</strong> El panel NO se cerrará; en cambio, el contenido hará
          scroll naturalmente de regreso a la parte superior.</li>
      </ul>
      <p v-for="i in 40" :key="i">Texto y contenido de relleno para forzar scroll interno #{{ i }}</p>
      <button class="secondary-btn" @click="openAutoLong = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openFixedShort" title="Fixed Height (300px)" height="300px">
    <div class="sheet-body">
      <p>La altura fue forzada a <code>300px</code> estáticos.</p>
      <p>Aunque no tenga gran cantidad de contenido para llenarlo, el panel preservará siempre este tamaño absoluto
        fijado, manteniendo vivas las reglas de cierre.</p>
      <button class="secondary-btn" @click="openFixedShort = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openFixedFull" title="Fixed Height (90vh)" height="90vh">
    <div class="sheet-body">
      <p>Altura explícitamente forzada a <code>90vh</code>.</p>
      <p>Igual que el Auto Height con scroll, este generará overflow interno si superas el tamaño. Sus gestos priorizan
        siempre respetar la inercia del scroll y cortan el arrastre del borde a menos que te encuentres pegado a la
        parte superior.</p>
      <p v-for="i in 15" :key="i">Relleno de comprobación constante # {{ i }}</p>
      <button class="secondary-btn" @click="openFixedFull = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openBackdropClose" title="Cierra en el Backdrop" show-backdrop>
    <div class="sheet-body">
      <p>El uso estándar para aislar atención: aparece una sombra sobre el fondo de tu página.</p>
      <p>Si presionas o pulsas con el ratón en ella, el panel reaccionará a él y se cerrará.</p>
      <button class="secondary-btn" @click="openBackdropClose = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openBackdropNoClose" title="Backdrop sin Cierre" show-backdrop
    :close-on-backdrop="false">
    <div class="sheet-body">
      <p>Teniendo asignado <code>:close-on-backdrop="false"</code>, aisla visualmente la UI inferior sin permitir
        escapes en el fondo.</p>
      <p>El clic fuera será bloqueado e ignorado, protegiendo las acciones internas pero permitiendo los demás gestos.
      </p>
      <button class="secondary-btn" @click="openBackdropNoClose = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openPersistent" title="Modo Persistente" persistent show-backdrop>
    <div class="sheet-body">
      <p>La opción <code>persistent="true"</code> está diseñada para captar la respuesta final interactiva. Deshabilita
        de golpe cualquier via de escape:</p>
      <ul style="padding-left: 20px;">
        <li>Oculta el botón superior de cierre clásico.</li>
        <li>Elimina por completo la escucha en el click en backdrop.</li>
        <li>Desconecta los gestos deslizables para ignorar arrastres de despiste.</li>
      </ul>
      <p>Incluso si tienes height, no permite fuga. La única forma de salir es si programáticamente cambias
        <code>v-model=false</code>.</p>
      <button class="primary-btn" style="background: #ef4444;" @click="openPersistent = false">Acabar Operación
        Importante</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openHiddenElements" title="Minimalista" hide-close-button hide-drag-handle>
    <div class="sheet-body">
      <p>Fueron retirados los accesorios estéticos: <code>hide-close-button</code> apaga la "X", y
        <code>hide-drag-handle</code> elimina la barra superior de drag.</p>
      <p>A pesar de no tener referencias visuales de cierre, el touch seguirá respondiendo al bajar agresivamente el
        modal.</p>
      <button class="secondary-btn" @click="openHiddenElements = false">Cerrar manual</button>
    </div>
  </simple-bottom-sheet>

  <simple-bottom-sheet v-model="openEvents" title="Monitor de Eventos" show-backdrop
    @update:model-value="val => handleSimpleEvent(`update:modelValue -> ${val}`)" @opened="handleSimpleEvent('opened')"
    @closed="handleSimpleEvent('closed')" @before-close="handleSimpleEvent('before-close')">
    <div class="sheet-body">
      <p>Abre la Consola de DevTools (F12) o Inspector Web del móvil y ejecuta aperturas y cierres aquí.</p>
      <button class="secondary-btn" @click="openEvents = false">Cerrar</button>
    </div>
  </simple-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynHalf" title="initialSize: half" :initial-size="'half'">
    <div class="sheet-body">
      <p>El panel arranca en el estado <code>half</code> (por defecto <code>45dvh</code>).</p>
      <p>Arrastra el handle hacia <strong>arriba</strong> para expandirlo a <code>full</code>, o hacia
        <strong>abajo</strong> para colapsarlo. Un click en el handle alterna entre <code>half</code> y
        <code>full</code>.</p>
      <p>Cuando está colapsado, un click fuera del panel (sin backdrop) lo termina de cerrar completamente.</p>
      <button class="secondary-btn" @click="openDynHalf = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynFull" title="initialSize: full" :initial-size="'full'">
    <div class="sheet-body">
      <p>El panel arranca directamente en el estado <code>full</code> (por defecto <code>95dvh</code>).</p>
      <p>Desde aquí, arrastra hacia abajo para pasar a <code>half</code> y luego a <code>collapsed</code>.</p>
      <p v-for="i in 20" :key="i">Relleno para probar scroll en full #{{ i }}</p>
      <button class="secondary-btn" @click="openDynFull = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynCollapsed" title="initialSize: collapsed" :initial-size="'collapsed'">
    <template #collapsed-content>
      <div style="padding: 0 16px 4px;">
        <p style="margin: 0; font-size: 14px;">👆 Toca para expandir — este contenido solo se ve en estado
          <code>collapsed</code>.</p>
      </div>
    </template>
    <div class="sheet-body">
      <p>Este contenido solo es visible cuando el panel está en <code>half</code> o <code>full</code>.</p>
      <p>Al iniciarse colapsado, se muestra el slot <code>#collapsed-content</code>. Al expandirse, desaparece y aparece
        el
        slot por defecto.</p>
      <button class="secondary-btn" @click="openDynCollapsed = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynCustomSizes" title="Tamaños: half=30dvh, full=80dvh" :half="'30dvh'"
    :full="'80dvh'">
    <div class="sheet-body">
      <p>Los props <code>half</code> y <code>full</code> sobreescriben los valores por defecto (<code>45dvh</code> y
        <code>95dvh</code>).
      </p>
      <p>En este caso: <code>half="30dvh"</code> y <code>full="80dvh"</code>. Acepta cualquier unidad CSS válida
        (<code>px</code>, <code>dvh</code>, <code>vh</code>, <code>%</code>…).</p>
      <button class="secondary-btn" @click="openDynCustomSizes = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynBackdrop" title="Con Backdrop" show-backdrop>
    <div class="sheet-body">
      <p>Con <code>show-backdrop</code> activo, se muestra una capa oscura sobre el contenido de fondo cuando el panel
        está en <code>half</code> o <code>full</code>.</p>
      <p>Al hacer click sobre el backdrop, el panel se colapsa (no se cierra completamente, solo pasa a
        <code>collapsed</code>).
      </p>
      <p>En estado <code>collapsed</code> el backdrop desaparece automáticamente.</p>
      <button class="secondary-btn" @click="openDynBackdrop = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynNoBackdrop" title="Sin Backdrop">
    <div class="sheet-body">
      <p>Sin <code>show-backdrop</code>, el fondo permanece completamente interactivo.</p>
      <p>Al hacer click o touch en cualquier zona fuera del panel (mientras está en <code>half</code> o
        <code>full</code>), este se colapsa automáticamente.
      </p>
      <p>Esto permite que el usuario interactúe con la UI del fondo sin necesidad de cerrar el sheet.</p>
      <button class="secondary-btn" @click="openDynNoBackdrop = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynHeaderSlot" :initial-size="'half'">
    <template #header>
      <div style="display: flex; align-items: center; gap: 8px; padding: 0 8px;">
        <span style="font-size: 20px;">🎨</span>
        <div>
          <div style="font-weight: 700; font-size: 15px;">Header personalizado</div>
          <div style="font-size: 12px; opacity: 0.6;">Subtítulo vía slot #header</div>
        </div>
      </div>
    </template>
    <template #collapsed-content>
      <div style="padding: 0 16px 4px; font-size: 13px;">
        📌 Vista colapsada — usa el slot <code>#collapsed-content</code> para mostrar un resumen.
      </div>
    </template>
    <div class="sheet-body">
      <p>El slot <code>#header</code> reemplaza completamente el título por defecto. Úsalo para poner iconos,
        subtítulos,
        badges o cualquier markup.</p>
      <p>El slot <code>#collapsed-content</code> se muestra <strong>únicamente</strong> cuando el panel está en estado
        <code>collapsed</code> y se oculta en <code>half</code> / <code>full</code>.
      </p>
      <button class="secondary-btn" @click="openDynHeaderSlot = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynHideElements" title="Sin handle ni botón" hide-close-button hide-drag-handle>
    <div class="sheet-body">
      <p>Con <code>hide-close-button</code> y <code>hide-drag-handle</code> activos, el header queda limpio sin
        elementos
        visuales de control.</p>
      <p>Los gestos táctiles sobre el header siguen funcionando: arrastra o haz click para alternar entre tamaños.</p>
      <button class="secondary-btn" @click="openDynHideElements = false">Cerrar manual</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynEvents" title="Monitor de Eventos" show-backdrop
    @opened="handleDynEvent('opened')" @closed="handleDynEvent('closed')" @close="handleDynEvent('close')"
    @size-change="size => { dynCurrentSize = size; handleDynEvent(`size-change → ${size}`) }">
    <div class="sheet-body">
      <p>Abre DevTools (F12) y prueba los gestos. Los eventos disponibles son:</p>
      <ul style="padding-left: 20px;">
        <li><code>opened</code> — cuando el panel termina de abrirse.</li>
        <li><code>closed</code> — cuando el panel termina de cerrarse.</li>
        <li><code>close</code> — inmediatamente al iniciar el cierre.</li>
        <li><code>size-change</code> — cada vez que cambia de tamaño (<code>collapsed</code> / <code>half</code> /
          <code>full</code>).
        </li>
      </ul>
      <button class="secondary-btn" @click="openDynEvents = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynTheme" title="Dynamic con tema global">
    <template #collapsed-content>
      <div style="padding: 0 16px 4px; font-size: 13px;">
        El tema se aplica vía variables CSS en el <code>body</code>. Prueba a cambiar arriba.
      </div>
    </template>
    <div class="sheet-body">
      <p>Las variables CSS como <code>--bsw-background</code>, <code>--bsw-border-radius</code> y
        <code>--bsw-handle-background</code> se leen del scope del <code>body</code>.
      </p>
      <p>Cambia el selector de tema en la parte superior para ver el efecto en tiempo real.</p>
      <button class="secondary-btn" @click="openDynTheme = false">Cerrar</button>
    </div>
  </dynamic-bottom-sheet>

  <dynamic-bottom-sheet v-model="openDynLocal" title="Override local" class="local-theme">
    <div class="sheet-body">
      <p>La clase <code>.local-theme</code> aplica variables CSS solo a esta instancia, sobreescribiendo el tema global
        del body.</p>
      <p>Esto permite tener múltiples bottom sheets con estilos distintos en la misma página.</p>
      <button class="secondary-btn" @click="openDynLocal = false">Cerrar</button>
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

.theme-dark .primary-btn,
.theme-dark .demo-actions .primary-btn {
  background: #f9fafb;
  color: #111827;
}

.secondary-btn {
  background: rgba(0, 0, 0, 0.08);
  color: #111827;
  padding: 8px 16px;
  border-radius: 8px;
}

.theme-dark .secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #f9fafb;
}

.theme-controls button {
  background: rgba(0, 0, 0, 0.08);
  color: #111827;
}

.theme-dark .theme-controls button {
  background: rgba(255, 255, 255, 0.08);
  color: #f9fafb;
}

.theme-controls button.active {
  background: #111827;
  color: white;
}

.theme-dark .theme-controls button.active {
  background: #f9fafb;
  color: #111827;
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
  --bsw-header-color: #111827;
  --bsw-content-color: #111827;
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
  --bsw-header-color: #111827;
  --bsw-content-color: #111827;
  background: #eef2ff;
  color: #111827;
}

.theme-dark {
  --bsw-background: #111827;
  --bsw-border-radius: 14px;
  --bsw-box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.5);
  --bsw-handle-background: rgba(255, 255, 255, 0.2);
  --bsw-header-color: #f9fafb;
  --bsw-content-color: #f9fafb;
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
  --bsw-header-color: #7c2d12;
  --bsw-content-color: #7c2d12;
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
  --bsw-header-color: #0e7490;
  --bsw-content-color: #164e63;
  --bsw-close-btn-color: rgba(8, 145, 178, 0.8);
  --bsw-close-btn-hover-color: #0e7490;
}
</style>
