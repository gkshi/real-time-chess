import config from '@/config'
import { Cell, CellValue } from '@/types/Cell'

enum FigureColor {
  Dark = 'dark',
  White = 'white'
}

export interface Figure {
  id?: string;
  name: string;
  alias?: string;
  color?: FigureColor;
  cell?: Cell;
  targetCell?: Cell;
  key?: string;
}

export class Figure {
  constructor (props) {
    this.id = props.id
    this.alias = props.alias
    this.name = config.figures.find(i => i.alias === props.alias).name
    this.color = props.color
    this.cell = new Cell(props.cell)
    this.targetCell = new Cell(props.cell)
    this.key = Math.random().toString().slice(2, 9)

    this.init()
  }

  init () {
    this.addListeners()
  }

  private addListeners () {

  }
}
