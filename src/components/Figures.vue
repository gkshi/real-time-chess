<template lang="pug">
.figures-component(@click="onClick")
  component(
    v-for="figure in figures"
    :is="`figure-${figure.alias}`"
    :data="figure"
    :key="figure.key")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Figure } from '@/types/Figure'

import FigureRook from '@/components/figures/Rook.vue'
import FigureKnight from '@/components/figures/Knight.vue'
import FigureBishop from '@/components/figures/Bishop.vue'
import FigureKing from '@/components/figures/King.vue'
import FigureQueen from '@/components/figures/Queen.vue'
import FigurePawn from '@/components/figures/Pawn.vue'

export default defineComponent({
  name: 'FiguresComponent',

  components: {
    FigureRook,
    FigureKnight,
    FigureBishop,
    FigureKing,
    FigureQueen,
    FigurePawn
  },

  computed: {
    isGameStarted (): boolean {
      return this.$store.getters['game/started']
    },

    figures (): Figure[] {
      return this.$store.getters.figures
    }
  },

  methods: {
    onClick () {
      if (!this.isGameStarted) {
        this.$store.dispatch('game/start')
      }
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
