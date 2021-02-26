<template lang="pug">
FigureComponent.figure-queen-component(:data="data")
  img(:src="require(`@/assets/svg/figures/queen-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

import FigureComponent from '@/components/Figure.vue'

export default defineComponent({
  name: 'FigureQueenComponent',

  components: {
    FigureComponent
  },

  props: {
    data: Object as PropType<Figure>
  }
})
</script>

<style lang="scss" scoped>
  .figure-queen-component {
    //
  }
</style>
