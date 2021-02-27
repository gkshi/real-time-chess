import { Figure } from '@/types/Figure'

export default {
  rollbackTime: 1000 as number, // время отката в ms

  deckCols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as string[],

  deck: {
    A8: {
      figure: 'rook',
      color: 'dark'
    },
    B8: {
      figure: 'knight',
      color: 'dark'
    },
    C8: {
      figure: 'bishop',
      color: 'dark'
    },
    D8: {
      figure: 'king',
      color: 'dark'
    },
    E8: {
      figure: 'queen',
      color: 'dark'
    },
    F8: {
      figure: 'bishop',
      color: 'dark'
    },
    G8: {
      figure: 'knight',
      color: 'dark'
    },
    H8: {
      figure: 'rook',
      color: 'dark'
    },
    A7: {
      figure: 'pawn',
      color: 'dark'
    },
    B7: {
      figure: 'pawn',
      color: 'dark'
    },
    C7: {
      figure: 'pawn',
      color: 'dark'
    },
    D7: {
      figure: 'pawn',
      color: 'dark'
    },
    E7: {
      figure: 'pawn',
      color: 'dark'
    },
    F7: {
      figure: 'pawn',
      color: 'dark'
    },
    G7: {
      figure: 'pawn',
      color: 'dark'
    },
    H7: {
      figure: 'pawn',
      color: 'dark'
    },

    A1: {
      figure: 'rook',
      color: 'white'
    },
    B1: {
      figure: 'knight',
      color: 'white'
    },
    C1: {
      figure: 'bishop',
      color: 'white'
    },
    D1: {
      figure: 'king',
      color: 'white'
    },
    E1: {
      figure: 'queen',
      color: 'white'
    },
    F1: {
      figure: 'bishop',
      color: 'white'
    },
    G1: {
      figure: 'knight',
      color: 'white'
    },
    H1: {
      figure: 'rook',
      color: 'white'
    },
    A2: {
      figure: 'pawn',
      color: 'white'
    },
    B2: {
      figure: 'pawn',
      color: 'white'
    },
    C2: {
      figure: 'pawn',
      color: 'white'
    },
    D2: {
      figure: 'pawn',
      color: 'white'
    },
    E2: {
      figure: 'pawn',
      color: 'white'
    },
    F2: {
      figure: 'pawn',
      color: 'white'
    },
    G2: {
      figure: 'pawn',
      color: 'white'
    },
    H2: {
      figure: 'pawn',
      color: 'white'
    }
  }, // расположение фигур на столе

  figures: [
    {
      alias: 'king',
      name: 'Король'
    },
    {
      alias: 'queen',
      name: 'Королева'
    },
    {
      alias: 'rook',
      name: 'Турка'
    },
    {
      alias: 'bishop',
      name: 'Слон'
    },
    {
      alias: 'knight',
      name: 'Конь'
    },
    {
      alias: 'pawn',
      name: 'Пешка'
    }
  ] as Figure[] // список фигур
}
