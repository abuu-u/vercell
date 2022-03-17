<template>
  <q-page class="row justify-center q-py-md">
    <div class="link-telegram column q-gutter-y-md">
      <p class="text-body1">
        You can link your Telegram account by clicking button below and entering
        provided code in our bot
      </p>

      <custom-button
        v-if="!code"
        label="Link Telegram"
        type="button"
        color="primary"
        size="18px"
        :loading="isLoading"
        @click="onTelegramClick"
      />

      <custom-button
        v-else
        :label="
          isCopiedToClipboard && isCopiedShow ? 'Copied to clipboard!' : code
        "
        type="button"
        color="primary"
        size="18px"
        :loading="isLoading"
        @click="onCodeClick"
      />

      <custom-button
        design="outline"
        label="Go to chat"
        color="primary"
        size="18px"
        to="/chat"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { copyToClipboard } from 'quasar'
import CustomButton from 'src/components/CustomButton.vue'
import { ref } from 'vue'

const isLoading = ref(false)
const code = ref('')
const isCopiedToClipboard = ref(false)
const isCopiedShow = ref(false)

const onTelegramClick = async () => {
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  code.value = '123456'
  isLoading.value = false
}

const onCodeClick = async () => {
  await copyToClipboard(code.value)
  isCopiedToClipboard.value = true
  isCopiedShow.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  isCopiedShow.value = false
}
</script>

<style lang="scss">
.link-telegram {
  max-width: 420px;
  padding: 0 20px;
}
</style>
