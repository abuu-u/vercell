<template>
  <div class="q-pa-md q-pb-xl q-gutter-y-md">
    <p class="text-h5 text-center">Colors</p>

    <q-input
      v-model="primary"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Primary"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="primary">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="primary" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="secondary"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Secondary"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="secondary">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="secondary" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="accent"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Accent"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="accent">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="accent" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="dark"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Dark"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="dark">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="dark" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="positive"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Positive"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="positive">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="positive" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="negative"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Negative"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="negative">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="negative" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="info"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Info"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="info">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="info" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="warning"
      outlined
      :rules="['anyColor']"
      hide-bottom-space
      label="Warning"
    >
      <template #append>
        <q-icon name="colorize" class="cursor-pointer" color="warning">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="warning" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <p class="text-h5 text-center">Form</p>

    <p class="text-h6">Input & Select</p>

    <q-separator />
    <p class="text-body1 text-center">Design</p>

    <div class="row">
      <q-radio
        v-for="design in inputDesigns"
        :key="design"
        v-model="inputAndSelect.design"
        :val="design"
        :label="design"
      />
    </div>
    <q-separator />
    <p class="text-body1 text-center">Shape</p>

    <div class="row">
      <q-radio
        v-for="shape in inputShapes"
        :key="shape"
        v-model="inputAndSelect.shape"
        :val="shape"
        :label="shape"
      />
    </div>
    <q-separator />
    <p class="text-body1 text-center">Styles</p>

    <div class="row">
      <q-checkbox
        v-model="inputAndSelect.styles['hide-bottom-space']"
        label="Hide bottom space"
      />
      <q-checkbox v-model="inputAndSelect.styles.dense" label="Dense" />
    </div>

    <p class="text-h6">Button</p>

    <q-separator />
    <p class="text-body1 text-center">Design</p>

    <div class="row">
      <q-radio
        v-for="design in buttonDesigns"
        :key="design"
        v-model="button.design"
        :val="design"
        :label="design"
      />
    </div>

    <q-separator />
    <p class="text-body1 text-center">Styles</p>

    <div class="row">
      <q-checkbox v-model="button.styles.fab" label="fab" />
      <q-checkbox v-model="button.styles['fab-mini']" label="fab-mini" />
      <q-checkbox v-model="button.styles['no-caps']" label="no-caps" />
      <q-checkbox v-model="button.styles.glossy" label="glossy" />
      <q-checkbox v-model="button.styles.rounded" label="rounded" />
      <q-checkbox v-model="button.styles.unelevated" label="unelevated" />
    </div>

    <q-page-sticky class="q-pa-md">
      <q-fab
        color="primary"
        icon="keyboard_arrow_up"
        direction="up"
        vertical-actions-align="right"
      >
        <input
          ref="configRef"
          style="display: none"
          type="file"
          accept=".json"
          @change="onUploaded"
        />
        <q-fab-action
          color="secondary"
          icon="clear_all"
          label="Reset to defaults"
          @click="onReset"
        />
        <q-fab-action
          color="secondary"
          icon="download"
          label="Download as JSON"
          @click="onDownload"
        />
        <q-fab-action
          color="secondary"
          icon="attach_file"
          label="Load from JSON"
          @click="onUploadClick"
        />
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { exportFile, setCssVar } from 'quasar'
import useColorTheme, { ColorState } from 'src/pinia/theme/color-theme'
import useFormTheme, { FormState } from 'src/pinia/theme/form-theme'
import { watch, computed, unref, ref } from 'vue'

const inputDesigns = ['default', 'borderless', 'filled', 'outlined', 'standout']
const inputShapes = ['default', 'rounded', 'square']

const buttonDesigns = ['default', 'flat', 'outline', 'push']

const colorTheme = useColorTheme()
const { primary, secondary, accent, dark, positive, negative, info, warning } =
  storeToRefs(colorTheme)

const fromTheme = useFormTheme()
const { inputAndSelect, button } = storeToRefs(fromTheme)

const jsonRef = computed(() => ({
  color: unref(colorTheme.$state),
  ...unref(fromTheme.$state),
}))

const onDownload = () => {
  exportFile('theme.json', JSON.stringify(jsonRef.value))
}

const onReset = () => {
  colorTheme.$reset()
  fromTheme.$reset()
}

const configRef = ref()
const configModel = ref('')

watch([configModel], () => {
  const { color, ...form } = JSON.parse(configModel.value) as {
    color: ColorState
  } & FormState

  colorTheme.$patch(color)
  fromTheme.$patch(form)
})

const onUploadClick = () => {
  ;(configRef.value as HTMLElement)?.click()
}

const onUploaded = async () => {
  const { color, ...form } = JSON.parse(
    await (configRef.value as { files: File[] }).files[0].text(),
  ) as {
    color: ColorState
  } & FormState

  colorTheme.$patch(color)
  fromTheme.$patch(form)
}

watch(
  [primary, secondary, accent, dark, positive, negative, info, warning],
  () => {
    setCssVar('primary', primary.value)
    setCssVar('secondary', secondary.value)
    setCssVar('accent', accent.value)
    setCssVar('dark', dark.value)
    setCssVar('positive', positive.value)
    setCssVar('negative', negative.value)
    setCssVar('info', info.value)
    setCssVar('warning', warning.value)
  },
)
</script>
