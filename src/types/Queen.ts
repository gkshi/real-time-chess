import { Figure } from '@/types/Figure'

export class Queen extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Queen][getAvailableMoves]', cell)
    return []
  }
}
