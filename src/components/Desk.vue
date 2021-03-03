<template lang="pug">
.desk-component.flex.wrap
  .labels
    .flex.column.j-around
      div(v-for="number in 8" :key="number") {{ 9 - number }}
    .flex.a-center.j-around
      div(v-for="letter in letters" :key="letter") {{ letter }}

  CellComponent(
    v-for="cell in desk"
    :data="cell"
    :key="cell.id")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Cell } from '@/types/Cell'
import CellComponent from '@/components/Cell.vue'

export default defineComponent({
  name: 'DeskComponent',

  components: {
    CellComponent
  },

  computed: {
    desk (): Cell[] {
      return this.$store.state.desk
    },

    letters (): string[] {
      return this.$store.state._generator.cols
    }
  }
})
</script>

<style lang="scss" scoped>
  .desk-component {
    margin: 0 auto;
    background: #f1f1f1;
    width: 100%;
    height: 100%;

    &:after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      z-index: -1;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      background: $color-cell-dark;
    }

    .labels {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;

      & > div {
        font-weight: $font-weight-semibold;

        &:first-child {
          width: auto;
          height: 100%;
          transform: translate(-8%, 0);
          font-size: 1.2rem;
        }

        &:last-child {
          display: flex;
          width: 100%;
          font-size: 1.2rem;
          transform: translate(0, 50%);
        }
      }
    }
  }
</style>
