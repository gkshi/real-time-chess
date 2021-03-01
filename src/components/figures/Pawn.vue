<template lang="pug">
FigureComponent.figure-pawn-component(:data="data")
  img(:src="require(`@/assets/svg/figures/pawn-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'
import { Cell, CellValue } from '@/types/Cell'

import FigureComponent from '@/components/Figure.vue'
import { EnemyBlocking } from '@/types/Game'

export default defineComponent({
  name: 'FigurePawnComponent',

  components: {
    FigureComponent
  },

  props: {
    data: Object as PropType<Figure>
  },

  data () {
    return {
      moves: 0
    }
  },

  computed: {
    filledCells (): Cell[] {
      return this.$store.getters.filledCells
    },

    gameFigures (): Figure[] {
      return this.$store.state.figures
    },

    filledCellValues (): CellValue[] {
      return this.$store.getters.filledCellValues
    },

    isFirstMove (): boolean {
      return !this.moves
    }
  },

  mounted () {
    this.$emitter.on('figure-started-moving', this.onFigureStartedMoving)
  },

  beforeUnmount () {
    this.$emitter.off('figure-started-moving', this.onFigureStartedMoving)
  },

  methods: {
    getAvailableMoves (): CellValue[] {
      const availableMoves = this.$helpers.getAvailableMoves({
        directions: [
          {
            name: this.data.color === 'white' ? 'top-left' : 'bottom-left',
            rules: {
              length: 1,
              enemyRequired: true
            }
          },
          {
            name: this.data.color === 'white' ? 'top' : 'bottom',
            rules: {
              length: this.isFirstMove ? 2 : 1,
              enemyBlocking: EnemyBlocking.NotIncluding
            }
          },
          {
            name: this.data.color === 'white' ? 'top-right' : 'bottom-right',
            rules: {
              length: 1,
              enemyRequired: true
            }
          }
        ],
        currentCellValue: this.data.cell.value,
        gameFigures: this.gameFigures
      })
      console.log('availableMoves', availableMoves)
      return availableMoves
    },

    onClick () {
      // console.log('custom pawn onClick')
    },

    onFigureStartedMoving (payload) {
      if (this.data.id === payload) {
        this.moves++
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-pawn-component {
    //
  }
</style>
