export enum EnemyBlocking {
  Including = 'including',
  NotIncluding = 'not-including'
}

export enum DirectionName {
  TopLeft = 'top-left',
  Top = 'top',
  TopRight = 'top-right',
  Right = 'right',
  BottomRight = 'bottom-right',
  Bottom = 'bottom',
  BottomLeft = 'bottom-left',
  Left = 'left'
}

export interface DirectionRule {
  length?: number;
  enemyBlocking?: EnemyBlocking,
  enemyRequired?: boolean
}

export interface Direction {
  name?: DirectionName,
  rules?: DirectionRule
}
