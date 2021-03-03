import { Figure } from '@/types/Figure'

import { defaultPosition } from '@/config/positions/default'

export default {
  rollbackTime: 1000 as number, // время отката в ms

  deckCols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as string[],

  deck: defaultPosition(),

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
