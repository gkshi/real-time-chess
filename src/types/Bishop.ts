import { Figure } from '@/types/Figure'

export class Bishop extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Bishop][getAvailableMoves]', cell)
    return []
  }
}
