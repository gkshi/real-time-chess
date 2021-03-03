<template lang="pug">
FigureComponent.figure-queen-component(:data="data")
  img(:src="require(`@/assets/svg/figures/queen-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

import FigureComponent from '@/components/Figure.vue'
import { CellValue } from '@/types/Cell'

export default defineComponent({
  name: 'FigureQueenComponent',

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
      return this.$helpers.getAvailableMoves({
        directions: [
          {
            name: 'top-left'
          },
          {
            name: 'top'
          },
          {
            name: 'top-right'
          },
          {
            name: 'right'
          },
          {
            name: 'bottom-right'
          },
          {
            name: 'bottom'
          },
          {
            name: 'bottom-left'
          },
          {
            name: 'left'
          }
        ],
        currentCellValue: this.data.cell.value,
        gameFigures: this.gameFigures
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-queen-component {
    //
  }
</style>
