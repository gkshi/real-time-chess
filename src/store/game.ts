import config from '@/config'

export default {
  namespaced: true,

  state: {
    interval: null,
    timer: 0,
    rollbacks: []
  },

  actions: {
    start ({ commit, getters }) {
      if (!getters.started) {
        commit('TIMEOUT_START')
      }
    },

    reset ({ commit, dispatch }) {
      // console.log('[game/reset]')
      commit('TIMEOUT_RESET')
      dispatch('reset', null, { root: true })
    },

    async makeMove ({ dispatch, commit, rootState, rootGetters }, payload) {
      console.log('[game/makeMove]', payload)
      const cell = await rootGetters.cell(payload.cell)

      // Меняем ячейку у выбранной фигуры
      dispatch('updateFigure', {
        query: { id: rootState.activeFigure.id },
        data: { targetCell: cell }
      }, { root: true })

      // Убирем подсвеченные ячейки
      dispatch('removeFromHighlightedCells', cell.value, { root: true })
    },

    setRollback ({ commit }, figureId) {
      commit('ROLLBACK_ADD', figureId)
    }
  },

  mutations: {
    TIMEOUT_START (state) {
      state.interval = setInterval(() => {
        state.timer++
      }, 1000)
    },

    TIMEOUT_RESET (state) {
      clearInterval(state.interval)
      state.interval = null
      state.timer = 0
    },

    ROLLBACK_ADD (state, figureId) {
      state.rollbacks.push(figureId)
      setTimeout(() => {
        state.rollbacks = state.rollbacks.filter(i => i !== figureId)
      }, config.rollbackTime)
    }
  },

  getters: {
    started: (state): boolean => !!state.interval,
    inRollback: state => figureId => state.rollbacks.includes(figureId)
  }
}
