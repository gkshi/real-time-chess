<template lang="pug">
ModalWrapper.game-finished-modal-component(:id="id" :closable="false")
  div Game finished

  div
    span Winner is
    =" "
    strong {{ winner }}

  div
    button(@click="reset") New Game
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FigureColor } from '@/types/Figure'
import ModalWrapper from '@/components/modals/Wrapper.vue'

export default defineComponent({
  name: 'GameFinishedModalComponent',

  components: {
    ModalWrapper
  },

  data () {
    return {
      id: 'game_finished'
    }
  },

  computed: {
    winner (): FigureColor {
      return this.$store.state.game.winner
    }
  },

  methods: {
    reset () {
      this.$store.dispatch('modals/close', this.id)
      this.$store.dispatch('game/reset')
    }
  }
})
</script>

<style lang="scss" scoped>
  .game-finished-modal-component {
    //
  }
</style>
