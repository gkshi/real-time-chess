export const storePlugin = (store) => {
  // called when the store is initialized
  console.log('storePlugin', store)
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
  })
}

// export function globalEmit(eventName, payload) {
//   console.log('emit', eventName, payload)
//   dispatchEvent((window as any)._globalEvents[eventName], {
//     detail: payload
//   })
// }

export function initGlobalEvents () {
  // (window as any)._globalEvents = {}
  // (window as any)._globalEvents.getFilledCells = new CustomEvent('get-filled-cells')
}

export default {
  storePlugin
}
