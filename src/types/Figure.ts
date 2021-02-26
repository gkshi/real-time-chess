import config from '@/config'
import { CellValue } from '@/types/Cell'
import { Pawn } from '@/types/Pawn'
import { Rook } from '@/types/Rook'
import { Knight } from '@/types/Knight'
import { Bishop } from '@/types/Bishop'
import { King } from '@/types/King'
import { Queen } from '@/types/Queen'

enum FigureColor {
  Dark = 'dark',
  White = 'white'
}

export interface Figure {
  id: string;
  name: string;
  color: FigureColor;
  cell: CellValue;
  $store: any;
}

export class Figure {
  constructor (props) {
    this.id = props.id
    this.color = props.color
    this.name = config.figures.find(i => i.id === props.id).name
    this.cell = props.cell
    this.$store = props.$store
  }
}

export const FigureConstructor = {
  rook: props => new Rook(props),
  knight: props => new Knight(props),
  bishop: props => new Bishop(props),
  king: props => new King(props),
  queen: props => new Queen(props),
  pawn: props => new Pawn(props)
}
