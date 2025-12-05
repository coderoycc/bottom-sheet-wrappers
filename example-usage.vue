&lt;!-- Ejemplo de uso en tu proyecto de prueba --&gt;
&lt;!-- Archivo: TestBottomSheet.vue --&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { BottomSheet, type BottomSheetProps } from '@coderoycc/bottom-sheet-wrappers'
import '@coderoycc/bottom-sheet-wrappers/dist/bottom-sheet-wrappers.css'

const isOpen = ref(false)
const isDynamicOpen = ref(false)
const isAutoFitOpen = ref(false)
const isFixedOpen = ref(false)

function handleSizeChange(size: 'small' | 'medium' | 'large') {
  console.log('Tamaño cambiado a:', size)
}

function handleOpened() {
  console.log('Bottom sheet abierto')
}

function handleClosed() {
  console.log('Bottom sheet cerrado')
}
&lt;/script&gt;

&lt;template&gt;
  &lt;div class="test-container"&gt;
    &lt;h1&gt;Prueba de Bottom Sheet&lt;/h1&gt;
    
    &lt;div class="buttons"&gt;
      &lt;button @click="isOpen = true"&gt;Abrir Bottom Sheet Básico&lt;/button&gt;
      &lt;button @click="isDynamicOpen = true"&gt;Modo Dynamic&lt;/button&gt;
      &lt;button @click="isAutoFitOpen = true"&gt;Modo Auto-fit&lt;/button&gt;
      &lt;button @click="isFixedOpen = true"&gt;Modo Fixed&lt;/button&gt;
    &lt;/div&gt;

    &lt;!-- Bottom Sheet Básico --&gt;
    &lt;BottomSheet
      v-model="isOpen"
      title="Bottom Sheet Básico"
      @opened="handleOpened"
      @closed="handleClosed"
    &gt;
      &lt;div class="content"&gt;
        &lt;p&gt;¡El paquete funciona correctamente! 🎉&lt;/p&gt;
        &lt;p&gt;Este es un bottom sheet básico con configuración por defecto.&lt;/p&gt;
      &lt;/div&gt;
    &lt;/BottomSheet&gt;

    &lt;!-- Modo Dynamic --&gt;
    &lt;BottomSheet
      v-model="isDynamicOpen"
      title="Modo Dynamic"
      mode="dynamic"
      :initial-size="'medium'"
      @size-change="handleSizeChange"
    &gt;
      &lt;div class="content"&gt;
        &lt;h3&gt;Modo Dynamic&lt;/h3&gt;
        &lt;p&gt;Puedes arrastrar para cambiar el tamaño&lt;/p&gt;
        &lt;ul&gt;
          &lt;li&gt;Small: 25% de altura&lt;/li&gt;
          &lt;li&gt;Medium: 45% de altura&lt;/li&gt;
          &lt;li&gt;Large: 85% de altura&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/div&gt;
    &lt;/BottomSheet&gt;

    &lt;!-- Modo Auto-fit --&gt;
    &lt;BottomSheet
      v-model="isAutoFitOpen"
      title="Modo Auto-fit"
      mode="auto-fit"
      :max-height="'80dvh'"
    &gt;
      &lt;div class="content"&gt;
        &lt;h3&gt;Modo Auto-fit&lt;/h3&gt;
        &lt;p&gt;El tamaño se ajusta automáticamente al contenido&lt;/p&gt;
        &lt;p&gt;Este contenido determina la altura del bottom sheet.&lt;/p&gt;
        &lt;p&gt;Si el contenido es muy largo, aparecerá scroll interno.&lt;/p&gt;
      &lt;/div&gt;
    &lt;/BottomSheet&gt;

    &lt;!-- Modo Fixed --&gt;
    &lt;BottomSheet
      v-model="isFixedOpen"
      title="Modo Fixed"
      mode="fixed"
      :initial-size="'large'"
    &gt;
      &lt;div class="content"&gt;
        &lt;h3&gt;Modo Fixed&lt;/h3&gt;
        &lt;p&gt;Tamaño fijo, no se puede redimensionar&lt;/p&gt;
        &lt;p&gt;Solo se puede cerrar deslizando hacia abajo&lt;/p&gt;
        &lt;div v-for="i in 20" :key="i"&gt;
          &lt;p&gt;Línea {{ i }} - Contenido con scroll interno&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/BottomSheet&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;style scoped&gt;
.test-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

button {
  padding: 1rem 2rem;
  font-size: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #2563eb;
}

.content {
  padding: 1rem;
}

.content h3 {
  margin-top: 0;
  color: #1f2937;
}

.content p {
  color: #4b5563;
  line-height: 1.6;
}

.content ul {
  color: #4b5563;
  line-height: 1.8;
}
&lt;/style&gt;
