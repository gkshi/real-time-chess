<template lang="pug">
.cell-component.flex.center(:class="classList")
  // div {{ data.name }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CellColor } from '@/types/CellColor'

export default defineComponent({
  name: 'CellComponent',

  props: {
    data: Object,
    color: String as PropType<CellColor>,
    index: Number
  },

  computed: {
    classList () {
      return [
        `-color-${this.data.color}`,
        {
          '-highlighted': this.isHighlighted
        }
      ]
    },

    isHighlighted () {
      return this.$store.state.highlightedCells.includes(this.data.name)
    }
  }
})
</script>

<style lang="scss" scoped>
  .cell-component {
    width: 12.5%;
    cursor: default;
    user-select: none;

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
      background: $color-cell-highlighted;
      cursor: pointer;

      &:before {
        content: '';
        position: absolute;
        z-index: 3;
        width: 12.5%;
        height: 12.5%;
      }
    }
  }
</style>
