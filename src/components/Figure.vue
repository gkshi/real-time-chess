<template lang="pug">
.figure-component.flex.center(
  :data-id="data.id"
  :data-key="data.key"
  :class="classList"
  :style="cellPosition"
  @click="onClick")
  .model(ref="model")
  .rollback(v-show="inRollback" :style="`height:${rollbackPercent}%`")
  .id {{ data.id }}
  .slot
    slot
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Figure } from '@/types/Figure'
import { Cell } from '@/types/Cell'
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
      const position = this.$store.getters.cellPosition(this.data.targetCell)
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
    'data.targetCell': {
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
    this.$emitter.on('click', this.handleClick)
    this.$emitter.on('figure-finished-moving', this.onFigureFinishedMoving)
  },

  beforeUnmount () {
    this.$emitter.off('click', this.handleClick)
    this.$emitter.off('figure-finished-moving', this.onFigureFinishedMoving)
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
      // console.log('this.data.targetCell.value', this.data.targetCell.value)
      // console.log('this.storedFigures', this.storedFigures)
      const targetFigure = this.storedFigures.find(i => {
        // console.log('i.cell.value', i, i.cell.value)
        return i.cell.value === this.data.targetCell.value
      })
      // console.log('targetFigure', targetFigure, targetFigure.id)
      if (!targetFigure) {
        return
      }
      const targetEl = document.querySelector(`.figure-component[data-id="${targetFigure.id}"]`)
      if (!targetEl) {
        return
      }
      const targetComponent = targetEl.__vueParentComponent
      // console.log('targetComponent', targetComponent, targetComponent.props.data.id)
      this.watcher = setInterval(() => {
        // console.log('targetComponent', targetComponent)
        this.detectModelsCrossing(targetComponent)
      }, 100)
    },

    unwatchElementModel () {
      // console.log('this.eaten.target', this.eaten.target)
      clearInterval(this.watcher)
      this.eaten.state = false
      this.eaten.target = null
    },

    detectModelsCrossing (targetComponent) {
      if (!targetComponent.refs.model || this.eaten.state) {
        return
      }
      const selfPosition = this.$refs.model.getBoundingClientRect()
      const targetPosition = targetComponent.refs.model.getBoundingClientRect()
      // console.log('targetPosition', targetPosition)
      // console.log('selfPosition.top', selfPosition.top, 'selfPosition.left', selfPosition.left)

      const targetSquare = this.getModelSquare(targetPosition)
      const selfSquare = this.getModelSquare(selfPosition)
      // console.log('targetSquare', targetSquare)
      // console.log('selfSquare', selfSquare)

      function fits (point) {
        return (targetSquare[0].top <= point.top && point.top <= targetSquare[3].top) &&
          (targetSquare[3].left <= point.left && point.left <= targetSquare[2].left)
      }

      const isTopLeftCrossing = fits(selfSquare[0])
      const isTopRightCrossing = fits(selfSquare[1])
      const isBottomRightCrossing = fits(selfSquare[2])
      const isBottomLeftCrossing = fits(selfSquare[3])

      const isCrossing = isTopLeftCrossing || isTopRightCrossing || isBottomRightCrossing || isBottomLeftCrossing

      // console.log('isCrossing', isCrossing, [isTopLeftCrossing, isTopRightCrossing, isBottomRightCrossing, isBottomLeftCrossing])

      if (isCrossing) {
        this.eaten.target = targetComponent.props.data.id
        this.$store.dispatch('markFigureAsUnavailable', this.eaten.target)
        this.eaten.state = true
        // console.log('setting new eaten', this.data.id, this.eaten)
      }
    },

    getModelSquare (position) {
      return [
        { top: position.top, left: position.left },
        { top: position.top, left: position.left + position.width },
        { top: position.top + position.height, left: position.left + position.width },
        { top: position.top + position.height, left: position.left }
      ]
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

    onFigureFinishedMoving (id) {
      if (id !== this.data.id) {
        return
      }
      console.log('[onFigureFinishedMoving]', id, this.eaten.state, this.eaten)
      if (this.eaten.target) {
        // const figureIdToKill = this.eaten.target
        // console.log('this.eaten.target', this.eaten.target)
        const targetFigure = this.$store.getters.figure({ id: this.eaten.target })
        // console.log('targetFigure', targetFigure)
        const targetCell = this.$store.getters.cell(targetFigure.cell.value)
        // console.log('total cell', targetCell, targetCell.value)
        this.$store.dispatch('updateFigure', {
          query: { id: this.data.id },
          data: { cell: targetCell }
        })

        this.$store.dispatch('killFigure', this.eaten.target)
      } else {
        // const cell = new Cell()
        this.$store.dispatch('updateFigure', {
          query: { id: this.data.id },
          data: { cell: this.data.targetCell }
        })
      }

      this.$nextTick(() => {
        this.unwatchElementModel()
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
          if (this.mode === FigureMode.ChoosingMove) {
            this.hideAvailableMoves()
          }
          if (this.mode === FigureMode.Moving) {
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
      this.$store.dispatch('setHighlightedCells', availableCells)
    },

    hideAvailableMoves (): void {
      this.$store.dispatch('setHighlightedCells', [])
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

    .id {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 4;
      transform: translate(-50%, -50%);
      color: white;
      /*text-shadow: 1px 1px 1px black;*/
      background: black;
      line-height: 1;
      font-size: .6rem;
      font-weight: 600;
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
      background: deeppink;
      pointer-events: none;
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
