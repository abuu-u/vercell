<template>
  <q-page class="row justify-center q-py-md">
    <div class="column form-wrapper">
      <h1 class="text-h4 self-center">{{ props.label }}</h1>

      <p class="text-italic text-negative">* – required field</p>

      <p v-if="error" class="bg-negative text-grey-1 q-pa-sm text-weight-bold">
        {{ error }}
      </p>

      <q-form class="q-gutter-y-md column" @submit="emit('submit')">
        <slot />

        <custom-button
          :label="props.label"
          type="submit"
          color="primary"
          size="18px"
        />

        <slot name="after-button" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CustomButton from 'src/components/CustomButton.vue'

const props = defineProps<{
  label: string
  error: string
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<style lang="scss">
.form-wrapper {
  width: 400px;
  padding: 0 20px;
}
</style>
