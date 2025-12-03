<script setup lang="ts">
import { ref } from 'vue'
import { QBtn } from 'quasar'
import BottomSheet from './BottomSheet.vue'

defineProps({
  msg: String,
})
const open = ref(true)
const count = ref(0)
</script>

<template>
  <BottomSheet v-model="open" show-close-button mode="auto-fit" initial-size="medium" title="Hola mundo" click-to-collapse show-backdrop allow-resize>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
      <li>Item 5</li>
      <li>Item 6</li>
      <li>Item 7</li>
      <li>Item 8</li>
      <li>Item 9</li>
      <li>Item 10</li>
      <li>Item 11</li>
      <li>Item 12</li>
      <li>Item 13</li>
      <li>Item 14</li>
      <li>Item 15</li>
      <li>Item 16</li>
      <li>Item 17</li>
      <li>Item 18</li>
      <li>Item 19</li>
      <li>Item 20</li>
    </ul>
  </BottomSheet>
  <!-- <h1>{{ msg }}</h1>

  <QBtn label="Click me" @click="count++" />
  
  <div class="card">
    asdfasdf {{ count }}
  </div> -->
</template>

<style scoped>

</style>
