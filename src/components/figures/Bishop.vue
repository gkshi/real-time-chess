<template lang="pug">
FigureComponent.figure-bishop-component(:data="data")
  img(:src="require(`@/assets/svg/figures/bishop-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'
import { CellValue } from '@/types/Cell'
import FigureComponent from '@/components/Figure.vue'

export default defineComponent({
  name: 'FigureBishopComponent',

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
            name: 'top-left'
          },
          {
            name: 'top-right'
          },
          {
            name: 'bottom-right'
          },
          {
            name: 'bottom-left'
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
  .figure-bishop-component {
    //
  }
</style>
