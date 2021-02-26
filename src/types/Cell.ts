export type CellValue = string

export enum CellColor {
  Dark = 'dark',
  White = 'white'
}

export interface Cell {
  id: number;
  value: CellValue;
  color: CellColor;
}

export class Cell {
  constructor (props) {
    if (typeof props === 'string') {
      props = { value: props }
    }

    this.id = props.id
    this.value = props.value
    this.color = props.color
  }

  public get letter () {
    return this.value ? this.value.slice(0, 1) : undefined
  }

  public get number () {
    return this.value ? +this.value.slice(1) : undefined
  }
}
