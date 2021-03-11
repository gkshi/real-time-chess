<template lang="pug">
.menu-component
  section
    h1 Real-time chess

  section
    div timer: {{ timer }}
    div black figures: {{ blackFiguresAmount }}
    div white figures: {{ whiteFiguresAmount }}

  section.buttons
    div
      button(@click="reset") Restart game
    div
      button(@click="showRules") Show game rules
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuComponent',

  computed: {
    timer (): string {
      const min = Math.floor(this.$store.state.game.timer / 60)
      const sec = this.$store.state.game.timer % 60
      return `${min.toString().length < 2 ? `0${min}` : min}:${sec.toString().length < 2 ? `0${sec}` : sec}`
    },

    blackFiguresAmount (): number {
      return this.$store.getters.figuresByColor('dark').length
    },

    whiteFiguresAmount (): number {
      return this.$store.getters.figuresByColor('white').length
    }
  },

  methods: {
    reset (): void {
      this.$store.dispatch('game/reset')
    },

    showRules (): void {
      this.$store.dispatch('modals/open', 'game_rules')
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

      &.rules {
        background: darken($color-page-bg, 4%);
      }

      &.buttons {
        margin-top: 40px;

        & > * {
          &:not(:last-child) {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
</style>
