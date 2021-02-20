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
    this.id = props.id
    this.name = props.name
    this.color = props.color
  }
}
