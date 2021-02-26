<template lang="pug">
.figure-component.flex.center(
  :data-id="data.id"
  :class="classList"
  :style="cellPosition"
  @click="onClick")
  .rollback(v-show="inRollback" :style="`height:${rollbackPercent}%`")
  .slot
    slot
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'
import config from '@/config'

enum FigureMode {
  Default = 'default',
  ChoosingMove = 'choosing-move',
  Moving = 'moving'
}

export default defineComponent({
  name: 'FigureComponent',

  props: {
    data: Object as PropType<Figure>
  },

  data () {
    return {
      mode: 'default' as FigureMode,
      interval: null,
      rollbackTimer: 0
    }
  },

  computed: {
    classList (): any {
      return [
        `-mode-${this.mode}`,
        {
          '-in-rollback': this.inRollback
        }
      ]
    },

    cellPosition (): object {
      return this.$store.getters.cellPosition(this.data.cell) || {}
    },

    figure (): string {
      return `figure-${this.data.id}`
    },

    activeFigure (): Figure | null {
      return this.$store.state.activeFigure
    },

    inRollback (): boolean {
      return this.$store.getters['game/inRollback'](this.data.id)
    },

    rollbackPercent () {
      // console.log('---')
      const percent = config.rollbackTime / 100
      // console.log('percent', percent)
      // console.log('this.rollbackTimer', this.rollbackTimer)
      const res = (config.rollbackTime - this.rollbackTimer) / percent
      // console.log('res', res)
      return res
    }
  },

  watch: {
    mode (mode) {
      // switch (mode) {
      //   case FigureMode.Default:
      //     console.log('запускаем откат')
      //     this.$store.dispatch('game/setRollback', this.data.id)
      //     break
      //   case FigureMode.ChoosingMove:
      //     this.showAvailableMoves()
      //     break
      //   default:
      //     this.hideAvailableMoves()
      //     break
      // }
      if (mode === FigureMode.ChoosingMove) {
        this.showAvailableMoves()
      } else {
        this.hideAvailableMoves()
      }
    },

    'data.cell': {
      handler () {
        // console.log('<< data.cell changed', this.data.cell)
        console.log('!! cell changed', this.mode)
        switch (this.mode) {
          case FigureMode.ChoosingMove:
            this.toggleMode(FigureMode.Moving)
            setTimeout(() => {
              this.toggleMode(FigureMode.Default)
            }, this.getTransitionDuration())
            break
        }
        // this.toggleMode(FigureMode.Default)
      },
      deep: true
    },

    inRollback (inRollback) {
      inRollback ? this.startRollbackTimer() : this.stopRollbackTimer()
    }
  },

  mounted () {
    this.onInit()
    // this.$on('click', this.handleClick)
    this.$emitter.on('click', this.handleClick)
  },

  beforeUnmount () {
    // this.$off('click')
    this.$emitter.off('click', this.handleClick)
  },

  methods: {
    handleClick (id) {
      if (this.data.id !== id) {
        // console.log('< activeFigure id', this.activeFigure?.id)
        // console.log('< this.data.id', this.data.id)
        if (this.activeFigure?.id === this.data.id) {
          this.toggleMode(FigureMode.Default)
        }
      }
    },

    startRollbackTimer () {
      this.stopRollbackTimer()
      // this.$nextTick(() => {
      //   this.rollbackTimer = 1000
      // })
      setTimeout(() => {
        this.rollbackTimer = 1000
      }, 100)
      this.interval = setInterval(() => {
        this.rollbackTimer += 1000
      }, 1000)
    },

    stopRollbackTimer () {
      clearInterval(this.interval)
      this.rollbackTimer = 0
    },

    getTransitionDuration () {
      const css = (window as any).getComputedStyle(this.$el)
      const transitionProperties = css.transitionProperty.split(', ')
      const transitionDurations = css.transitionDuration.split(', ')
      const value = parseFloat(transitionDurations[transitionProperties.indexOf('top')].replace(/[^0-9.]/g, ''))
      return value * 1000
    },

    onInit (): void {
      this.$emit('init')
    },

    onClick (): void {
      // console.log('figure onClick', this.data.id)
      this.$emitter.emit('click', this.data.id)

      this.$nextTick(() => {
        this.toggleMode()
      })
    },

    toggleMode (to?:FigureMode): void {
      if (!to) {
        switch (this.mode) {
          case FigureMode.Default:
            to = FigureMode.ChoosingMove
            break
          default:
            to = FigureMode.Default
            break
        }
      }

      switch (to) {
        case FigureMode.Default:
          console.log('<<<<<<')
          // console.log('@ activeFigure', this.activeFigure)
          if (this.mode === FigureMode.Moving) {
            this.$store.dispatch('game/setRollback', this.data.id)
          }
          break
        case FigureMode.ChoosingMove:
          this.$store.dispatch('setActiveFigure', this.data)
          break
        case FigureMode.Moving:
          this.$store.dispatch('setActiveFigure', null)
          break
      }

      this.mode = to
    },

    showAvailableMoves (): void {
      const availableCells = this.$parent.getAvailableMoves()
      // console.log('available cells:', availableCells)
      this.$store.dispatch('setHighlightedCells', availableCells)
      // this.$emit('show-available-moves')
    },

    hideAvailableMoves (): void {
      this.$store.dispatch('setHighlightedCells', [])
      // this.$emit('hide-available-moves')
    }
  }
})
</script>

<style lang="scss" scoped>
  .figure-component {
    position: absolute;
    z-index: 2;
    width: 12.5%;
    height: 12.5%;
    user-select: none;
    cursor: pointer;
    padding: 2%;
    transition: $transition-figure;

    img {
      display: block;
    }

    .rollback {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: rgba($color-primary, .2);
      transition: $transition-rollback;
    }

    .slot {
      position: relative;
      z-index: 2;
    }

    &.-in-rollback {
      cursor: default;
      pointer-events: none;
    }

    &.-mode {
      &-choosing-move {
        background: $color-cell-highlighted;
      }
      &-moving {
        cursor: default;
        pointer-events: none;
      }
    }
  }
</style>
