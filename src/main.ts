import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import emitter from './plugins/emitter'

import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(emitter)
  .mount('#app')
