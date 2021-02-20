<template lang="pug">
.figures-component
  FigureComponent(
    v-for="figure in figures"
    :data="figure"
    :key="figure.id")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FigureComponent from '@/components/Figure.vue'

export default defineComponent({
  name: 'FiguresComponent',

  components: {
    FigureComponent
  },

  computed: {
    figures () {
      return this.$store.getters.figures
    }
  }
})
</script>

<style lang="scss" scoped>
  .figures-component {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
</style>
