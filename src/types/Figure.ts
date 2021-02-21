import config from '@/config'

enum FigureColor {
  Dark = 'dark',
  White = 'white'
}

type Cell = string

export interface Figure {
  id: string;
  name: string;
  color: FigureColor;
  cell: Cell;
}

export class Figure {
  constructor (props) {
    this.id = props.id
    this.color = props.color
    this.name = config.figures.find(i => i.id === props.id).name
    this.cell = props.cell
  }
}

export class Pawn extends Figure {
  private turns = 0

  public getAvailableMoves (cell) {
    console.log('[Pawn][getAvailableMoves]', cell)
    console.log('this.turns', this.turns)
    this.turns++
    return ['E4']
  }
}

export class Rook extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Rook][getAvailableMoves]', cell)
    return []
  }
}

export class Knight extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Knight][getAvailableMoves]', cell)
    return []
  }
}

export class Bishop extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Bishop][getAvailableMoves]', cell)
    return []
  }
}

export class King extends Figure {
  public getAvailableMoves (cell) {
    console.log('[King][getAvailableMoves]', cell)
    return []
  }
}

export class Queen extends Figure {
  public getAvailableMoves (cell) {
    console.log('[Queen][getAvailableMoves]', cell)
    return []
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
