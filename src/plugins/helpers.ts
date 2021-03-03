import { EnemyBlocking, DirectionName, Direction, Directions } from '@/types/Game'
import { Cell, CellValue } from '@/types/Cell'
import { Figure } from '@/types/Figure'
import config from '@/config'

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

  _isCellFilled (targetCell: CellValue, gameFigures: Figure[]) {
    // console.log('[_isCellFilled]', gameFigures)
    return !!gameFigures.find(i => i.cell.value === targetCell)
  },

  _isCellFilledByAlly (targetCell: CellValue, comparingCell, gameFigures: Figure[]) {
    // console.log('[_isCellFilledByAlly]', gameFigures)
    if (!this._isCellFilled(targetCell, gameFigures)) {
      return false
    }
    const targetCellFigure = gameFigures.find(i => i.cell.value === targetCell)
    const comparingCellFigure = gameFigures.find(i => i.cell.value === comparingCell)
    return comparingCellFigure.color === targetCellFigure.color
  },

  _isCellFilledByEnemy (targetCell: CellValue, comparingCell, gameFigures: Figure[]) {
    // console.log('_isCellFilledByEnemy]', gameFigures)
    if (!this._isCellFilled(targetCell, gameFigures)) {
      return false
    }
    const targetCellFigure = gameFigures.find(i => i.cell.value === targetCell)
    const comparingCellFigure = gameFigures.find(i => i.cell.value === comparingCell)
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

  _validateMovesByAlly (moves: CellValue[], startCellValue: CellValue, gameFigures: Figure[]) {
    const _clean = []
    moves.every(cell => {
      if (this._isCellFilledByAlly(cell, startCellValue, gameFigures)) {
        return false
      }
      _clean.push(cell)
      return true
    })
    return _clean
  },

  _validateMovesByRules (moves, rules, startCellValue: CellValue, gameFigures: Figure[]) {
    if (!moves) {
      return []
    }
    // console.log('_validateMovesByRules', gameFigures)
    if (!Array.isArray(moves)) {
      moves = [moves]
    }
    let cells = [...moves]

    rules = rules || {}
    const defaultRules = {
      enemyBlocking: EnemyBlocking.Including,
      enemyRequired: false,
      allyCrossing: false
    }
    rules = { ...defaultRules, ...rules }

    console.log('rules', rules)

    // Проверяем правило length
    if ('length' in rules) {
      cells = cells.slice(0, rules.length)
    }

    console.log('cells1', cells)

    // Проверяем ячейку на союзные фигуры
    cells = this._validateMovesByAlly(cells, startCellValue, gameFigures)

    console.log('cells2', cells)

    // Проверяем правило enemyBlocking
    if ('enemyBlocking' in rules) {
      const res = []
      cells.every(cell => {
        if (this._isCellFilledByEnemy(cell, startCellValue, gameFigures)) {
          if (rules.enemyBlocking === EnemyBlocking.Including) {
            res.push(cell)
          }
          return false
        }
        res.push(cell)
        return true
      })
      cells = res
    }

    console.log('cells3', cells)

    // Проверяем правило enemyRequired
    if ('enemyRequired' in rules) {
      if (rules.enemyRequired) {
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
    }

    console.log('cells4', cells)

    return cells
  },

  _getDirectionMoves (direction: Direction, startCellValue: CellValue, gameFigures: Figure[]) {
    let cells = []
    let cell = this._getNextCell(direction, startCellValue)
    while (cell) {
      cells.push(cell)
      cell = this._getNextCell(direction, cell)
    }
    // cells = this._validateMovesByAlly(cells, startCellValue, gameFigures)
    cells = this._validateMovesByRules(cells, direction.rules, startCellValue, gameFigures)
    return cells
  },

  getAvailableMoves ({ directions, currentCellValue, gameFigures }) {
    if (!gameFigures) {
      console.warn('[helpers][getAvailableMoves] no gameFigures provided')
    }
    let res = []

    if (Array.isArray(directions)) {
      // Собираем ячейки подряд (по направлениям)
      directions = directions as Direction[]
      Object.values(directions).forEach((dir: Direction) => {
        const moves = this._getDirectionMoves(dir, currentCellValue, gameFigures)
        res = [...res, ...moves]
      })
    } else {
      // Собираем конкретные ячейки (по шагам)
      directions = directions as Directions
      directions.values.forEach(coordinate => {
        let cell = currentCellValue
        coordinate.forEach(step => {
          const direction = Object.keys(step)[0]
          const amount = step[direction]
          for (let i = 0; i < amount; i++) {
            cell = this._getNextCell({ name: direction }, cell)
          }
        })
        cell = this._validateMovesByRules(cell, directions.commonRules, currentCellValue, gameFigures)[0]
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
