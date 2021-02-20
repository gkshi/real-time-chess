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
import CellComponent from '@/components/Cell.vue'

export default defineComponent({
  name: 'DeskComponent',

  components: {
    CellComponent
  },

  data () {
    return {
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      desk: [],
      generator: {
        reverse: false
      }
    }
  },

  created () {
    this.generateDeck()
  },

  methods: {
    generateDeck (): void {
      const rows = ['8', '7', '6', '5', '4', '3', '2', '1']
      const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      const desk = []
      let i = 0
      rows.forEach(row => {
        cols.forEach(col => {
          desk.push({
            id: i,
            name: `${col}${row}`,
            color: this.cellColor(i)
          })
          i++
        })
      })
      this.desk = desk
      this.$store.dispatch('generateDeck')
      console.log('desk', desk)
    },

    cellColor (i) {
      const reverse = [8, 16, 24, 32, 40, 48, 56]
      if (reverse.includes(i)) {
        this.generator.reverse = !this.generator.reverse
      }
      return this.generator.reverse
        ? i % 2 ? 'white' : 'dark'
        : i % 2 ? 'dark' : 'white'
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
