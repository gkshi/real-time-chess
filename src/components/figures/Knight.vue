<template lang="pug">
FigureComponent.figure-knight-component(:data="data")
  img(:src="require(`@/assets/svg/figures/knight-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

import FigureComponent from '@/components/Figure.vue'
import { CellValue } from '@/types/Cell'

export default defineComponent({
  name: 'FigureKnightComponent',

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
        directions: {
          values: [
            [{ top: 2 }, { left: 1 }],
            [{ top: 2 }, { right: 1 }],
            [{ top: 1 }, { left: 2 }],
            [{ top: 1 }, { right: 2 }],

            [{ right: 2 }, { top: 1 }],
            [{ right: 2 }, { bottom: 1 }],
            [{ right: 1 }, { top: 2 }],
            [{ right: 1 }, { bottom: 2 }],

            [{ bottom: 2 }, { left: 1 }],
            [{ bottom: 2 }, { right: 1 }],
            [{ bottom: 1 }, { left: 2 }],
            [{ bottom: 1 }, { right: 2 }],

            [{ left: 2 }, { top: 1 }],
            [{ left: 2 }, { bottom: 1 }],
            [{ left: 1 }, { top: 2 }],
            [{ left: 1 }, { bottom: 2 }]
          ],
          commonRules: {
            allyCrossing: true
          }
        },
        currentCellValue: this.data.cell.value,
        gameFigures: this.gameFigures
      })
      return availableMoves
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-knight-component {
    //
  }
</style>
