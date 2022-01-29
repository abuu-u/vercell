import { defineStore } from 'pinia'

type InputDesign = 'default' | 'borderless' | 'filled' | 'outlined' | 'standout'
type InputShape = 'default' | 'rounded' | 'square'
type InputStyle = 'hide-bottom-space' | 'dense'

export type ButtonDesign = 'default' | 'flat' | 'outline' | 'push'
export type ButtonStyle =
  | 'glossy'
  | 'no-caps'
  | 'unelevated'
  | 'rounded'
  | 'fab'
  | 'fab-mini'

export interface FormState {
  inputAndSelect: {
    design: InputDesign
    shape: InputShape
    styles: {
      [k in InputStyle]: boolean
    }
  }

  button: {
    design: ButtonDesign
    styles: {
      [k in ButtonStyle]: boolean
    }
  }
}

const useFormTheme = defineStore({
  id: 'form-theme-module',
  state(): FormState {
    return {
      inputAndSelect: {
        design: 'outlined',
        shape: 'default',
        styles: {
          'hide-bottom-space': true,
          dense: false,
        },
      },
      button: {
        design: 'default',
        styles: {
          fab: false,
          'fab-mini': false,
          'no-caps': false,
          glossy: false,
          rounded: false,
          unelevated: false,
        },
      },
    }
  },
})

export default useFormTheme
