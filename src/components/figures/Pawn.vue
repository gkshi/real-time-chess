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

  data () {
    return {
      moves: 0
    }
  },

  mounted () {
    this.$emitter.on('figure-started-moving', this.onFigureStartedMoving)
  },

  methods: {
    getAvailableMoves (): CellValue[] {
      const cell = this.data.cell
      console.log('[Pawn][getAvailableMoves] from cell', cell)

      const availableMoves = []
      const isFirstMove = !this.moves
      // const filledCells = this.$store.getters.filledCells
      switch (this.data.color) {
        case 'white':
          availableMoves.push(`${cell.letter}${cell.number + 1}`)
          if (isFirstMove) {
            availableMoves.push(`${cell.letter}${cell.number + 2}`)
          }
          break
        case 'dark':
          availableMoves.push(`${cell.letter}${cell.number - 1}`)
          if (isFirstMove) {
            availableMoves.push(`${cell.letter}${cell.number - 2}`)
          }
          break
      }
      // console.log('availableMoves', availableMoves)
      // this.moves++
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
