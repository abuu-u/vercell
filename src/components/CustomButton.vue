<template>
  <q-btn
    :label="props.label"
    :type="type"
    :color="color"
    size="18px"
    v-bind="{ ...buttonDesign, ...button.styles }"
    :href="href"
    :to="to"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useFormTheme, {
  ButtonDesign,
  ButtonStyle,
} from 'src/pinia/theme/form-theme'
import { computed } from 'vue'

type Type = 'a' | 'submit' | 'button' | 'reset' | 'image/png'

const props = defineProps<{
  label: string
  type?: Type
  color?: string
  size?: string
  href?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to?: string | any | undefined
  design?: ButtonDesign
  style?: ButtonStyle
}>()

const formTheme = useFormTheme()
const { button } = storeToRefs(formTheme)

const getDesignObj = (btnDesign?: ButtonDesign) => {
  if (!btnDesign) {
    return undefined
  }

  return btnDesign === 'default' ? undefined : { [btnDesign]: true }
}

const buttonDesign = computed(
  () => getDesignObj(props.design) ?? getDesignObj(button.value.design),
)
</script>
