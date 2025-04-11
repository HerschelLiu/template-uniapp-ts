
import * as Pinia from 'pinia'
import uviewPlus from 'uview-plus'
import { createSSRApp } from 'vue'

import App from './App.vue'
import pinia from './store'

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
