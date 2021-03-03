import { Cell, CellValue } from '@/types/Cell'
import { EnemyBlocking, DirectionName, Direction, Directions } from '@/types/Game'
import config from '@/config'
import { Figure } from '@/types/Figure'
import { createLogger } from 'vuex'

enum NextCellMode {
  Lower = 'lower',
  Higher = 'higher'
}

const DIRECTIONS = {
  ALL: [DirectionName.TopLeft, DirectionName.Top, DirectionName.TopRight, DirectionName.Right, DirectionName.BottomRight, DirectionName.Bottom, DirectionName.BottomLeft, DirectionName.Left],
  STRONG: [DirectionName.Top, DirectionName.Right, DirectionName.Bottom, DirectionName.Left],
  DIAGONAL: [DirectionName.TopLeft, DirectionName.TopRight, DirectionName.BottomRight, DirectionName.BottomLeft]
}

const helpers = (app, options) => ({
  minLetter: config.deckCols[0],
  maxLetter: config.deckCols[config.deckCols.length - 1],
  minNumber: 0,
  maxNumber: config.deckCols.length,

  _isCellFilled (targetCell, figures) {
    return !!figures.find(i => i.cell.value === targetCell)
  },

  _isCellFilledByAlly (targetCell, comparingCell, figures) {
    if (!this._isCellFilled(targetCell, figures)) {
      return false
    }
    const targetCellFigure = figures.find(i => i.cell.value === targetCell)
    const comparingCellFigure = figures.find(i => i.cell.value === comparingCell)
    return comparingCellFigure.color === targetCellFigure.color
  },

  _isCellFilledByEnemy (targetCell, comparingCell, figures) {
    if (!this._isCellFilled(targetCell, figures)) {
      return false
    }
    const targetCellFigure = figures.find(i => i.cell.value === targetCell)
    const comparingCellFigure = figures.find(i => i.cell.value === comparingCell)
    return comparingCellFigure.color !== targetCellFigure.color
  },

  _getNextCellLetter (mode: NextCellMode, letter) {
    const i = config.deckCols.indexOf(letter)
    return mode === NextCellMode.Lower ? config.deckCols[i - 1] : config.deckCols[i + 1]
  },

  _getNextCellNumber (mode: NextCellMode, number) {
    if (mode === NextCellMode.Lower) {
      return number - 1
    }
    return number + 1 <= config.deckCols.length ? number + 1 : null
  },

  _getNextCell (direction: Direction, startCellValue: CellValue): CellValue {
    if (!startCellValue) {
      return null
    }
    const startCell = new Cell(startCellValue)
    let cell = null
    let prevCellLetter
    let prevCellNumber
    switch (direction.name) {
      case DirectionName.TopLeft:
        prevCellLetter = this._getNextCellLetter(NextCellMode.Lower, startCell.letter)
        prevCellNumber = this._getNextCellNumber(NextCellMode.Higher, startCell.number)
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.Top:
        prevCellLetter = startCell.letter
        prevCellNumber = this._getNextCellNumber(NextCellMode.Higher, startCell.number)
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.TopRight:
        prevCellLetter = this._getNextCellLetter(NextCellMode.Higher, startCell.letter)
        prevCellNumber = this._getNextCellNumber(NextCellMode.Higher, startCell.number)
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.Right:
        prevCellLetter = this._getNextCellLetter(NextCellMode.Higher, startCell.letter)
        prevCellNumber = startCell.number
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.BottomRight:
        prevCellLetter = this._getNextCellLetter(NextCellMode.Higher, startCell.letter)
        prevCellNumber = this._getNextCellNumber(NextCellMode.Lower, startCell.number)
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.Bottom:
        prevCellLetter = startCell.letter
        prevCellNumber = this._getNextCellNumber(NextCellMode.Lower, startCell.number)
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.BottomLeft:
        prevCellLetter = this._getNextCellLetter(NextCellMode.Lower, startCell.letter)
        prevCellNumber = this._getNextCellNumber(NextCellMode.Lower, startCell.number)
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break

      case DirectionName.Left:
        prevCellLetter = this._getNextCellLetter(NextCellMode.Lower, startCell.letter)
        prevCellNumber = startCell.number
        if (prevCellLetter && prevCellNumber) {
          cell = `${prevCellLetter}${prevCellNumber}`
        }
        break
    }
    return cell
  },

  _validateCellLine (moves, gameFigures) {
    const res = []
    moves.every(move => {
      // Простая проверка на нахождение фигуры в ячейке
      const figure = gameFigures.filter(i => i.cell.value === move)
      res.push(move)
      return !figure.length
    })
    return res
  },

  getDirectionMoves (direction: Direction, startCellValue: CellValue, gameFigures: Figure[]) {
    let cells = []
    let cell = this._getNextCell(direction, startCellValue)
    while (cell) {
      cells.push(cell)
      cell = this._getNextCell(direction, cell)
    }

    // Проверяем на свои фигуры
    const _clean = []
    cells.every(cell => {
      if (this._isCellFilledByAlly(cell, startCellValue, gameFigures)) {
        return false
      }
      _clean.push(cell)
      return true
    })
    cells = _clean

    // Проверяем правило length
    if ('length' in direction.rules) {
      cells = cells.filter((i, j) => j < direction.rules.length)
    }

    // Проверяем правило enemyBlocking
    if ('enemyBlocking' in direction.rules) {
      const res = []
      if (direction.rules.enemyBlocking === EnemyBlocking.NotIncluding) {
        cells.every(cell => {
          if (this._isCellFilledByEnemy(cell, startCellValue, gameFigures)) {
            return false
          }
          res.push(cell)
          return true
        })
      }
      cells = res
    }

    // Проверяем правило enemyRequired
    if ('enemyRequired' in direction.rules) {
      const res = []
      cells.every(cell => {
        if (!this._isCellFilledByEnemy(cell, startCellValue, gameFigures)) {
          return false
        }
        res.push(cell)
        return true
      })
      cells = res
    }

    return cells
  },

  getAvailableMoves ({ directions, currentCellValue, gameFigures }) {
    if (!gameFigures) {
      console.warn('[helpers][getAvailableMoves] no gameFigures provided')
    }
    let res = []

    if (Array.isArray(directions)) {
      // Собираем ячейки подряд (по направлениям)
      Object.values(directions).forEach((dir: Direction) => {
        let moves = this.getDirectionMoves(dir, currentCellValue, gameFigures)
        moves = this._validateCellLine(moves, gameFigures)
        res = [...res, ...moves]
      })
    } else {
      // Собираем конкретные ячейки (по шагам)
      directions.values.forEach(coordinate => {
        let cell = currentCellValue
        coordinate.forEach(step => {
          const direction = Object.keys(step)[0]
          const amount = step[direction]
          for (let i = 0; i < amount; i++) {
            cell = this._getNextCell({ name: direction }, cell)
          }
        })
        if (cell) {
          res.push(cell)
        }
      })
    }

    return Array.from(new Set(res))
  }
})

export default {
  install: (app, options) => {
    app.config.globalProperties.$helpers = helpers(app, options)
    app.provide('helpers', options)
  }
}
