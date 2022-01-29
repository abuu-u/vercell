import { Ref } from 'vue'

export const required = (errTxt: string) => (val: string) => !!val || errTxt

export const email = (errTxt: string) => (val: string) =>
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/.test(
    val,
  ) || errTxt

export const shouldBeSame =
  (errTxt: string, secondField: Ref) => (val: unknown) =>
    val === secondField.value || errTxt
