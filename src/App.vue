<template>
  <DeskComponent />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DeskComponent from '@/components/Desk.vue'

export default defineComponent({
  name: 'App',
  components: {
    DeskComponent
  }
})
</script>

<style lang="scss">
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 4%;
}
</style>
