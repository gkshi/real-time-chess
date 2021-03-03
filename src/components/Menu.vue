<template lang="pug">
.menu-component
  section
    div timer: {{ timer }}

  section
    button(@click="reset") Restart game

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
      const min = Math.floor(this.$store.state.game.timer / 60)
      const sec = this.$store.state.game.timer % 60
      return `${min.toString().length < 2 ? `0${min}` : min}:${sec.toString().length < 2 ? `0${sec}` : sec}`
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
