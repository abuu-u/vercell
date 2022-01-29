<template>
  <q-input
    v-model="modelVal"
    v-bind="{ ...design, ...shape, ...inputAndSelect.styles }"
    :label="required ? `${label} *` : label"
    :type="props.type"
    :rules="rules"
    :lazy-rules="true"
  >
    <template #append>
      <slot />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ValidationRule } from 'quasar'
import useFormTheme from 'src/pinia/theme/form-theme'
import { ref, computed } from 'vue'

type Type =
  | 'text'
  | 'password'
  | 'textarea'
  | 'email'
  | 'search'
  | 'tel'
  | 'file'
  | 'number'
  | 'time'
  | 'date'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rules = ValidationRule<any>[]

const props = defineProps<{
  label: string
  type?: Type
  rules?: Rules
  required?: boolean
}>()

const formTheme = useFormTheme()
const { inputAndSelect } = storeToRefs(formTheme)

const modelVal = ref(null)

const design = computed(() =>
  inputAndSelect.value.design === 'default'
    ? void 0
    : { [inputAndSelect.value.design]: true },
)
const shape = computed(() =>
  inputAndSelect.value.shape === 'default'
    ? void 0
    : { [inputAndSelect.value.shape]: true },
)
</script>
