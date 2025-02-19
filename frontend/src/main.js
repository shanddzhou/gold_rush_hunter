import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { setupStores } from '@/stores'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
setupStores(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')