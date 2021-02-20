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
