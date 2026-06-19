import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'
import { useChurchStore } from './stores/church'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const churchStore = useChurchStore()
churchStore.setUpRealtimeListeners()

app.mount('#app')