import { Rook } from '@/types/Rook'
import { Knight } from '@/types/Knight'
import { Bishop } from '@/types/Bishop'
import { King } from '@/types/King'
import { Queen } from '@/types/Queen'
import { Pawn } from '@/types/Pawn'

export const FigureConstructor = {
  rook: props => new Rook(props),
  knight: props => new Knight(props),
  bishop: props => new Bishop(props),
  king: props => new King(props),
  queen: props => new Queen(props),
  pawn: props => new Pawn(props)
}
