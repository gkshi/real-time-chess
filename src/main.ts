import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

// plugins
import emitter from './plugins/emitter'
import helpers from './plugins/helpers'

import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(emitter)
  .use(helpers)
  .mount('#app')
