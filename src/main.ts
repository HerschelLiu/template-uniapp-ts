import uviewPlus from 'uview-plus'
import { createSSRApp } from 'vue'

import App from './App.vue'
import 'uno.css'
import store from './store'

export function createApp() {
  const app = createSSRApp(App)

  app.use(store)
  app.use(uviewPlus)

  return {
    app,
  }
}
