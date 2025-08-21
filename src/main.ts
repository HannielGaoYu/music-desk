import { createApp } from 'vue'
import './assets/css/style.css'
import App from './App.vue'
import {createPinia} from 'pinia'

import router from './router'

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
