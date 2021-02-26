import { Figure } from '@/types/Figure'

export class King extends Figure {
  public getAvailableMoves (cell) {
    console.log('[King][getAvailableMoves]', cell)
    return []
  }
}
