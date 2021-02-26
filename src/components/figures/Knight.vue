<template lang="pug">
FigureComponent.figure-knight-component(:data="data")
  img(:src="require(`@/assets/svg/figures/knight-${data.color}.svg`)")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'

import FigureComponent from '@/components/Figure.vue'

export default defineComponent({
  name: 'FigureKnightComponent',

  components: {
    FigureComponent
  },

  props: {
    data: Object as PropType<Figure>
  }
})
</script>

<style lang="scss" scoped>
  .figure-knight-component {
    //
  }
</style>
