<template lang="pug">
.cell-component.flex.center(:class="classList" @click="onClick")
  // .figure-id() {{ figureId }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Cell } from '@/types/Cell'
import { Figure } from '@/types/Figure'

export default defineComponent({
  name: 'CellComponent',

  props: {
    data: Object as PropType<Cell>,
    index: Number as PropType<number>
  },

  computed: {
    classList (): any {
      return [
        `-color-${this.data.color}`,
        {
          '-highlighted': this.isHighlighted
        }
      ]
    },

    isHighlighted (): boolean {
      return this.$store.state.highlightedCells.includes(this.data.value)
    }

    // figure (): Figure {
    //   return this.$store.state.figures.find(i => i.cell.value === this.data.value)
    // },

    // figureId () {
    //   return this.figure?.id || null
    // }
  },

  methods: {
    onClick () {
      // console.log('[cell][onClick]', this.data.value)
      this.$store.dispatch('game/makeMove', {
        cell: this.data.value
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  .cell-component {
    width: 12.5%;
    cursor: default;
    user-select: none;

    .figure-id {
      position: absolute;
      z-index: 3;
      font-size: .45rem;
      font-weight: 500;
      line-height: 1;
      transform: translate(180%, 240%);
      color: black;
      background: white;
    }

    &.-color {
      &-white {
        background: $color-cell-white;
      }
      &-dark {
        background: $color-cell-dark;
        color: $color-text-light;
      }
    }

    &.-highlighted {
      cursor: pointer;

      &:before {
        content: '';
        position: absolute;
        z-index: 3;
        width: 12.5%;
        height: 12.5%;
        background: $color-cell-highlighted;
      }
    }
  }
</style>
