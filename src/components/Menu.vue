<template lang="pug">
.menu-component
  section
    div timer: {{ timer }}
    button(@click="reset") reset

  section
    div black figures: {{ blackFiguresAmount }}
    div white figures: {{ whiteFiguresAmount }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuComponent',

  computed: {
    timer () {
      return this.$store.state.game.timer
    },

    blackFiguresAmount () {
      return this.$store.getters.figuresByColor('dark').length
    },

    whiteFiguresAmount () {
      return this.$store.getters.figuresByColor('white').length
    }
  },

  methods: {
    reset () {
      // console.log('this.$store', this.$store)
      this.$store.dispatch('game/reset')
    }
  }
})
</script>

<style lang="scss" scoped>
  .menu-component {
    position: fixed;
    top: 5%;
    left: 5%;
    background: $color-page-bg;

    section {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
</style>
