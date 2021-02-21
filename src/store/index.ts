import { createStore } from 'vuex'
import { Cell, CellColor } from '@/types/Cell'
import { Figure, FigureConstructor } from '@/types/Figure'
import config from '@/config'

import gameModule from './game'

export default createStore({
  state: {
    desk: [],
    figures: [],
    highlightedCells: [],
    _generator: {
      reverse: false
    }
  },

  actions: {
    async init ({ commit, dispatch }) {
      console.log('[store][init]')
      const figures = await dispatch('_generateFigures')
      commit('FIGURES_UPDATE', figures)
    },

    async generateDeck ({ commit, dispatch }) {
      console.log('[store][generateDeck]')
      const rows = ['8', '7', '6', '5', '4', '3', '2', '1']
      const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      const desk = []
      let i = 0
      for (let j = 0; j < rows.length; j++) {
        for (let k = 0; k < cols.length; k++) {
          desk.push(new Cell({
            id: i,
            name: `${cols[k]}${rows[j]}`,
            color: await dispatch('_cellColor', i)
          }))
          i++
        }
      }
      commit('DESK_UPDATE', desk)
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

    _generateFigures (): Figure[] {
      const figures = []
      Object.keys(config.deck).forEach(cell => {
        const figure = FigureConstructor[config.deck[cell].figure]({
          id: config.deck[cell].figure,
          color: config.deck[cell].color,
          cell
        })
        figures.push(figure)
      })
      return figures
    },

    setHighlightedCells ({ commit }, cells) {
      commit('HIGHLIGHTED_CELLS_UPDATE', cells)
    }
  },

  mutations: {
    FIGURES_UPDATE (state, figures) {
      state.figures = figures
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

    cell: state => query => {
      const res = state.desk.find(cell => {
        let found = false
        Object.keys(query).forEach(key => {
          found = cell[key] === query[key]
        })
        return found ? cell : null
      })
      return res
    },

    cellPosition: (state, getters) => cell => {
      const storedCell = getters.cell({ name: cell })
      if (!storedCell) {
        return {
          top: null,
          left: null
        }
      }

      const number = storedCell.name.slice(1)
      const letter = storedCell.name.slice(0, 1)

      const top = 12.5 * (8 - number)
      let left
      switch (letter) {
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
    }
  },

  modules: {
    game: gameModule
  }
})
