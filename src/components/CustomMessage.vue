<template>
  <div
    class="message-wrapper"
    :class="{
      [messageType]: true,
    }"
  >
    <div class="message">
      <slot />

      <span class="message__sent-time">{{
        sentTime.toString().substring(16, 21)
      }}</span>
    </div>

    <div v-if="isRateShow" class="rate">
      <q-btn
        class="rate__btn"
        :disable="user.isBusy"
        outline
        color="primary"
        @click="onLikeClick"
        >😍</q-btn
      >
      <q-btn
        class="rate__btn"
        :disable="user.isBusy"
        outline
        color="primary"
        @click="onDislikeClick"
        >☹️</q-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import useUser from 'src/pinia/user'
import { MessageType } from 'src/services/chat'
import { computed } from 'vue'

const props = defineProps<{
  id: number
  type: MessageType
  sentTime: Date
}>()

const emit = defineEmits<{
  (e: 'like', id: number): void
  (e: 'dislike', id: number): void
  (e: 'ended', id: number): void
  (e: 'started', id: number): void
}>()

const messageType = MessageType[props.type]

const isRateShow = computed(() => props.type === MessageType.recivedGlobal)

const user = useUser()

const onLikeClick = () => {
  emit('like', props.id)
}

const onDislikeClick = () => {
  emit('dislike', props.id)
}
</script>

<style lang="scss">
.message-wrapper {
  display: flex;

  flex-direction: column;

  width: $message-width;
  padding: 0 8px;

  &[class*='sent'] {
    margin-left: auto;
  }

  &[class*='recived'] {
    margin-right: auto;
  }
}

.message {
  position: relative;

  display: flex;

  flex-direction: column;

  padding: 10px;

  &::before {
    position: absolute;
    bottom: 0;

    content: '';

    border: 0 solid transparent;
    border-bottom-width: 8px;
  }

  .message-wrapper[class*='sent'] & {
    border-radius: 6px 6px 0;

    &::before {
      left: 100%;

      border-right-width: 8px;
    }
  }

  .message-wrapper[class*='recived'] & {
    border-radius: 6px 6px 6px 0;

    &::before {
      right: 100%;

      border-left-width: 8px;
    }
  }

  .message-wrapper[class*='sentGlobal'] & {
    background: $sent-global;

    &::before {
      border-bottom-color: $sent-global;
    }
  }

  .message-wrapper[class*='sentPersonal'] & {
    background: $sent-personal;

    &::before {
      border-bottom-color: $sent-personal;
    }
  }

  .message-wrapper[class*='recivedGlobal'] & {
    background: $recived-global;

    &::before {
      border-bottom-color: $recived-global;
    }
  }

  .message-wrapper[class*='recivedPersonal'] & {
    background: $recived-personal;

    &::before {
      border-bottom-color: $recived-personal;
    }
  }

  .message-wrapper[class*='recivedRejected'] & {
    background: $recived-rejected;

    &::before {
      border-bottom-color: $recived-rejected;
    }
  }

  &__sent-time {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}

.rate {
  display: flex;

  column-gap: 10px;

  width: 100%;

  margin-top: 5px;

  &__btn {
    flex-grow: 1;
  }
}
</style>
