import { Cell, CellColor, CellValue } from '@/types/Cell'
import { EnemyBlocking, DirectionName, Direction } from '@/types/Game'
import config from '@/config'
import { Figure } from '@/types/Figure'
import game from '@/store/game'

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

      DIRECTIONS.STRONG.forEach((dir: DirectionName) => {
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
            case 'bottom':
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

  diagonalCells (currentCellValue: CellValue) {
    // console.log('---')
    const res = {}
    const currentCell = new Cell(currentCellValue) as Cell
    // console.log('currentCell', currentCell)
    const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    directions.forEach(dir => {
      // console.log('dir', dir)
      // const index = 1
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
            const nextNumber = +cell.slice(1) !== this.maxNumber ? +cell.slice(1) + 1 : 0
            if (nextLetter && nextNumber) {
              cell = `${nextLetter}${nextNumber}`
            } else {
              doing = false
            }
          }
          break

        case 'top-right':
          cell = `${config.deckCols[prevIndex + 1]}${currentCell.number + 1}`
          while (doing) {
            cells.push(cell)
            const letterIndex = config.deckCols.indexOf(cell.slice(0, 1))
            const nextLetter = config.deckCols[letterIndex + 1]
            const nextNumber = +cell.slice(1) !== this.maxNumber ? +cell.slice(1) + 1 : 0
            if (nextLetter && nextNumber) {
              cell = `${nextLetter}${nextNumber}`
            } else {
              doing = false
            }
          }
          break

        case 'bottom-left':
          cell = `${config.deckCols[prevIndex - 1]}${currentCell.number - 1}`
          while (doing) {
            cells.push(cell)
            const letterIndex = config.deckCols.indexOf(cell.slice(0, 1))
            const nextLetter = config.deckCols[letterIndex - 1]
            const nextNumber = +cell.slice(1) !== this.minNumber ? +cell.slice(1) - 1 : 0
            if (nextLetter && nextNumber) {
              cell = `${nextLetter}${nextNumber}`
            } else {
              doing = false
            }
          }
          break

        case 'bottom-right':
          cell = `${config.deckCols[prevIndex + 1]}${currentCell.number - 1}`
          while (doing) {
            cells.push(cell)
            const letterIndex = config.deckCols.indexOf(cell.slice(0, 1))
            const nextLetter = config.deckCols[letterIndex + 1]
            const nextNumber = +cell.slice(1) !== this.minNumber ? +cell.slice(1) - 1 : 0
            if (nextLetter && nextNumber) {
              cell = `${nextLetter}${nextNumber}`
            } else {
              doing = false
            }
          }
          break
      }

      res[dir] = cells
    })
    // console.log('---')
    return res
  },

  validateDiagonalCells: ({ moves, currentCellValue, filledCells, length }) => {
    // console.log('validateDiagonalCells', moves, currentCellValue, filledCells, length)
    Object.keys(moves).forEach(key => {
      const line = []
      moves[key].every((cell: CellValue) => {
        line.push(cell)
        return !filledCells.includes(cell)
      })

      moves[key] = line
    })

    if (length) {
      Object.keys(moves).forEach(key => {
        moves[key] = moves[key].slice(0, length)
      })
    }
    return moves
  },

  getLine: (direction) => {
    console.log('[get line]', direction)
  },

  _isCellFilled (targetCell, figures) {
    return !!figures.find(i => i.cell.value === targetCell)
  },

  _isCellFilledByEnemy (targetCell, comparingCell, figures) {
    // console.log('[_isCellFilledByEnemy]', targetCell, comparingCell)
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

  _getNextCell (direction: Direction, startCellValue: CellValue) {
    // console.log('[_getNextCell]', direction, startCellValue)
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
    // console.log('_validateCellLine', moves, gameFigures)
    const res = []
    moves.every(move => {
      const figure = gameFigures.filter(i => i.cell.value === move)
      // console.log('figure', figure)
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

    // length
    if ('length' in direction.rules) {
      cells = cells.filter((i, j) => j < direction.rules.length)
    }

    // enemyBlocking
    if ('enemyBlocking' in direction.rules) {
      const res = []
      if (direction.rules.enemyBlocking === EnemyBlocking.NotIncluding) {
        // console.log('!! cells', cells, cells.length, cells.every)
        cells.every(cell => {
          // console.log('<< cell', cell)
          if (this._isCellFilledByEnemy(cell, startCellValue, gameFigures)) {
            return false
          }
          res.push(cell)
          return true
        })
      }
      cells = res
    }

    // enemyRequired
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

    console.log('[getDirectionMoves]', cells)
    return cells
  },

  getAvailableMoves ({ directions, currentCellValue, gameFigures }) {
    console.log('[getAvailableMoves]')
    let res = []
    Object.values(directions).forEach((dir: Direction) => {
      console.log('dir:', dir.name, ', rules: ', dir.rules)
      let moves = this.getDirectionMoves(dir, currentCellValue, gameFigures)
      console.log('dir moves', moves)
      moves = this._validateCellLine(moves, gameFigures)
      res = [...res, ...moves]
    })
    return res
  }
})

export default {
  install: (app, options) => {
    app.config.globalProperties.$helpers = helpers(app, options)
    app.provide('helpers', options)
  }
}
