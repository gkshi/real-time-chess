import { Cell, CellValue } from '@/types/Cell'
import config from '@/config'

const directions = ['top', 'right', 'down', 'left']

const helpers = {
  validateCellLines: (moves: CellValue[], filledCells: CellValue[], currentCellValue: CellValue) => {
    const currentCell = new Cell(currentCellValue) as Cell

    let res = []
    const letters = new Set(moves.map(i => {
      const cell = new Cell(i)
      return cell.letter
    }))

    letters.forEach((letter: string) => {
      let lines = []
      const lineFilled = filledCells.filter(i => i.slice(0, 1) === letter)
      const lineMoves = moves.filter(i => i.slice(0, 1) === letter)
      lineFilled.sort()
      lineMoves.sort()

      directions.forEach(dir => {
        const line = []
        let index = 1
        let doing = true

        while (doing) {
          let c
          const letterIndex = config.deckCols.indexOf(letter)
          switch (dir) {
            case 'top':
              c = `${letter}${currentCell.number + index}`
              break
            case 'right':
              c = `${config.deckCols[letterIndex + 1]}${currentCell.number}`
              break
            case 'down':
              c = `${letter}${currentCell.number - index}`
              break
            case 'left':
              c = `${config.deckCols[letterIndex - 1]}${currentCell.number - index}`
              break
          }
          if (!lineMoves.includes(c)) {
            doing = false
            break
          }
          if (lineFilled.includes(c)) {
            doing = false
          } else {
            line.push(c)
            index++
          }
        }

        lines = [...lines, ...line]
      })

      res = [...res, ...lines]
    })
    return res
  },

  diagonalCells: (currentCellValue: CellValue) => {
    console.log('---')
    const res = {}
    const currentCell = new Cell(currentCellValue) as Cell
    console.log('currentCell', currentCell)
    const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    directions.forEach(dir => {
      console.log('dir', dir)
      const index = 1
      const cells = []
      let doing = true
      let cell = currentCell.value
      const prevIndex = config.deckCols.indexOf(cell.slice(0, 1))

      switch (dir) {
        case 'top-left':
          cell = `${config.deckCols[prevIndex - 1]}${currentCell.number + 1}`
          while (doing) {
            cells.push(cell)
            const letterIndex = config.deckCols.indexOf(cell.slice(0, 1))
            const nextLetter = config.deckCols[letterIndex - 1]
            const nextNumber = +cell.slice(1) !== helpers.maxNumber ? +cell.slice(1) + 1 : 0
            if (nextLetter && nextNumber) {
              cell = `${nextLetter}${nextNumber}`
            } else {
              doing = false
            }
          }
          break
        case 'top-right':
          break
        case 'bottom-left':
          break
        case 'bottom-right':
          break
      }

      res[dir] = cells
    })
    console.log('---')
    return res
  },

  validateDiagonalCells: ({ moves, currentCellValue, length }) => {
    console.log('validateDiagonalCells', moves, currentCellValue, length)
    if (length) {
      Object.keys(moves).forEach(key => {
        moves[key] = moves[key].slice(0, length)
      })
    }
    return moves
  },

  minLetter: config.deckCols[0],
  maxLetter: config.deckCols[config.deckCols.length - 1],
  maxNumber: config.deckCols.length
}

export default {
  install: (app, options) => {
    app.config.globalProperties.$helpers = helpers
    // app.provide('helpers', options)

    app.provide('helpers', options)
  }
}
