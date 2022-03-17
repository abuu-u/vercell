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

      <div v-if="isRateShow" class="rate">
        <q-btn
          class="rate__btn"
          :disable="!isFree"
          outline
          color="primary"
          @click="onLike(id)"
          >😍</q-btn
        >
        <q-btn
          class="rate__btn"
          :disable="!isFree"
          outline
          color="primary"
          @click="onDislike"
          >☹️</q-btn
        >
      </div>

      <div v-if="isRequestRateShow" class="rate">
        <q-btn
          class="rate__btn"
          :disable="!isFree"
          outline
          color="primary"
          @click="onAccept(id)"
          >😍</q-btn
        >
        <q-btn
          class="rate__btn"
          :disable="!isFree"
          outline
          color="primary"
          @click="onDecline(id)"
          >☹️</q-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUser from 'src/pinia/user'
import { AudioType } from 'src/services/chat'
import { UserStatus } from 'src/services/user'
import { computed } from 'vue'

const props = defineProps<{
  id: number
  type: AudioType
  sentTime: Date
}>()

const emit = defineEmits<{
  (e: 'like', id: number): void
  (e: 'dislike'): void
  (e: 'accept', id: number): void
  (e: 'decline', id: number): void
  (e: 'ended', id: number): void
  (e: 'started', id: number): void
}>()

const messageType = computed(() => AudioType[props.type])

const isRateShow = computed(() => props.type === AudioType.recivedGlobal)
const isRequestRateShow = computed(
  () => props.type === AudioType.recivedRequest,
)

const user = useUser()

const isFree = computed(() => user.status === UserStatus.free)

const onLike = (id: number) => {
  emit('like', id)
}
const onDislike = () => {
  emit('dislike')
}
const onAccept = (id: number) => {
  emit('accept', id)
}
const onDecline = (id: number) => {
  emit('decline', id)
}
</script>

<style lang="scss">
.message-wrapper {
  display: flex;

  &[class*='sent'] {
    padding-left: 70px;
  }

  &[class*='recived'] {
    padding-right: 70px;
  }
}

.message {
  position: relative;

  flex-grow: 1;

  max-width: 300px;

  padding: 10px;

  &::before {
    position: absolute;
    bottom: 0;

    content: '';

    border: 0 solid transparent;
    border-bottom-width: 8px;
  }

  .message-wrapper[class*='sent'] & {
    margin-right: 8px;
    margin-left: auto;

    border-radius: 6px 6px 0;

    &::before {
      left: 100%;

      border-right-width: 8px;
    }
  }

  .message-wrapper[class*='recived'] & {
    margin-right: auto;
    margin-left: 8px;

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

  .message-wrapper[class*='sentRequest'] & {
    background: $sent-request;

    &::before {
      border-bottom-color: $sent-request;
    }
  }

  .message-wrapper[class*='recivedRequest'] &,
  .message-wrapper[class*='recivedGlobal'] & {
    margin-bottom: 41px;

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

  .message-wrapper[class*='recivedRequest'] & {
    background: $recived-request;

    &::before {
      border-bottom-color: $recived-request;
    }
  }

  .message-wrapper[class*='recivedRejected'] & {
    background: $recived-rejected;

    &::before {
      border-bottom-color: $recived-rejected;
    }
  }

  .message-wrapper[class*='recivedRejectedRequest'] & {
    background: $recived-rejected-request;

    &::before {
      border-bottom-color: $recived-rejected-request;
    }
  }

  &__sent-time {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}

.rate {
  position: absolute;
  top: 100%;
  left: 0;

  display: flex;

  column-gap: 10px;

  width: 100%;

  margin-top: 5px;

  &__btn {
    flex-grow: 1;
  }
}
</style>
