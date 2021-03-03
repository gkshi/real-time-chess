import config from '@/config'

const defaultState = () => ({
  interval: null,
  timer: 0,
  rollbacks: [],
  winner: null
})

export default {
  namespaced: true,

  state: defaultState(),

  actions: {
    start ({ commit, getters }) {
      if (!getters.started) {
        commit('TIMEOUT_START')
      }
    },

    stop ({ state }) {
      clearInterval(state.interval)
    },

    reset ({ commit, dispatch }) {
      // console.log('[game/reset]')
      commit('RESET')
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

    checkGameStatus ({ commit, dispatch, rootState }) {
      console.log('[game][checkGameStatus]')
      const whiteKing = rootState.figures.find(i => i.alias === 'king' && i.color === 'white')
      const darkKing = rootState.figures.find(i => i.alias === 'king' && i.color === 'dark')

      console.log('whiteKing', whiteKing)
      console.log('darkKing', darkKing)

      if (!whiteKing || !darkKing) {
        dispatch('stop')
        dispatch('modals/open', 'game_finished', { root: true })
        commit('WINNER_UPDATE', whiteKing ? whiteKing.color : darkKing.color)
      }
    },

    setRollback ({ commit }, figureId) {
      commit('ROLLBACK_ADD', figureId)
    }
  },

  mutations: {
    RESET (state) {
      clearInterval(state.interval)
      const clean = defaultState()
      Object.keys(clean).forEach(key => {
        state[key] = clean[key]
      })
    },

    TIMEOUT_START (state) {
      state.interval = setInterval(() => {
        state.timer++
      }, 1000)
    },

    ROLLBACK_ADD (state, figureId) {
      state.rollbacks.push(figureId)
      setTimeout(() => {
        state.rollbacks = state.rollbacks.filter(i => i !== figureId)
      }, config.rollbackTime)
    },

    WINNER_UPDATE (state, winner) {
      state.winner = winner
    }
  },

  getters: {
    started: (state): boolean => !!state.interval,
    inRollback: state => figureId => state.rollbacks.includes(figureId)
  }
}
