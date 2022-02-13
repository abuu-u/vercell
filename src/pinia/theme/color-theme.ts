import { defineStore } from 'pinia'

export type Colors =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'dark'
  | 'positive'
  | 'negative'
  | 'info'
  | 'warning'

export type ColorState = {
  [k in Colors]: string
}

const useColorTheme = defineStore({
  id: 'color-theme-module',
  state(): ColorState {
    return {
      primary: '#701cff',
      secondary: '#26a69a',
      accent: '#ea5757',
      dark: '#1d1d1d',
      positive: '#21ba45',
      negative: '#c10015',
      info: '#31ccec',
      warning: '#f2c037',
    }
  },
})

export default useColorTheme
