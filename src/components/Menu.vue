<template lang="pug">
.menu-component
  div
    div timer: {{ timer }}
    button(@click="reset") reset
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuComponent',

  computed: {
    timer () {
      return this.$store.state.game.timer
    }
  },

  methods: {
    reset () {
      this.$store.dispatch('resetGame')
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
  }
</style>
