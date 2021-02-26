import { Figure } from '@/types/Figure'

export class Knight extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Knight][getAvailableMoves]', cell)
    return []
  }
}
