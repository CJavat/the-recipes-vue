import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import './config/yup'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

console.log(import.meta.env.BASE_URL)

app.use(pinia)
app.use(router)

app.mount('#app')
