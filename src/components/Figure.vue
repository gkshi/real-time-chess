<template lang="pug">
.figure-component.flex.center(:data-name="data.name" :style="cellPosition")
  img(:src="require(`@/assets/svg/figures/${data.id}-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

export default defineComponent({
  name: 'FigureComponent',

  props: {
    data: Object as PropType<Figure>
  },

  computed: {
    cellPosition () {
      return this.$store.getters.cellPosition(this.data.cell) || {}
    }
  },

  mounted () {
    // console.log('cellPosition', this.cellPosition)
  },

  methods: {
    getCellPosition (cell) {
      return this.$store.getters.cellPosition(cell)
      // console.log('[getCellPosition] cell', cell)
      // const storedCell = this.$store.getters.cell({ name: cell })
      // console.log('storedCell', storedCell)
      // const top = storedCell.name.slice(1)
      // console.log('top', top)
      // return 'top: 0; left: 0'
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
    background: rgba(red, .2);

    img {
      display: block;
    }
  }
</style>
