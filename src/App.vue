<template lang="pug">
main
  DeskComponent
  FiguresComponent
  MenuComponent

  ModalGameFinished
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DeskComponent from '@/components/Desk.vue'
import FiguresComponent from '@/components/Figures.vue'
import MenuComponent from '@/components/Menu.vue'
import ModalGameFinished from '@/components/modals/GameFinished.vue'

export default defineComponent({
  name: 'App',
  components: {
    DeskComponent,
    FiguresComponent,
    MenuComponent,
    ModalGameFinished
  },

  mounted () {
    this.init()
    this.watchSize()
    window.addEventListener('resize', this.watchSize)
  },

  beforeUnmount () {
    window.removeEventListener('resize', this.watchSize)
  },

  methods: {
    init (): void {
      this.$store.dispatch('init')
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

<style lang="scss">
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 4%;

  main {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
}
</style>
