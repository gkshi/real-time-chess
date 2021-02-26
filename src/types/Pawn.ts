import { Cell } from '@/types/Cell'
import { Figure } from '@/types/Figure'

export class Pawn extends Figure {
  private turns = 0

  public getAvailableMoves (cell) {
    console.log('cell', cell)
    cell = new Cell(cell)
    console.log('[Pawn][getAvailableMoves] from cell', cell)

    const availableMoves = []
    const isFirstTurn = !this.turns
    const filledCells = this.$store.getters.filledCells
    switch (this.color) {
      case 'white':
        availableMoves.push(`${cell.letter}${isFirstTurn ? cell.number + 2 : cell.number + 1}`)
        break
      case 'dark':
        availableMoves.push(`${cell.letter}${isFirstTurn ? cell.number - 2 : cell.number - 1}`)
        break
    }
    console.log('availableMoves', availableMoves)
    this.turns++
    return availableMoves
  }
}
