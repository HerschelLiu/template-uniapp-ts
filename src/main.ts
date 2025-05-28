import { createSSRApp } from "vue";
import App from "./App.vue";

import 'uno.css'

import uviewPlus from 'uview-plus'

export function createApp() {
  const app = createSSRApp(App);
  
  app.use(uviewPlus)

  return {
    app,
  };
}
