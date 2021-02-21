export default {
  namespaced: true,

  state: {
    timeout: null,
    timer: 0
  },

  actions: {
    start ({ commit }) {
      commit('TIMEOUT_START')
    },

    reset ({ commit }) {
      console.log('[game/reset]')
      commit('TIMEOUT_RESET')
    }
  },

  mutations: {
    TIMEOUT_START (state) {
      state.timeout = setTimeout(() => {
        state.timer++
      })
    },

    TIMEOUT_RESET (state) {
      clearTimeout(state.timeout)
    }
  },

  getters: {
    //
  }
}
