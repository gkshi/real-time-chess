<template lang="pug">
.cell-component.flex.center(:class="`-color-${data.color}`")
  div {{ data.name }}
  .index {{ data.id }}
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

  data () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
  .cell-component {
    width: 12.5%;

    .index {
      font-size: .5em;
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
  }
</style>
