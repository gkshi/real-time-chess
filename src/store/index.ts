import { createStore } from 'vuex'
import { Cell, CellColor, CellValue } from '@/types/Cell'
import { Figure } from '@/types/Figure'
import { FigureConstructor } from '@/types/FigureConstructor'
import config from '@/config'

import gameModule from './game'

const initialState = () => ({
  desk: [] as Cell[],
  figures: [] as Figure[],
  activeFigure: null as Figure,
  highlightedCells: [] as CellValue[],
  _generator: {
    reverse: false,
    rows: ['8', '7', '6', '5', '4', '3', '2', '1'],
    cols: config.deckCols
  }
})

export default createStore({
  state: initialState(),

  actions: {
    async init ({ commit, dispatch }) {
      await dispatch('generateDesk')
      const figures = await dispatch('_generateFigures')
      console.log('[store][init]')
      commit('FIGURES_UPDATE', figures)
    },

    reset ({ commit, dispatch, state }) {
      commit('RESET')
      dispatch('init')
      console.log('state.reverse', state._generator.reverse)
    },

    async generateDesk ({ commit, dispatch, state }) {
      const desk = []
      let i = 0
      for (let j = 0; j < state._generator.rows.length; j++) {
        for (let k = 0; k < state._generator.cols.length; k++) {
          desk.push(new Cell({
            id: i + 1,
            value: `${state._generator.cols[k]}${state._generator.rows[j]}`,
            color: await dispatch('_cellColor', i)
          }))
          i++
        }
      }
      console.log('[store][generateDesk]')
      commit('DESK_UPDATE', desk)
    },

    setActiveFigure ({ commit }, figure) {
      commit('ACTIVE_FIGURE_UPDATE', figure)
    },

    updateFigure ({ state, getters, commit }, payload) {
      console.log('[store][updateFigure]', payload)
      payload.figure = getters.figure(payload.query)
      payload.index = getters.findIndexByQuery('figures', payload.query)
      commit('FIGURE_UPDATE', payload)
    },

    setHighlightedCells ({ commit }, cells) {
      commit('HIGHLIGHTED_CELLS_UPDATE', cells)
    },

    removeFromHighlightedCells ({ commit, state }, cell) {
      const cells = state.highlightedCells.filter(i => i.value !== cell.value)
      commit('HIGHLIGHTED_CELLS_UPDATE', cells)
    },

    _cellColor ({ state }, i: number): CellColor {
      const reverse = [8, 16, 24, 32, 40, 48, 56]
      if (reverse.includes(i)) {
        state._generator.reverse = !state._generator.reverse
      }
      return state._generator.reverse
        ? i % 2 ? CellColor.White : CellColor.Dark
        : i % 2 ? CellColor.Dark : CellColor.White
    },

    _generateFigures ({ getters }): Figure[] {
      const figures = []
      Object.keys(config.deck).forEach((cell, i) => {
        const figure = FigureConstructor[config.deck[cell].figure]({
          id: i + 1,
          alias: config.deck[cell].figure,
          color: config.deck[cell].color,
          cell: getters.cell({ value: cell })
        })
        figures.push(figure)
      })
      return figures
    }
  },

  mutations: {
    RESET (state) {
      const cleanState = initialState()
      Object.keys(cleanState).forEach(key => {
        state[key] = cleanState[key]
      })
    },

    FIGURES_UPDATE (state, figures) {
      state.figures = figures
    },

    FIGURE_UPDATE (state, payload) {
      console.log('[FIGURE_UPDATE] payload', payload)
      Object.keys(payload.data).forEach(option => {
        payload.figure[option] = payload.data[option]
      })
    },

    ACTIVE_FIGURE_UPDATE (state, figure) {
      state.activeFigure = figure
    },

    DESK_UPDATE (state, desk) {
      state.desk = desk
    },

    HIGHLIGHTED_CELLS_UPDATE (state, cells) {
      state.highlightedCells = cells
    }
  },

  getters: {
    figures: state => state.figures,

    findByQuery: state => (target, query) => {
      // console.log('[getters/findByQuery] target', target, 'query', query)
      const res = state[target].find(item => {
        let foundOption = 0
        Object.keys(query).forEach(key => {
          if (item[key] === query[key]) {
            foundOption++
          }
        })
        return foundOption === Object.keys(query).length ? item : null
      })
      return res
    },

    findIndexByQuery: state => (target, query) => {
      const res = state[target].findIndex(item => {
        let foundOption = 0
        Object.keys(query).forEach(key => {
          if (item[key] === query[key]) {
            foundOption++
          }
        })
        return foundOption === Object.keys(query).length
      })
      return res
    },

    figure: (state, getters) => query => {
      return getters.findByQuery('figures', query)
    },

    cell: (state, getters) => query => {
      // console.log('[getters/cell] query', query)
      if (typeof query === 'string') {
        query = { value: query }
      }
      return getters.findByQuery('desk', query)
    },

    cellPosition: (state, getters) => cell => {
      const storedCell = getters.cell({ id: cell.id })
      if (!storedCell) {
        return {
          top: null,
          left: null
        }
      }

      const top = 12.5 * (8 - cell.number)
      let left
      switch (cell.letter) {
        case 'A':
          left = 0
          break
        case 'B':
          left = 12.5
          break
        case 'C':
          left = 25
          break
        case 'D':
          left = 37.5
          break
        case 'E':
          left = 50
          break
        case 'F':
          left = 62.5
          break
        case 'G':
          left = 75
          break
        case 'H':
          left = 87.5
          break
      }

      return {
        top: `${top}%`,
        left: `${left}%`
      }
    },

    maxCellNumber: (state) => state._generator.rows.length,

    filledCells: state => state.figures.map(i => i.cell),

    filledCellValues: state => state.figures.map(i => i.cell.value)
  },

  modules: {
    game: gameModule
  },

  plugins: []
})
