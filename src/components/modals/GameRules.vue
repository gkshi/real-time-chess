<template lang="pug">
ModalWrapper.game-rules-modal-component(:id="id")
  div
    strong Game rules:

  div No need to wait for opponent move.
  div Every figure has rollback time to next move.
  div Play with all your available figures at the moment.
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModalWrapper from '@/components/modals/Wrapper.vue'

export default defineComponent({
  name: 'GameRulesModalComponent',

  components: {
    ModalWrapper
  },

  data () {
    return {
      id: 'game_rules'
    }
  }
})
</script>

<style lang="scss" scoped>
  .game-rules-modal-component {
    //
  }
</style>
