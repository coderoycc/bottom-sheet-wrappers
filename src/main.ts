import { createApp } from 'vue'
import { TouchPan } from 'quasar'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Register only the TouchPan directive globally
app.directive('touch-pan', TouchPan)

app.mount('#app')
