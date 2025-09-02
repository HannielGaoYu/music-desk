import { createApp } from 'vue'
import './assets/css/style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import VueLazyload from 'vue-lazyload'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import load from './assets/img/play-bar/b.gif'

import router from './router'

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.use(VueLazyload, {
  preLoad: 1.3, // 预加载的高度比例
  error: load, // 图片路径错误时加载的图片
  loading: load, // 预加载图片
  attempt: 1 // 尝试加载图片的数量
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
