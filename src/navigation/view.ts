/**
 * WordPress dependencies
 */
import { store, getContext } from "@wordpress/interactivity"

const NAMESPACE = "hjarts-blocks-ts/navigation"

type ServerState = {
  state: {
    isDark: boolean
    darkText: string
    lightText: string
  }
}

type Context = {
  isOpen: boolean
}

const storeDef = {
  state: {
    // get themeText(): string {
    //   return state.isDark ? state.darkText : state.lightText
    // },
  },
  actions: {
    // toggleOpen() {
    //   const context = getContext<Context>()
    //   context.isOpen = !context.isOpen
    // },
    // toggleTheme() {
    //   state.isDark = !state.isDark
    // },
  },
  callbacks: {
    // logIsOpen: () => {
    //   const { isOpen } = getContext<Context>()
    //   // Log the value of `isOpen` each time it changes.
    //   console.log(`Is open: ${isOpen}`)
    // },
  },
}

type Store = ServerState & typeof storeDef
const createStore = () => store<Store>(NAMESPACE, storeDef)
if (!window.hjarts) {
  window.hjarts = {}
}
const stores = window.hjarts?.store
  ? Object.assign(window.hjarts.store, {
      [NAMESPACE]: createStore(),
    })
  : Object.assign(window.hjarts, { store: { [NAMESPACE]: createStore() } })
const { state } = window.hjarts.store[NAMESPACE]
console.log("DEBUG FROM VIEW")
