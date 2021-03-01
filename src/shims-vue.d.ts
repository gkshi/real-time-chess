/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

export declare global {
  interface Element {
    __vueParentComponent?: any
  }
}
