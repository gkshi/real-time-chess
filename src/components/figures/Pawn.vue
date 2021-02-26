<template lang="pug">
FigureComponent.figure-pawn-component(
  :data="data"
  @click="onClick")
  img(:src="require(`@/assets/svg/figures/pawn-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'
import { CellValue } from '@/types/Cell'

import FigureComponent from '@/components/Figure.vue'

export default defineComponent({
  name: 'FigurePawnComponent',

  components: {
    FigureComponent
  },

  props: {
    data: Object as PropType<Figure>
  },

  methods: {
    getAvailableMoves (): CellValue[] {
      const cell = this.data.cell
      console.log('[Pawn][getAvailableMoves] from cell', cell)

      const availableMoves = []
      const isFirstTurn = !this.turns
      const filledCells = this.$store.getters.filledCells
      switch (this.data.color) {
        case 'white':
          availableMoves.push(`${cell.letter}${isFirstTurn ? cell.number + 2 : cell.number + 1}`)
          break
        case 'dark':
          availableMoves.push(`${cell.letter}${isFirstTurn ? cell.number - 2 : cell.number - 1}`)
          break
      }
      // console.log('availableMoves', availableMoves)
      this.turns++
      return availableMoves
    },

    onClick () {
      // console.log('custom pawn onClick')
    },

    onShowAvailableMoves () {
      // console.log('onShowAvailableMoves')
      // const availableCells = this.getAvailableMoves()
      // console.log('available cells:', availableCells)
      // this.$store.dispatch('setHighlightedCells', availableCells)
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-pawn-component {
    //
  }
</style>
