import { Cell } from '@/types/Cell'
import config from '@/config'

const directions = ['top', 'right', 'down', 'left']

const helpers = () => ({
  validateCellLines: (moves, filledCells, currentCell) => {
    currentCell = new Cell(currentCell)

    let res = []
    const letters = new Set(moves.map(i => {
      const cell = new Cell(i)
      return cell.letter
    }))
    console.log('---')
    console.log('letters', letters)

    letters.forEach((letter: string) => {
      let lines = []
      // const line = []
      const lineFilled = filledCells.filter(i => i.slice(0, 1) === letter)
      const lineMoves = moves.filter(i => i.slice(0, 1) === letter)
      lineFilled.sort()
      lineMoves.sort()
      console.log('lineFilled', lineFilled)
      console.log('lineMoves', lineMoves)
      console.log('currentCell', currentCell.number)

      directions.forEach(dir => {
        console.log('dir', dir)
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
            console.log('stop')
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

    console.log('---')
    return res
  }
})

export default {
  install: (app, options) => {
    app.config.globalProperties.$helpers = helpers()
    // app.provide('helpers', options)

    app.provide('helpers', options)
  }
}
