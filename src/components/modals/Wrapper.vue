<template lang="pug">
transition
  .modal-component(v-if="show" @click.self="close")
    .modal-scroll-parent(@click.self="close")
      dialog(:open="show" :class="classList")
        .close.flex.center(v-if="closable" @click="close")
          IconCross

        .head(v-if="$slots.head")
          slot(name="head")

        .body
          slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconCross from '@/components/icons/Cross.vue'

enum Size {
  default = 'default'
}

enum Types {
  default = 'default'
}

export default defineComponent({
  name: 'ModalComponent',

  components: {
    IconCross
  },

  props: {
    id: String,
    size: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'default'
    },
    closable: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    classList (): any {
      return `modal-size-${this.size} modal-type-${this.type}`
    },

    modals (): string[] {
      return this.$store.state.modals.list
    },

    show (): boolean {
      return this.modals.includes(this.id)
    }
  },

  watch: {
    show () {
      if (this.show) {
        this.$emit('open')
        this.$nextTick(() => {
          const delay = parseFloat(getComputedStyle(this.$el).transitionDuration) * 1000
          setTimeout(() => {
            this.$emit('opened')
          }, delay)
        })
      } else {
        this.$emit('close')
      }
    }
  },

  mounted () {
    document.addEventListener('keyup', this.onKeyup)
  },

  beforeUnmount () {
    document.removeEventListener('keyup', this.onKeyup)
  },

  methods: {
    open (): void {
      this.$store.dispatch('modals/open', this.id)
    },

    close (): void {
      if (this.closable) {
        this.$store.dispatch('modals/close', this.id)
      }
    },

    onKeyup (e: KeyboardEvent): void {
      const key = e.key ? e.key.toLowerCase() : e.code ? e.code.toLowerCase() : e.keyCode
      if (key === 'escape' || key === 27) {
        this.closeLastModal()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  $modal-padding: 30px;

  .modal-component {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding: $modal-padding 0 0;
    background: rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    overflow: auto;
    transition: $transition-modal;

    .modal-scroll-parent {
      max-height: 100%;
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: $color-text-light;
      transition: $transition-default;

      svg {
        width: 14px;
        height: 14px;
      }

      &:hover {
        color: $color-text-regular;
      }
    }

    dialog {
      position: relative;
      display: block;
      max-width: 100%;
      margin-bottom: $modal-padding;
      padding: 40px;
      border: 1px solid rgba($color-dark, .1);
      border-radius: $border-radius-default;
      background: $color-modal-bg;
      color: inherit;
      transition: $transition-modal;
      box-shadow: $box-shadow-modal;

      &.modal-size {
        &-default {
          // width: 640px;
          padding: 40px 60px 50px;
        }
      }
    }

    &.v-enter,
    &.v-leave-active {
      opacity: 0;
      transform: translate(0, 4px);
    }
  }
</style>
