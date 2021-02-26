export type CellValue = string

export enum CellColor {
  Dark = 'dark',
  White = 'white'
}

export interface Cell {
  id: number;
  name: string;
  color: CellColor;
}

export class Cell {
  constructor (props) {
    if (typeof props === 'string') {
      props = { name: props }
    }

    this.id = props.id
    this.name = props.name
    this.color = props.color
  }

  public get letter () {
    return this.name.slice(0, 1)
  }

  public get number () {
    return +this.name.slice(1)
  }
}
