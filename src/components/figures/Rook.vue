<template lang="pug">
FigureComponent.figure-rook-component(:data="data")
  img(:src="require(`@/assets/svg/figures/rook-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

import FigureComponent from '@/components/Figure.vue'
import { CellValue } from '@/types/Cell'
import { EnemyBlocking } from '@/types/Game'

export default defineComponent({
  name: 'FigureRookComponent',

  components: {
    FigureComponent
  },

  props: {
    data: Object as PropType<Figure>
  },

  computed: {
    gameFigures (): Figure[] {
      return this.$store.state.figures
    }
  },

  methods: {
    getAvailableMoves (): CellValue[] {
      const availableMoves = this.$helpers.getAvailableMoves({
        directions: [
          {
            name: 'top'
          },
          {
            name: 'right'
          },
          {
            name: 'bottom'
          },
          {
            name: 'left'
          }
        ],
        currentCellValue: this.data.cell.value,
        gameFigures: this.gameFigures
      })
      return availableMoves
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-rook-component {
    //
  }
</style>
