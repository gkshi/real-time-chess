<template lang="pug">
.figure-component.flex.center(
  :data-id="data.id"
  :class="classList"
  :style="cellPosition"
  @click="onClick")
  .model(ref="model")
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
      rollbackTimer: 0,
      watcher: null,
      eaten: {
        state: false,
        target: null
      }
    }
  },

  computed: {
    isAvailable () {
      return !this.$store.state.unavailableFigures.find(i => i === this.data.id)
    },

    classList (): any {
      return [
        `-mode-${this.mode}`,
        {
          '-in-rollback': this.inRollback,
          '-unavailable': !this.isAvailable
        }
      ]
    },

    cellPosition (): string {
      const position = this.$store.getters.cellPosition(this.data.cell)
      const top = position.top / 12.5
      const left = position.left / 12.5
      return `transform: translate(${100 * left}%, ${100 * top}%)`
    },

    figure (): string {
      return `figure-${this.data.id}`
    },

    storedFigures (): Figure[] {
      return this.$store.getters.figures
    },

    activeFigure (): Figure | null {
      return this.$store.state.activeFigure
    },

    inRollback (): boolean {
      return this.$store.getters['game/inRollback'](this.data.id)
    },

    rollbackPercent (): number {
      const percent = config.rollbackTime / 100
      return (config.rollbackTime - this.rollbackTimer) / percent
    }
  },

  watch: {
    'data.cell': {
      handler () {
        switch (this.mode) {
          case FigureMode.ChoosingMove:
            this.toggleMode(FigureMode.Moving)
            this.$emitter.emit('figure-started-moving', this.data.id)
            setTimeout(() => {
              this.toggleMode(FigureMode.Default)
              this.$emitter.emit('figure-finished-moving', this.data.id)
            }, this.getTransitionDuration())
            break
        }
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
        if (this.activeFigure?.id === this.data.id) {
          this.toggleMode(FigureMode.Default)
        }
      }
    },

    startRollbackTimer () {
      this.stopRollbackTimer()
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
      const value = parseFloat(transitionDurations[transitionProperties.indexOf('transform')].replace(/[^0-9.]/g, ''))
      return value * 1000
    },

    watchElementModel () {
      // console.log('watchElementModel', this.$refs.model, this.data.cell.value)
      // getBoundingClientRect
      const targetFigure = this.storedFigures.find(i => i.cell.value === this.data.cell.value)
      // console.log('targetFigure', targetFigure)
      if (!targetFigure) {
        return
      }
      // console.log('this.data.cell.value', targetFigure.id)
      const targetEl = document.querySelector(`.figure-component[data-id="${targetFigure.id}"]`)
      // console.log('targetEl', targetEl)
      if (!targetEl) {
        return
      }
      // console.log('targetEl.__vueParentComponent', targetEl.__vueParentComponent.refs.model)
      const targetComponent = targetEl.__vueParentComponent
      // console.log('targetModel', targetModel)
      this.watcher = setInterval(() => {
        this.detectModelsCrossing(targetComponent)
      }, 100)
    },

    unwatchElementModel () {
      // console.log('unwatchElementModel', this.$refs.model)
      clearInterval(this.watcher)
      this.eaten.state = false
      this.eaten.target = null
      this.$emitter.off('figure-finished-moving', this.onFigureFinishedMoving)
    },

    detectModelsCrossing (targetComponent) {
      if (!targetComponent.refs.model) {
        return
      }
      // console.log('[detectModelsCrossing]', targetComponent)
      const selfPosition = this.$refs.model.getBoundingClientRect()
      // console.log('targetComponent', targetComponent)
      const targetPosition = targetComponent.refs.model.getBoundingClientRect()
      // console.log('selfPosition', selfPosition)
      const topLeftRange = [targetPosition.bottom, targetPosition.right]
      // console.log('topLeftRange', selfPosition.top, topLeftRange)
      if (selfPosition.top >= topLeftRange[0] && selfPosition.top <= topLeftRange[1]) {
        // console.log('crossed!', this.eaten)
        if (!this.eaten.state) {
          // this.$store.dispatch('killFigure', targetComponent.props.data.id)
          this.eaten.target = targetComponent.props.data.id
          this.$store.dispatch('markFigureAsUnavailable', this.eaten.target)

          this.$emitter.on('figure-finished-moving', this.onFigureFinishedMoving)
          this.eaten.state = true
        }
      }
    },

    onInit (): void {
      this.$emit('init')
    },

    onClick (): void {
      this.$emitter.emit('click', this.data.id)

      this.$nextTick(() => {
        this.toggleMode()
      })
    },

    onFigureFinishedMoving () {
      // console.log('[onFigureFinishedMoving]')
      this.$store.dispatch('killFigure', this.eaten.target)
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
          if (this.mode === FigureMode.ChoosingMove) {
            this.hideAvailableMoves()
          }
          if (this.mode === FigureMode.Moving) {
            this.unwatchElementModel()
            this.$store.dispatch('game/setRollback', this.data.id)
          }
          break
        case FigureMode.ChoosingMove:
          this.showAvailableMoves()
          this.$store.dispatch('setActiveFigure', this.data)
          break
        case FigureMode.Moving:
          this.watchElementModel()
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

    .model {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 4;
      width: 50%;
      height: 50%;
      transform: translate(-50%, -50%);
      background: rgba(red, .2);
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

    &.-unavailable {
      background: red;
    }

    &.-mode {
      &-choosing-move {
        //
      }
      &-moving {
        cursor: default;
        pointer-events: none;
        z-index: 3;
      }
    }
  }
</style>
