import { createApp } from 'vue'
import { Quasar, TouchPan } from 'quasar'
import './style.css'
import App from './App.vue'

// Import Quasar css
import 'quasar/dist/quasar.css'

const app = createApp(App)

app.use(Quasar, {
    plugins: {}, // No Quasar plugins needed
    directives: {
        TouchPan
    },
    components: {
        // QBtn is auto-imported by the Quasar Vite plugin
    }
})

app.mount('#app')
