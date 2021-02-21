<template lang="pug">
.figure-component.flex.center(
  :data-name="data.name"
  :class="classList"
  :style="cellPosition"
  @click="toggleMode")
  img(:src="require(`@/assets/svg/figures/${data.id}-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

enum FigureMode {
  Default = 'default',
  ChoosingMove = 'choosing-move',
  Moving = 'moving'
}

export default defineComponent({
  name: 'FigureComponent',

  props: {
    data: Object as PropType<Figure>
  },

  data () {
    return {
      mode: 'default' as FigureMode
    }
  },

  computed: {
    classList (): string {
      return `-mode-${this.mode}`
    },

    cellPosition (): object {
      return this.$store.getters.cellPosition(this.data.cell) || {}
    }
  },

  watch: {
    mode (mode) {
      if (mode === FigureMode.ChoosingMove) {
        this.showAvailableMoves()
      } else {
        this.hideAvailableMoves()
      }
    }
  },

  mounted () {
    console.log('figure', this.data)
  },

  methods: {
    toggleMode (): void {
      switch (this.mode) {
        case 'default':
          this.mode = FigureMode.ChoosingMove
          break
        default:
          this.mode = FigureMode.Default
          break
      }
    },

    showAvailableMoves (): void {
      const availableCells = this.data.getAvailableMoves(this.data.cell)
      console.log('available cells:', availableCells)
      this.$store.dispatch('setHighlightedCells', availableCells)
    },

    hideAvailableMoves (): void {
      console.log('hideAvailableMoves')
      this.$store.dispatch('setHighlightedCells', [])
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-component {
    position: absolute;
    z-index: 2;
    width: 12.5%;
    height: 12.5%;
    user-select: none;
    cursor: pointer;
    padding: 2%;
    transition: $transition-figure;

    img {
      display: block;
    }

    &.-mode {
      &-choosing-move {
        background: $color-cell-highlighted;
      }
    }
  }
</style>
