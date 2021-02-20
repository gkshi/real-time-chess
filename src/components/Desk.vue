<template lang="pug">
.desk-component.flex.wrap
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
      desk: [],
      generator: {
        reverse: false
      }
    }
  },

  created () {
    this.generateDeck()
  },

  mounted () {
    this.watchSize()
    window.addEventListener('resize', this.watchSize)
  },

  beforeUnmount () {
    window.removeEventListener('resize', this.watchSize)
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
    },

    cellColor (i) {
      const reverse = [8, 16, 24, 32, 40, 48, 56]
      if (reverse.includes(i)) {
        this.generator.reverse = !this.generator.reverse
      }
      return this.generator.reverse
        ? i % 2 ? 'white' : 'dark'
        : i % 2 ? 'dark' : 'white'
    },

    watchSize (): void {
      this.$nextTick(() => {
        const orientation = window.innerWidth < window.innerHeight ? 'vertical' : 'horizontal'
        switch (orientation) {
          case 'horizontal':
            this.$el.style.width = `${this.$el.offsetHeight}px`
            break
          case 'vertical':
            this.$el.style.height = `${this.$el.offsetWidth}px`
            break
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  .desk-component {
    margin: 0 auto;
    background: #f1f1f1;
    height: 100%;
  }
</style>
