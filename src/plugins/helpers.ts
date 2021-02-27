import mitt from 'mitt'

export default {
  install: (app, options) => {
    app.config.globalProperties.$emitter = mitt()
    // app.provide('emitter', options)

    app.provide('emitter', options)
  }
}
