import { createPinia, Pinia } from 'pinia'
import { store } from 'quasar/wrappers'
import { Ref } from 'vue'
import { Router } from 'vue-router'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

declare module '@quasar/app' {
  interface QSsrContext {
    state: Ref<never> | never
  }
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Pinia
  }
}

// provide typings for `this.$store`
declare module 'pinia' {
  // eslint-disable-next-line no-undef
  interface PiniaCustomProperties {
    $router: Router
  }
}

declare module 'pinia' {
  // eslint-disable-next-line no-shadow
  interface Pinia {
    // eslint-disable-next-line no-unused-vars
    replaceState(state: never): void
  }
}

export default store(() => {
  const pinia = createPinia()

  if (process.env.CLIENT) {
    pinia.replaceState = (state: never) => {
      pinia.state.value = state
    }
  }

  return pinia
})
