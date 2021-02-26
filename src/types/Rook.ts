import { Figure } from '@/types/Figure'

export class Rook extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Rook][getAvailableMoves]', cell)
    return []
  }
}
