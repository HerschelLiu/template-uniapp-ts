import App from './App.vue'
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import pinia from './store'

import uviewPlus from 'uview-plus'
import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  app.use(uviewPlus)

  return {
    app,
    Pinia
  }
}
