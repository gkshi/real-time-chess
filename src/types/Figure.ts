import config from '@/config'
import { CellValue } from '@/types/Cell'

enum FigureColor {
  Dark = 'dark',
  White = 'white'
}

export interface Figure {
  id?: string;
  name: string;
  alias?: string;
  color?: FigureColor;
  cell?: CellValue;
}

export class Figure {
  constructor (props) {
    this.id = props.id
    this.alias = props.alias
    this.name = config.figures.find(i => i.alias === props.alias).name
    this.color = props.color
    this.cell = props.cell

    this.init()
  }

  init () {
    this.addListeners()
  }

  private addListeners () {

  }
}
