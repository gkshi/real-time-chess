// import mitt from 'mitt'
// var Emitter = require('tiny-emitter');
// var emitter = new Emitter();
import emitter from 'tiny-emitter/instance'

const Emitter = options => ({
  on: (...args) => emitter.on(...args),
  once: (...args) => emitter.once(...args),
  off: (...args) => emitter.off(...args),
  emit: (...args) => emitter.emit(...args)
})

export default {
  install: (app, options) => {
    app.config.globalProperties.$emitter = Emitter(options)
    // app.provide('emitter', options)

    app.provide('emitter', options)
  }
}
