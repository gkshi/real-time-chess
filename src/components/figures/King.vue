<template lang="pug">
FigureComponent.figure-king-component(:data="data")
  img(:src="require(`@/assets/svg/figures/king-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

import FigureComponent from '@/components/Figure.vue'
import { CellValue } from '@/types/Cell'

export default defineComponent({
  name: 'FigureKingComponent',

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
            name: 'top-left',
            rules: {
              length: 1
            }
          },
          {
            name: 'top',
            rules: {
              length: 1
            }
          },
          {
            name: 'top-right',
            rules: {
              length: 1
            }
          },
          {
            name: 'right',
            rules: {
              length: 1
            }
          },
          {
            name: 'bottom-right',
            rules: {
              length: 1
            }
          },
          {
            name: 'bottom',
            rules: {
              length: 1
            }
          },
          {
            name: 'bottom-left',
            rules: {
              length: 1
            }
          },
          {
            name: 'left',
            rules: {
              length: 1
            }
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
  .figure-king-component {
    //
  }
</style>
